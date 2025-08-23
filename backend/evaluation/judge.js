/**
 * AI Judge System for Evaluating Model Outputs
 * Compares model responses against expected results using AI evaluation
 */

import { chatWithAI } from "../src/services/gemini.js";
import dotenv from "dotenv";

dotenv.config();

export class AIJudge {
  constructor() {
    this.evaluationCriteria = {
      accuracy: {
        weight: 0.3,
        description: "Correctness of factual information and final answers"
      },
      completeness: {
        weight: 0.25,
        description: "Coverage of all required elements and key points"
      },
      clarity: {
        weight: 0.2,
        description: "Clear explanation and logical organization"
      },
      methodology: {
        weight: 0.15,
        description: "Appropriate methods and reasoning approach"
      },
      educational_value: {
        weight: 0.1,
        description: "Learning value and pedagogical effectiveness"
      }
    };
  }

  /**
   * Generate judge prompt for evaluating a response
   */
  generateJudgePrompt(testCase, modelResponse, strategy) {
    const { question, expected_answer, evaluation_criteria, subject } = testCase;
    
    return `You are an expert educational evaluator. Your task is to evaluate an AI model's response to a student question.

**EVALUATION CONTEXT:**
- Subject: ${subject}
- Prompting Strategy: ${strategy}
- Question: "${question}"

**EXPECTED ANSWER REFERENCE:**
${JSON.stringify(expected_answer, null, 2)}

**EVALUATION CRITERIA:**
${JSON.stringify(evaluation_criteria, null, 2)}

**MODEL'S RESPONSE TO EVALUATE:**
${modelResponse}

**EVALUATION INSTRUCTIONS:**
Please evaluate the model's response across these dimensions (score 1-10 for each):

1. **ACCURACY (Weight: 30%)**
   - Are the facts, calculations, and final answers correct?
   - Does it match the expected solution/explanation?
   - Are there any factual errors or misconceptions?

2. **COMPLETENESS (Weight: 25%)**
   - Does it cover all required elements from the evaluation criteria?
   - Are key concepts and steps included?
   - Is anything important missing?

3. **CLARITY (Weight: 20%)**
   - Is the explanation clear and well-organized?
   - Would a student understand this response?
   - Is the language appropriate for the difficulty level?

4. **METHODOLOGY (Weight: 15%)**
   - Does it use appropriate problem-solving methods?
   - Is the reasoning approach sound?
   - Are the steps logical and well-sequenced?

5. **EDUCATIONAL VALUE (Weight: 10%)**
   - Would this help a student learn the concept?
   - Does it provide insight into the thinking process?
   - Is it pedagogically effective?

**OUTPUT FORMAT:**
Provide your evaluation in this exact JSON format:

{
  "overall_score": [weighted average 1-10],
  "dimension_scores": {
    "accuracy": [1-10],
    "completeness": [1-10], 
    "clarity": [1-10],
    "methodology": [1-10],
    "educational_value": [1-10]
  },
  "strengths": ["list of specific strengths"],
  "weaknesses": ["list of specific weaknesses"],
  "missing_elements": ["what's missing compared to expected answer"],
  "factual_errors": ["any incorrect information"],
  "improvement_suggestions": ["specific ways to improve"],
  "meets_criteria": {
    "accuracy": [true/false with brief reason],
    "completeness": [true/false with brief reason],
    "clarity": [true/false with brief reason],
    "methodology": [true/false with brief reason]
  },
  "grade": "[A/B/C/D/F]",
  "summary": "Brief overall assessment"
}

Be thorough, fair, and constructive in your evaluation. Focus on educational effectiveness and accuracy.`;
  }

