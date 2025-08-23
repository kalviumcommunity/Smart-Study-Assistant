/**
 * Comprehensive Evaluation Metrics System
 * Provides detailed metrics for accuracy, reasoning quality, format compliance, and educational value
 */

export class EvaluationMetrics {
  constructor() {
    this.metricDefinitions = {
      accuracy: {
        name: "Accuracy",
        description: "Correctness of factual information and final answers",
        weight: 0.3,
        scale: "1-10",
        criteria: [
          "Factual correctness",
          "Mathematical accuracy", 
          "Scientific precision",
          "Historical accuracy",
          "Logical validity"
        ]
      },
      completeness: {
        name: "Completeness",
        description: "Coverage of all required elements and key points",
        weight: 0.25,
        scale: "1-10",
        criteria: [
          "All key concepts covered",
          "Required steps included",
          "Important details present",
          "Comprehensive coverage",
          "Nothing critical missing"
        ]
      },
      clarity: {
        name: "Clarity",
        description: "Clear explanation and logical organization",
        weight: 0.2,
        scale: "1-10",
        criteria: [
          "Clear language",
          "Logical structure",
          "Easy to understand",
          "Well-organized",
          "Appropriate vocabulary"
        ]
      },
      methodology: {
        name: "Methodology",
        description: "Appropriate methods and reasoning approach",
        weight: 0.15,
        scale: "1-10",
        criteria: [
          "Correct approach",
          "Sound reasoning",
          "Appropriate methods",
          "Logical progression",
          "Valid techniques"
        ]
      },
      educational_value: {
        name: "Educational Value",
        description: "Learning value and pedagogical effectiveness",
        weight: 0.1,
        scale: "1-10",
        criteria: [
          "Helps learning",
          "Builds understanding",
          "Provides insights",
          "Engaging content",
          "Memorable explanation"
        ]
      }
    };

    this.gradeScale = {
      A: { min: 9.0, max: 10.0, description: "Excellent" },
      B: { min: 7.0, max: 8.9, description: "Good" },
      C: { min: 5.0, max: 6.9, description: "Satisfactory" },
      D: { min: 3.0, max: 4.9, description: "Needs Improvement" },
      F: { min: 0.0, max: 2.9, description: "Unsatisfactory" }
    };
  }

