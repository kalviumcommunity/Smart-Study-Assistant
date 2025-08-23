/**
 * Evaluation Report Generator
 * Creates detailed HTML and text reports with scores, analysis, and recommendations
 */

import fs from 'fs/promises';
import path from 'path';
import { EvaluationMetrics } from './metrics.js';

export class EvaluationReportGenerator {
  constructor() {
    this.metrics = new EvaluationMetrics();
  }

  /**
   * Generate comprehensive evaluation report
   */
  async generateReport(evaluationData, options = {}) {
    const {
      format = 'both', // 'html', 'text', or 'both'
      outputDir = './evaluation/reports',
      includeDetails = true,
      includeCharts = false
    } = options;

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reports = {};

    // Generate text report
    if (format === 'text' || format === 'both') {
      const textReport = this.generateTextReport(evaluationData, includeDetails);
      const textPath = path.join(outputDir, `evaluation-report-${timestamp}.txt`);
      await fs.writeFile(textPath, textReport);
      reports.text = textPath;
      console.log(`📄 Text report saved: ${textPath}`);
    }

    // Generate HTML report
    if (format === 'html' || format === 'both') {
      const htmlReport = this.generateHTMLReport(evaluationData, includeDetails, includeCharts);
      const htmlPath = path.join(outputDir, `evaluation-report-${timestamp}.html`);
      await fs.writeFile(htmlPath, htmlReport);
      reports.html = htmlPath;
      console.log(`🌐 HTML report saved: ${htmlPath}`);
    }

    return reports;
  }

