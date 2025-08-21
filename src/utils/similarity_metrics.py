"""Similarity metrics implementations (Phase 2)."""
from math import sqrt
from typing import List

def dot(a: List[float], b: List[float]) -> float:
    return sum(x*y for x, y in zip(a, b))

def l2_distance(a: List[float], b: List[float]) -> float:
    return sqrt(sum((x-y)**2 for x, y in zip(a, b)))

def cosine_similarity(a: List[float], b: List[float]) -> float:
    da = sqrt(sum(x*x for x in a))
    db = sqrt(sum(y*y for y in b))
    if da == 0 or db == 0:
        return 0.0
    return dot(a, b) / (da * db)