  /**
   * Calculate weighted overall score from dimension scores
   */
  calculateOverallScore(dimensionScores) {
    let weightedSum = 0;
    let totalWeight = 0;

    Object.entries(this.metricDefinitions).forEach(([dimension, definition]) => {
      if (dimensionScores[dimension] !== undefined) {
        weightedSum += dimensionScores[dimension] * definition.weight;
        totalWeight += definition.weight;
      }
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Convert numeric score to letter grade
   */
  scoreToGrade(score) {
    for (const [grade, range] of Object.entries(this.gradeScale)) {
      if (score >= range.min && score <= range.max) {
        return grade;
      }
    }
    return 'F'; // Default fallback
  }

  /**
   * Analyze score distribution
   */
  analyzeScoreDistribution(scores) {
    if (scores.length === 0) return null;

    const sorted = [...scores].sort((a, b) => a - b);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);

    return {
      count: scores.length,
      mean: parseFloat(mean.toFixed(2)),
      median: parseFloat(median.toFixed(2)),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      standardDeviation: parseFloat(standardDeviation.toFixed(2)),
      quartiles: {
        q1: sorted[Math.floor(scores.length * 0.25)],
        q3: sorted[Math.floor(scores.length * 0.75)]
      }
    };
  }

  /**
   * Calculate performance metrics by category
   */
  calculateCategoryMetrics(evaluations, categoryField) {
    const categories = {};

    evaluations.forEach(evaluation => {
      const category = evaluation.metadata[categoryField];
      if (!categories[category]) {
        categories[category] = {
          evaluations: [],
          scores: []
        };
      }
      categories[category].evaluations.push(evaluation);
      categories[category].scores.push(evaluation.overall_score);
    });

    // Calculate statistics for each category
    Object.keys(categories).forEach(category => {
      const categoryData = categories[category];
      categoryData.statistics = this.analyzeScoreDistribution(categoryData.scores);
      categoryData.grade_distribution = this.calculateGradeDistribution(categoryData.evaluations);
      categoryData.average_dimensions = this.calculateAverageDimensions(categoryData.evaluations);
    });

    return categories;
  }

  /**
   * Calculate grade distribution
   */
  calculateGradeDistribution(evaluations) {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    evaluations.forEach(evaluation => {
      const grade = evaluation.grade || this.scoreToGrade(evaluation.overall_score);
      if (distribution.hasOwnProperty(grade)) {
        distribution[grade]++;
      }
    });

    return distribution;
  }

  /**
   * Calculate average dimension scores
   */
  calculateAverageDimensions(evaluations) {
    const dimensions = {};
    const counts = {};

    evaluations.forEach(evaluation => {
      Object.entries(evaluation.dimension_scores).forEach(([dimension, score]) => {
        dimensions[dimension] = (dimensions[dimension] || 0) + score;
        counts[dimension] = (counts[dimension] || 0) + 1;
      });
    });

    Object.keys(dimensions).forEach(dimension => {
      dimensions[dimension] = parseFloat((dimensions[dimension] / counts[dimension]).toFixed(2));
    });

    return dimensions;
  }

  /**
   * Identify performance patterns
   */
  identifyPerformancePatterns(evaluations) {
    const patterns = {
      strengths: {},
      weaknesses: {},
      correlations: {},
      trends: {}
    };

    // Analyze common strengths and weaknesses
    evaluations.forEach(evaluation => {
      evaluation.strengths.forEach(strength => {
        patterns.strengths[strength] = (patterns.strengths[strength] || 0) + 1;
      });
      
      evaluation.weaknesses.forEach(weakness => {
        patterns.weaknesses[weakness] = (patterns.weaknesses[weakness] || 0) + 1;
      });
    });

    // Sort by frequency
    patterns.strengths = Object.entries(patterns.strengths)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    patterns.weaknesses = Object.entries(patterns.weaknesses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    // Analyze dimension correlations
    const dimensions = ['accuracy', 'completeness', 'clarity', 'methodology', 'educational_value'];
    dimensions.forEach(dim1 => {
      dimensions.forEach(dim2 => {
        if (dim1 !== dim2) {
          const correlation = this.calculateCorrelation(
            evaluations.map(e => e.dimension_scores[dim1]),
            evaluations.map(e => e.dimension_scores[dim2])
          );
          patterns.correlations[`${dim1}_${dim2}`] = parseFloat(correlation.toFixed(3));
        }
      });
    });

    return patterns;
  }

  /**
   * Calculate correlation coefficient between two arrays
   */
  calculateCorrelation(x, y) {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
    const sumY2 = y.reduce((sum, val) => sum + val * val, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Generate performance insights
   */
  generateInsights(evaluations) {
    const insights = {
      overall_performance: null,
      best_performing: {},
      worst_performing: {},
      improvement_areas: [],
      recommendations: []
    };

    if (evaluations.length === 0) return insights;

    // Overall performance
    const overallScores = evaluations.map(e => e.overall_score);
    insights.overall_performance = this.analyzeScoreDistribution(overallScores);

    // Best and worst performing by strategy
    const byStrategy = this.calculateCategoryMetrics(evaluations, 'strategy');
    const strategyPerformance = Object.entries(byStrategy)
      .map(([strategy, data]) => ({ strategy, score: data.statistics.mean }))
      .sort((a, b) => b.score - a.score);

    if (strategyPerformance.length > 0) {
      insights.best_performing.strategy = strategyPerformance[0];
      insights.worst_performing.strategy = strategyPerformance[strategyPerformance.length - 1];
    }

    // Best and worst performing by subject
    const bySubject = this.calculateCategoryMetrics(evaluations, 'subject');
    const subjectPerformance = Object.entries(bySubject)
      .map(([subject, data]) => ({ subject, score: data.statistics.mean }))
      .sort((a, b) => b.score - a.score);

    if (subjectPerformance.length > 0) {
      insights.best_performing.subject = subjectPerformance[0];
      insights.worst_performing.subject = subjectPerformance[subjectPerformance.length - 1];
    }

    // Identify improvement areas
    const avgDimensions = this.calculateAverageDimensions(evaluations);
    const sortedDimensions = Object.entries(avgDimensions)
      .sort((a, b) => a[1] - b[1]);

    insights.improvement_areas = sortedDimensions.slice(0, 3).map(([dimension, score]) => ({
      dimension,
      score,
      description: this.metricDefinitions[dimension]?.description || dimension
    }));

    // Generate recommendations
    insights.recommendations = this.generateRecommendations(evaluations, insights);

    return insights;
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations(evaluations, insights) {
    const recommendations = [];

    // Performance-based recommendations
    if (insights.overall_performance.mean < 6.0) {
      recommendations.push({
        type: "overall",
        priority: "high",
        message: "Overall performance is below satisfactory. Consider reviewing prompting strategies and training data."
      });
    }

    // Strategy-specific recommendations
    if (insights.best_performing.strategy && insights.worst_performing.strategy) {
      const scoreDiff = insights.best_performing.strategy.score - insights.worst_performing.strategy.score;
      if (scoreDiff > 2.0) {
        recommendations.push({
          type: "strategy",
          priority: "medium",
          message: `${insights.best_performing.strategy.strategy} significantly outperforms ${insights.worst_performing.strategy.strategy}. Consider optimizing the weaker strategy.`
        });
      }
    }

    // Dimension-specific recommendations
    insights.improvement_areas.forEach(area => {
      if (area.score < 5.0) {
        recommendations.push({
          type: "dimension",
          priority: "high",
          message: `${area.dimension} needs significant improvement (${area.score}/10). Focus on ${area.description.toLowerCase()}.`
        });
      }
    });

    return recommendations;
  }

  /**
   * Export metrics summary
   */
  exportMetricsSummary(evaluations) {
    return {
      metadata: {
        total_evaluations: evaluations.length,
        timestamp: new Date().toISOString(),
        metrics_version: "1.0"
      },
      metric_definitions: this.metricDefinitions,
      grade_scale: this.gradeScale,
      performance_analysis: {
        overall: this.analyzeScoreDistribution(evaluations.map(e => e.overall_score)),
        by_dimension: this.calculateAverageDimensions(evaluations),
        by_strategy: this.calculateCategoryMetrics(evaluations, 'strategy'),
        by_subject: this.calculateCategoryMetrics(evaluations, 'subject')
      },
      patterns: this.identifyPerformancePatterns(evaluations),
      insights: this.generateInsights(evaluations)
    };
  }
}

export default EvaluationMetrics;