  /**
   * Generate text-based report
   */
  generateTextReport(evaluationData, includeDetails = true) {
    const { aggregate_stats, metadata, individual_evaluations } = evaluationData;
    const metricsAnalysis = this.metrics.exportMetricsSummary(individual_evaluations);

    let report = '';

    // Header
    report += '='.repeat(80) + '\n';
    report += 'SMART STUDY ASSISTANT - EVALUATION REPORT\n';
    report += '='.repeat(80) + '\n';
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `Evaluation Period: ${metadata.timestamp}\n`;
    report += `Total Tests: ${metadata.total_tests}\n`;
    report += `Successful Tests: ${metadata.successful_tests}\n`;
    report += `Evaluated Tests: ${metadata.evaluated_tests}\n\n`;

    // Executive Summary
    report += 'EXECUTIVE SUMMARY\n';
    report += '-'.repeat(40) + '\n';
    if (aggregate_stats.average_scores) {
      report += `Overall Performance: ${aggregate_stats.average_scores.overall.toFixed(2)}/10\n`;
      report += `Error Rate: ${(aggregate_stats.error_rate * 100).toFixed(1)}%\n`;
      
      const bestStrategy = Object.entries(aggregate_stats.by_strategy)
        .sort((a, b) => b[1].average_score - a[1].average_score)[0];
      report += `Best Strategy: ${bestStrategy[0]} (${bestStrategy[1].average_score.toFixed(2)}/10)\n`;
      
      const worstStrategy = Object.entries(aggregate_stats.by_strategy)
        .sort((a, b) => a[1].average_score - b[1].average_score)[0];
      report += `Worst Strategy: ${worstStrategy[0]} (${worstStrategy[1].average_score.toFixed(2)}/10)\n\n`;
    }

    // Performance Metrics
    report += 'PERFORMANCE METRICS\n';
    report += '-'.repeat(40) + '\n';
    if (aggregate_stats.average_scores) {
      Object.entries(this.metrics.metricDefinitions).forEach(([dimension, definition]) => {
        const score = aggregate_stats.average_scores[dimension];
        report += `${definition.name}: ${score.toFixed(2)}/10 (Weight: ${(definition.weight * 100).toFixed(0)}%)\n`;
      });
      report += '\n';
    }

    // Grade Distribution
    report += 'GRADE DISTRIBUTION\n';
    report += '-'.repeat(40) + '\n';
    Object.entries(aggregate_stats.grade_distribution).forEach(([grade, count]) => {
      const percentage = ((count / metadata.evaluated_tests) * 100).toFixed(1);
      report += `${grade}: ${count} tests (${percentage}%)\n`;
    });
    report += '\n';

    // Strategy Comparison
    report += 'STRATEGY COMPARISON\n';
    report += '-'.repeat(40) + '\n';
    Object.entries(aggregate_stats.by_strategy)
      .sort((a, b) => b[1].average_score - a[1].average_score)
      .forEach(([strategy, data]) => {
        report += `${strategy.padEnd(20)}: ${data.average_score.toFixed(2)}/10 (${data.count} tests)\n`;
      });
    report += '\n';

    // Subject Performance
    report += 'SUBJECT PERFORMANCE\n';
    report += '-'.repeat(40) + '\n';
    Object.entries(aggregate_stats.by_subject)
      .sort((a, b) => b[1].average_score - a[1].average_score)
      .forEach(([subject, data]) => {
        report += `${subject.padEnd(20)}: ${data.average_score.toFixed(2)}/10 (${data.count} tests)\n`;
      });
    report += '\n';

    // Insights and Recommendations
    if (metricsAnalysis.insights) {
      report += 'INSIGHTS AND RECOMMENDATIONS\n';
      report += '-'.repeat(40) + '\n';
      
      metricsAnalysis.insights.recommendations.forEach((rec, index) => {
        report += `${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}\n`;
      });
      report += '\n';
    }

    // Common Strengths and Weaknesses
    if (aggregate_stats.common_strengths.length > 0) {
      report += 'COMMON STRENGTHS\n';
      report += '-'.repeat(40) + '\n';
      aggregate_stats.common_strengths.forEach(({ element, count }) => {
        report += `• ${element} (mentioned ${count} times)\n`;
      });
      report += '\n';
    }

    if (aggregate_stats.common_weaknesses.length > 0) {
      report += 'COMMON WEAKNESSES\n';
      report += '-'.repeat(40) + '\n';
      aggregate_stats.common_weaknesses.forEach(({ element, count }) => {
        report += `• ${element} (mentioned ${count} times)\n`;
      });
      report += '\n';
    }

    // Detailed Results (if requested)
    if (includeDetails && individual_evaluations.length > 0) {
      report += 'DETAILED EVALUATION RESULTS\n';
      report += '-'.repeat(40) + '\n';
      
      individual_evaluations.forEach((evaluation, index) => {
        report += `\n${index + 1}. Test Case: ${evaluation.metadata.test_case_id}\n`;
        report += `   Subject: ${evaluation.metadata.subject}\n`;
        report += `   Strategy: ${evaluation.metadata.strategy}\n`;
        report += `   Overall Score: ${evaluation.overall_score.toFixed(2)}/10\n`;
        report += `   Grade: ${evaluation.grade}\n`;
        
        if (evaluation.dimension_scores) {
          report += '   Dimension Scores:\n';
          Object.entries(evaluation.dimension_scores).forEach(([dim, score]) => {
            report += `     ${dim}: ${score}/10\n`;
          });
        }
        
        if (evaluation.strengths.length > 0) {
          report += `   Strengths: ${evaluation.strengths.join(', ')}\n`;
        }
        
        if (evaluation.weaknesses.length > 0) {
          report += `   Weaknesses: ${evaluation.weaknesses.join(', ')}\n`;
        }
        
        report += `   Summary: ${evaluation.summary}\n`;
      });
    }

    return report;
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(evaluationData, includeDetails = true, includeCharts = false) {
    const { aggregate_stats, metadata, individual_evaluations } = evaluationData;
    const metricsAnalysis = this.metrics.exportMetricsSummary(individual_evaluations);

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Study Assistant - Evaluation Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; }
        .summary { background: #ecf0f1; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .metric-card { background: white; border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .score { font-size: 24px; font-weight: bold; color: #27ae60; }
        .grade-A { color: #27ae60; }
        .grade-B { color: #f39c12; }
        .grade-C { color: #e67e22; }
        .grade-D { color: #e74c3c; }
        .grade-F { color: #c0392b; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background: #34495e; color: white; }
        .recommendation { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .high-priority { border-left: 4px solid #e74c3c; }
        .medium-priority { border-left: 4px solid #f39c12; }
        .low-priority { border-left: 4px solid #27ae60; }
        .chart-container { margin: 20px 0; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 Smart Study Assistant - Evaluation Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <p>Evaluation Period: ${metadata.timestamp}</p>
    </div>

    <div class="summary">
        <h2>📊 Executive Summary</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div class="metric-card">
                <h3>Overall Performance</h3>
                <div class="score">${aggregate_stats.average_scores ? aggregate_stats.average_scores.overall.toFixed(2) : 'N/A'}/10</div>
            </div>
            <div class="metric-card">
                <h3>Tests Completed</h3>
                <div class="score">${metadata.evaluated_tests}/${metadata.total_tests}</div>
            </div>
            <div class="metric-card">
                <h3>Success Rate</h3>
                <div class="score">${((1 - aggregate_stats.error_rate) * 100).toFixed(1)}%</div>
            </div>
        </div>
    </div>`;

    // Performance Metrics
    if (aggregate_stats.average_scores) {
      html += `
    <h2>🎯 Performance Metrics</h2>
    <table>
        <thead>
            <tr>
                <th>Metric</th>
                <th>Score</th>
                <th>Weight</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>`;
      
      Object.entries(this.metrics.metricDefinitions).forEach(([dimension, definition]) => {
        const score = aggregate_stats.average_scores[dimension];
        html += `
            <tr>
                <td>${definition.name}</td>
                <td><strong>${score.toFixed(2)}/10</strong></td>
                <td>${(definition.weight * 100).toFixed(0)}%</td>
                <td>${definition.description}</td>
            </tr>`;
      });
      
      html += `
        </tbody>
    </table>`;
    }

    // Grade Distribution
    html += `
    <h2>📈 Grade Distribution</h2>
    <table>
        <thead>
            <tr>
                <th>Grade</th>
                <th>Count</th>
                <th>Percentage</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>`;
    
    Object.entries(aggregate_stats.grade_distribution).forEach(([grade, count]) => {
      const percentage = ((count / metadata.evaluated_tests) * 100).toFixed(1);
      const description = this.metrics.gradeScale[grade]?.description || '';
      html += `
            <tr>
                <td class="grade-${grade}"><strong>${grade}</strong></td>
                <td>${count}</td>
                <td>${percentage}%</td>
                <td>${description}</td>
            </tr>`;
    });
    
    html += `
        </tbody>
    </table>`;

    // Strategy Comparison
    html += `
    <h2>🔄 Strategy Comparison</h2>
    <table>
        <thead>
            <tr>
                <th>Strategy</th>
                <th>Average Score</th>
                <th>Test Count</th>
                <th>Performance</th>
            </tr>
        </thead>
        <tbody>`;
    
    Object.entries(aggregate_stats.by_strategy)
      .sort((a, b) => b[1].average_score - a[1].average_score)
      .forEach(([strategy, data]) => {
        const grade = this.metrics.scoreToGrade(data.average_score);
        html += `
            <tr>
                <td><strong>${strategy}</strong></td>
                <td>${data.average_score.toFixed(2)}/10</td>
                <td>${data.count}</td>
                <td class="grade-${grade}">${grade}</td>
            </tr>`;
      });
    
    html += `
        </tbody>
    </table>`;

    // Recommendations
    if (metricsAnalysis.insights && metricsAnalysis.insights.recommendations.length > 0) {
      html += `
    <h2>💡 Recommendations</h2>`;
      
      metricsAnalysis.insights.recommendations.forEach((rec, index) => {
        html += `
    <div class="recommendation ${rec.priority}-priority">
        <strong>${rec.priority.toUpperCase()} PRIORITY:</strong> ${rec.message}
    </div>`;
      });
    }

    // Detailed Results (if requested)
    if (includeDetails && individual_evaluations.length > 0) {
      html += `
    <h2>📋 Detailed Results</h2>
    <table>
        <thead>
            <tr>
                <th>Test Case</th>
                <th>Subject</th>
                <th>Strategy</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Summary</th>
            </tr>
        </thead>
        <tbody>`;
      
      individual_evaluations.forEach(evaluation => {
        html += `
            <tr>
                <td>${evaluation.metadata.test_case_id}</td>
                <td>${evaluation.metadata.subject}</td>
                <td>${evaluation.metadata.strategy}</td>
                <td>${evaluation.overall_score.toFixed(2)}/10</td>
                <td class="grade-${evaluation.grade}"><strong>${evaluation.grade}</strong></td>
                <td>${evaluation.summary}</td>
            </tr>`;
      });
      
      html += `
        </tbody>
    </table>`;
    }

    html += `
    <div style="margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
        <p><em>Report generated by Smart Study Assistant Evaluation System</em></p>
        <p>For more information, visit the project repository</p>
    </div>
</body>
</html>`;

    return html;
  }

  /**
   * Generate comparison report between multiple evaluation runs
   */
  async generateComparisonReport(evaluationRuns, outputDir = './evaluation/reports') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(outputDir, `comparison-report-${timestamp}.html`);
    
    await fs.mkdir(outputDir, { recursive: true });

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Evaluation Comparison Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background: #34495e; color: white; }
        .improvement { color: #27ae60; font-weight: bold; }
        .decline { color: #e74c3c; font-weight: bold; }
        .stable { color: #7f8c8d; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Evaluation Comparison Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <p>Comparing ${evaluationRuns.length} evaluation runs</p>
    </div>

    <h2>Performance Trends</h2>
    <table>
        <thead>
            <tr>
                <th>Run</th>
                <th>Date</th>
                <th>Overall Score</th>
                <th>Change</th>
                <th>Best Strategy</th>
                <th>Tests</th>
            </tr>
        </thead>
        <tbody>`;

    evaluationRuns.forEach((run, index) => {
      const prevRun = index > 0 ? evaluationRuns[index - 1] : null;
      const currentScore = run.aggregate_stats.average_scores?.overall || 0;
      const prevScore = prevRun?.aggregate_stats.average_scores?.overall || 0;
      const change = prevRun ? currentScore - prevScore : 0;
      
      const bestStrategy = Object.entries(run.aggregate_stats.by_strategy)
        .sort((a, b) => b[1].average_score - a[1].average_score)[0];

      let changeClass = 'stable';
      let changeText = 'N/A';
      if (change > 0.1) {
        changeClass = 'improvement';
        changeText = `+${change.toFixed(2)}`;
      } else if (change < -0.1) {
        changeClass = 'decline';
        changeText = change.toFixed(2);
      } else if (prevRun) {
        changeText = '±0.00';
      }

      html += `
            <tr>
                <td>Run ${index + 1}</td>
                <td>${new Date(run.metadata.timestamp).toLocaleDateString()}</td>
                <td>${currentScore.toFixed(2)}/10</td>
                <td class="${changeClass}">${changeText}</td>
                <td>${bestStrategy ? bestStrategy[0] : 'N/A'}</td>
                <td>${run.metadata.evaluated_tests}</td>
            </tr>`;
    });

    html += `
        </tbody>
    </table>
</body>
</html>`;

    await fs.writeFile(reportPath, html);
    console.log(`📊 Comparison report saved: ${reportPath}`);
    
    return reportPath;
  }
}

export default EvaluationReportGenerator;
