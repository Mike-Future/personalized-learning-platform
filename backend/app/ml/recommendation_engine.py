import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import NMF
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.course import Course
from app.models.learning import Enrollment, Progress
from sentence_transformers import SentenceTransformer
from typing import List, Dict
import json

class RecommendationEngine:
    def __init__(self):
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.collaborative_model = None
        self.content_vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')

    def extract_user_features(self, user: User, db: Session) -> np.ndarray:
        style_map = {'visual': 0, 'auditory': 1, 'reading': 2, 'kinesthetic': 3}
        style_vector = np.zeros(4)
        if user.learning_style:
            style_vector[style_map[user.learning_style.value]] = 1

        level_map = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
        level_vector = np.zeros(3)
        level_vector[level_map.get(user.current_level, 0)] = 1

        engagement_features = np.array([
            user.total_learning_time / 1000,
            user.completed_courses / 10,
            user.average_score / 100,
        ])

        enrollments = db.query(Enrollment).filter(Enrollment.user_id == user.id).all()
        category_counts = {}
        for e in enrollments:
            course = db.query(Course).filter(Course.id == e.course_id).first()
            if course:
                category_counts[course.category] = category_counts.get(course.category, 0) + 1

        all_categories = [c.category for c in db.query(Course.category).distinct().all()]
        category_vector = np.array([category_counts.get(cat, 0) for cat in all_categories])
        if category_vector.sum() > 0:
            category_vector = category_vector / category_vector.sum()

        return np.concatenate([style_vector, level_vector, engagement_features, category_vector])

    def collaborative_filtering(self, user_id: int, db: Session, n_recommendations: int = 5) -> List[Dict]:
        enrollments = db.query(Enrollment).all()
        users = list(set([e.user_id for e in enrollments]))
        courses = list(set([e.course_id for e in enrollments]))

        user_idx = {u: i for i, u in enumerate(users)}
        course_idx = {c: i for i, c in enumerate(courses)}

        interaction_matrix = np.zeros((len(users), len(courses)))
        for e in enrollments:
            interaction_matrix[user_idx[e.user_id], course_idx[e.course_id]] = 1

        nmf = NMF(n_components=15, init='random', random_state=42)
        user_features = nmf.fit_transform(interaction_matrix)
        item_features = nmf.components_

        if user_id not in user_idx:
            return []

        user_vector = user_features[user_idx[user_id]]
        scores = np.dot(user_vector, item_features)

        enrolled_courses = set(e.course_id for e in enrollments if e.user_id == user_id)

        recommendations = []
        for course_id, score in sorted(zip(courses, scores), key=lambda x: x[1], reverse=True):
            if course_id not in enrolled_courses:
                course = db.query(Course).filter(Course.id == course_id).first()
                recommendations.append({
                    'course_id': course_id,
                    'score': float(score),
                    'reason': 'Students like you enjoyed this course',
                    'course': course
                })
                if len(recommendations) >= n_recommendations:
                    break

        return recommendations

    def content_based_filtering(self, user: User, db: Session, n_recommendations: int = 5) -> List[Dict]:
        enrollments = db.query(Enrollment).filter(Enrollment.user_id == user.id).all()

        if not enrollments:
            return self._cold_start_recommendations(user, db, n_recommendations)

        enrolled_course_ids = [e.course_id for e in enrollments]
        courses = db.query(Course).filter(Course.id.in_(enrolled_course_ids)).all()

        course_texts = [f"{c.title} {c.description} {' '.join(c.tags)}" for c in courses]
        user_embedding = np.mean(self.embedding_model.encode(course_texts), axis=0)

        all_courses = db.query(Course).filter(~Course.id.in_(enrolled_course_ids)).all()
        all_course_texts = [f"{c.title} {c.description} {' '.join(c.tags)}" for c in all_courses]
        course_embeddings = self.embedding_model.encode(all_course_texts)

        similarities = cosine_similarity([user_embedding], course_embeddings)[0]

        recommendations = []
        for idx in np.argsort(similarities)[::-1][:n_recommendations]:
            course = all_courses[idx]
            recommendations.append({
                'course_id': course.id,
                'score': float(similarities[idx]),
                'reason': f"Based on your interest in {courses[0].category}",
                'course': course
            })

        return recommendations

    def _cold_start_recommendations(self, user: User, db: Session, n: int) -> List[Dict]:
        query = db.query(Course)
        if user.interests:
            query = query.filter(Course.category.in_(user.interests))
        query = query.filter(Course.difficulty_level == user.current_level)
        courses = query.order_by(Course.id.desc()).limit(n).all()

        return [{
            'course_id': c.id,
            'score': 0.5,
            'reason': 'Popular in your area of interest',
            'course': c
        } for c in courses]

    def knowledge_tracing(self, user_id: int, module_id: int, db: Session) -> Dict:
        progress_records = db.query(Progress).filter(
            Progress.user_id == user_id
        ).order_by(Progress.started_at).all()

        if not progress_records:
            return {'mastery_probability': 0.5, 'recommended_action': 'start'}

        p_l = 0.5
        p_t = 0.3
        p_g = 0.2
        p_s = 0.1

        for record in progress_records:
            if record.score is not None:
                correct = record.score > 0.7
                if correct:
                    p_l = (p_l * (1 - p_s)) / (p_l * (1 - p_s) + (1 - p_l) * p_g)
                else:
                    p_l = (p_l * p_s) / (p_l * p_s + (1 - p_l) * (1 - p_g))
                p_l = p_l + (1 - p_l) * p_t

        if p_l < 0.4:
            action = 'review_prerequisites'
        elif p_l < 0.7:
            action = 'practice_more'
        else:
            action = 'advance'

        return {
            'mastery_probability': float(p_l),
            'recommended_action': action,
            'estimated_time_to_mastery': int((0.9 - p_l) * 60) if p_l < 0.9 else 0
        }

    def generate_learning_path(self, user: User, target_skill: str, db: Session) -> List[Dict]:
        related_courses = db.query(Course).filter(
            Course.category.ilike(f"%{target_skill}%")
        ).all()

        graph = {}
        for course in related_courses:
            graph[course.id] = course.prerequisites or []

        visited = set()
        path = []

        def dfs(course_id):
            if course_id in visited:
                return
            visited.add(course_id)
            for prereq in graph.get(course_id, []):
                dfs(prereq)
            path.append(course_id)

        for course in related_courses:
            dfs(course.id)

        learning_path = []
        for course_id in path:
            course = db.query(Course).filter(Course.id == course_id).first()
            if user.current_level == 'beginner' and course.difficulty_level == 'advanced':
                continue
            learning_path.append({
                'course_id': course.id,
                'title': course.title,
                'estimated_duration': course.duration_minutes,
                'adaptive_notes': self._generate_adaptive_notes(course, user)
            })

        return learning_path

    def _generate_adaptive_notes(self, course: Course, user: User) -> str:
        notes = []
        if user.learning_style == 'visual' and course.modules:
            notes.append("Focus on video modules and diagrams")
        elif user.learning_style == 'reading':
            notes.append("Review text transcripts and supplementary reading")
        if user.weak_areas and course.category in user.weak_areas:
            notes.append("Extra practice recommended - this is a growth area")
        return " | ".join(notes) if notes else "Standard progression recommended"

recommendation_engine = RecommendationEngine()