  /**
   * Evaluate a model response using AI judge
   */
  async evaluateResponse(testCase, modelResponse, strategy) {
    try {
      const judgePrompt = this.generateJudgePrompt(testCase, modelResponse, strategy);
      
      // Get evaluation from AI judge
      const judgeResponse = await chatWithAI(judgePrompt, {
        promptingStrategy: 'zero-shot',
        temperature: 0.1 // Low temperature for consistent evaluation
      });

      // Parse the JSON response
      let evaluation;
      try {
        // Extract JSON from response (in case there's extra text)
        const jsonMatch = judgeResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          evaluation = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in judge response");
        }
      } catch (parseError) {
        console.warn("Failed to parse judge response as JSON, creating fallback evaluation");
        evaluation = this.createFallbackEvaluation(judgeResponse);
      }

      // Add metadata
      evaluation.metadata = {
        test_case_id: testCase.id,
        subject: testCase.subject,
        strategy: strategy,
        timestamp: new Date().toISOString(),
        judge_version: "1.0"
      };

      return evaluation;

    } catch (error) {
      console.error("Error in AI judge evaluation:", error);
      return this.createErrorEvaluation(error.message, testCase, strategy);
    }
  }

  /**
   * Create fallback evaluation when JSON parsing fails
   */
  createFallbackEvaluation(judgeResponse) {
    return {
      overall_score: 5.0,
      dimension_scores: {
        accuracy: 5,
        completeness: 5,
        clarity: 5,
        methodology: 5,
        educational_value: 5
      },
      strengths: ["Response generated successfully"],
      weaknesses: ["Could not parse detailed evaluation"],
      missing_elements: ["Detailed analysis unavailable"],
      factual_errors: ["Could not verify"],
      improvement_suggestions: ["Manual review recommended"],
      meets_criteria: {
        accuracy: "Unknown - parsing failed",
        completeness: "Unknown - parsing failed",
        clarity: "Unknown - parsing failed",
        methodology: "Unknown - parsing failed"
      },
      grade: "C",
      summary: "Evaluation parsing failed, manual review needed",
      raw_judge_response: judgeResponse
    };
  }

  /**
   * Create error evaluation when judge fails
   */
  createErrorEvaluation(errorMessage, testCase, strategy) {
    return {
      overall_score: 0.0,
      dimension_scores: {
        accuracy: 0,
        completeness: 0,
        clarity: 0,
        methodology: 0,
        educational_value: 0
      },
      strengths: [],
      weaknesses: ["Evaluation failed"],
      missing_elements: ["Could not evaluate"],
      factual_errors: ["Could not verify"],
      improvement_suggestions: ["Fix evaluation system"],
      meets_criteria: {
        accuracy: "Error - could not evaluate",
        completeness: "Error - could not evaluate", 
        clarity: "Error - could not evaluate",
        methodology: "Error - could not evaluate"
      },
      grade: "F",
      summary: `Evaluation failed: ${errorMessage}`,
      error: errorMessage,
      metadata: {
        test_case_id: testCase.id,
        subject: testCase.subject,
        strategy: strategy,
        timestamp: new Date().toISOString(),
        judge_version: "1.0",
        status: "error"
      }
    };
  }

  /**
   * Batch evaluate multiple responses
   */
  async batchEvaluate(evaluations) {
    const results = [];
    
    for (const evaluation of evaluations) {
      const { testCase, modelResponse, strategy } = evaluation;
      console.log(`Evaluating ${testCase.id} with ${strategy} strategy...`);
      
      const result = await this.evaluateResponse(testCase, modelResponse, strategy);
      results.push(result);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }

  /**
   * Calculate aggregate statistics from evaluations
   */
  calculateAggregateStats(evaluations) {
    if (evaluations.length === 0) return null;

    const validEvaluations = evaluations.filter(e => e.overall_score > 0);
    
    if (validEvaluations.length === 0) {
      return {
        total_evaluations: evaluations.length,
        valid_evaluations: 0,
        error_rate: 1.0,
        average_scores: null
      };
    }

    const stats = {
      total_evaluations: evaluations.length,
      valid_evaluations: validEvaluations.length,
      error_rate: (evaluations.length - validEvaluations.length) / evaluations.length,
      
      average_scores: {
        overall: this.calculateAverage(validEvaluations.map(e => e.overall_score)),
        accuracy: this.calculateAverage(validEvaluations.map(e => e.dimension_scores.accuracy)),
        completeness: this.calculateAverage(validEvaluations.map(e => e.dimension_scores.completeness)),
        clarity: this.calculateAverage(validEvaluations.map(e => e.dimension_scores.clarity)),
        methodology: this.calculateAverage(validEvaluations.map(e => e.dimension_scores.methodology)),
        educational_value: this.calculateAverage(validEvaluations.map(e => e.dimension_scores.educational_value))
      },
      
      grade_distribution: this.calculateGradeDistribution(validEvaluations),
      
      common_strengths: this.findCommonElements(validEvaluations.map(e => e.strengths)),
      common_weaknesses: this.findCommonElements(validEvaluations.map(e => e.weaknesses)),
      
      by_subject: this.groupBySubject(validEvaluations),
      by_strategy: this.groupByStrategy(validEvaluations)
    };

    return stats;
  }

  calculateAverage(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  calculateGradeDistribution(evaluations) {
    const grades = evaluations.map(e => e.grade);
    const distribution = {};
    
    ['A', 'B', 'C', 'D', 'F'].forEach(grade => {
      distribution[grade] = grades.filter(g => g === grade).length;
    });
    
    return distribution;
  }

  findCommonElements(arrays) {
    const allElements = arrays.flat();
    const counts = {};
    
    allElements.forEach(element => {
      counts[element] = (counts[element] || 0) + 1;
    });
    
    return Object.entries(counts)
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([element, count]) => ({ element, count }));
  }

  groupBySubject(evaluations) {
    const bySubject = {};
    
    evaluations.forEach(evaluation => {
      const subject = evaluation.metadata.subject;
      if (!bySubject[subject]) {
        bySubject[subject] = [];
      }
      bySubject[subject].push(evaluation);
    });
    
    // Calculate averages for each subject
    Object.keys(bySubject).forEach(subject => {
      const subjectEvals = bySubject[subject];
      bySubject[subject] = {
        count: subjectEvals.length,
        average_score: this.calculateAverage(subjectEvals.map(e => e.overall_score)),
        evaluations: subjectEvals
      };
    });
    
    return bySubject;
  }

  groupByStrategy(evaluations) {
    const byStrategy = {};
    
    evaluations.forEach(evaluation => {
      const strategy = evaluation.metadata.strategy;
      if (!byStrategy[strategy]) {
        byStrategy[strategy] = [];
      }
      byStrategy[strategy].push(evaluation);
    });
    
    // Calculate averages for each strategy
    Object.keys(byStrategy).forEach(strategy => {
      const strategyEvals = byStrategy[strategy];
      byStrategy[strategy] = {
        count: strategyEvals.length,
        average_score: this.calculateAverage(strategyEvals.map(e => e.overall_score)),
        evaluations: strategyEvals
      };
    });
    
    return byStrategy;
  }
}

export default AIJudge;
