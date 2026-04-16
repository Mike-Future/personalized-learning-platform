import numpy as np
from typing import Dict, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.learning import Progress

class AdaptiveLearningSystem:
    def __init__(self):
        self.difficulty_levels = ['beginner', 'intermediate', 'advanced', 'expert']
        self.engagement_thresholds = {
            'low': 0.3,
            'medium': 0.7,
            'high': 1.0
        }

    def calculate_engagement_score(self, progress: Progress) -> float:
        expected_time = progress.module.duration_minutes if progress.module else 30
        actual_time = progress.time_spent_minutes
        time_ratio = min(actual_time / expected_time, 2.0) / 2.0
        attempt_factor = 1 / (1 + np.exp(-progress.attempts + 2))
        score_factor = (progress.score or 0) / 100
        engagement = 0.4 * time_ratio + 0.3 * attempt_factor + 0.3 * score_factor
        return min(engagement, 1.0)

    def detect_struggle(self, user_id: int, module_id: int, db: Session) -> Dict:
        progress = db.query(Progress).filter(
            Progress.user_id == user_id,
            Progress.module_id == module_id
        ).first()

        if not progress:
            return {'struggling': False, 'confidence': 0}

        indicators = {
            'high_attempts': progress.attempts > 3,
            'low_score': (progress.score or 100) < 50,
            'time_spent_ratio': progress.time_spent_minutes / (progress.module.duration_minutes or 30),
            'multiple_confusion_signals': len(progress.confusion_indicators) > 2
        }

        struggle_score = sum([
            indicators['high_attempts'] * 0.3,
            indicators['low_score'] * 0.4,
            (indicators['time_spent_ratio'] > 2) * 0.2,
            indicators['multiple_confusion_signals'] * 0.1
        ])

        if struggle_score > 0.5:
            return {
                'struggling': True,
                'confidence': struggle_score,
                'indicators': [k for k, v in indicators.items() if v],
                'recommendations': self._generate_interventions(progress, indicators)
            }

        return {'struggling': False, 'confidence': 1 - struggle_score}

    def _generate_interventions(self, progress: Progress, indicators: Dict) -> List[Dict]:
        interventions = []
        if indicators['high_attempts']:
            interventions.append({
                'type': 'simplify_content',
                'action': 'break_into_smaller_chunks',
                'message': "Let's break this down into smaller steps"
            })
        if indicators['low_score']:
            interventions.append({
                'type': 'review_prerequisites',
                'action': 'suggest_review_material',
                'message': "You might want to review the basics first"
            })
        if indicators['time_spent_ratio']:
            interventions.append({
                'type': 'change_format',
                'action': 'offer_alternative_format',
                'message': "Try the video explanation instead"
            })
        return interventions

    def adjust_difficulty(self, user: User, current_performance: float) -> str:
        current_idx = self.difficulty_levels.index(user.current_level)
        if current_performance > 0.85 and current_idx < len(self.difficulty_levels) - 1:
            return self.difficulty_levels[current_idx + 1]
        elif current_performance < 0.5 and current_idx > 0:
            return self.difficulty_levels[current_idx - 1]
        return user.current_level

    def spaced_repetition_schedule(self, user_id: int, item_id: int, performance: float, db: Session) -> datetime:
        progress = db.query(Progress).filter(
            Progress.user_id == user_id,
            Progress.module_id == item_id
        ).first()

        if not progress or performance is None:
            return datetime.utcnow() + timedelta(days=1)

        ease_factor = 2.5
        if progress.completed_at:
            last_interval = (datetime.utcnow() - progress.completed_at).days
        else:
            last_interval = 0

        if performance >= 0.9:
            if last_interval == 0:
                new_interval = 1
            elif last_interval == 1:
                new_interval = 6
            else:
                new_interval = int(last_interval * ease_factor)
        elif performance >= 0.6:
            new_interval = 1
            ease_factor = max(1.3, ease_factor - 0.2)
        else:
            new_interval = 1
            ease_factor = max(1.3, ease_factor - 0.3)

        return datetime.utcnow() + timedelta(days=new_interval)

adaptive_system = AdaptiveLearningSystem()
