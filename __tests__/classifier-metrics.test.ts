import { describe, it, expect } from 'vitest'
import { classifyQuery, QueryClassification } from '@/lib/guardrails/classifier'
import { testDataset } from '@/lib/guardrails/eval-dataset'

interface MetricsResult {
  accuracy: number
  precision: Record<QueryClassification, number>
  recall: Record<QueryClassification, number>
  f1Score: Record<QueryClassification, number>
  confusionMatrix: Record<string, Record<string, number>>
  totalTestCases: number
  correctPredictions: number
}

/**
 * Calculate evaluation metrics for multi-class classification
 */
function calculateMetrics(
  predictions: QueryClassification[],
  expected: QueryClassification[]
): MetricsResult {
  const classes: QueryClassification[] = [
    'SAFE_RAG',
    'ELIGIBILITY_QUERY',
    'LEGAL_ADVICE',
    'EMERGENCY',
    'OUT_OF_SCOPE',
  ]

  // Initialize confusion matrix
  const confusionMatrix: Record<string, Record<string, number>> = {}
  classes.forEach(cls => {
    confusionMatrix[cls] = {}
    classes.forEach(pred => {
      confusionMatrix[cls][pred] = 0
    })
  })

  // Build confusion matrix
  let correctPredictions = 0
  expected.forEach((exp, idx) => {
    const pred = predictions[idx]
    confusionMatrix[exp][pred]++
    if (exp === pred) {
      correctPredictions++
    }
  })

  // Calculate overall accuracy
  const accuracy = correctPredictions / expected.length

  // Calculate per-class metrics (one-vs-rest)
  const precision: Record<QueryClassification, number> = {} as Record<QueryClassification, number>
  const recall: Record<QueryClassification, number> = {} as Record<QueryClassification, number>
  const f1Score: Record<QueryClassification, number> = {} as Record<QueryClassification, number>

  classes.forEach(cls => {
    // True Positives: diagonal of confusion matrix
    const tp = confusionMatrix[cls][cls]

    // False Positives: sum of column minus diagonal
    const fp = Object.keys(confusionMatrix).reduce((sum, key) => {
      return sum + (confusionMatrix[key][cls] || 0)
    }, 0) - tp

    // False Negatives: sum of row minus diagonal
    const fn = Object.keys(confusionMatrix[cls]).reduce((sum, key) => {
      return sum + (confusionMatrix[cls][key] || 0)
    }, 0) - tp

    // Precision: TP / (TP + FP)
    precision[cls] = tp + fp === 0 ? 0 : tp / (tp + fp)

    // Recall: TP / (TP + FN)
    recall[cls] = tp + fn === 0 ? 0 : tp / (tp + fn)

    // F1 Score: 2 * (Precision * Recall) / (Precision + Recall)
    const f1Denom = precision[cls] + recall[cls]
    f1Score[cls] = f1Denom === 0 ? 0 : (2 * precision[cls] * recall[cls]) / f1Denom
  })

  return {
    accuracy,
    precision,
    recall,
    f1Score,
    confusionMatrix,
    totalTestCases: expected.length,
    correctPredictions,
  }
}

/**
 * Format metrics result for console output
 */
function formatMetricsReport(metrics: MetricsResult): string {
  const classes: QueryClassification[] = [
    'SAFE_RAG',
    'ELIGIBILITY_QUERY',
    'LEGAL_ADVICE',
    'EMERGENCY',
    'OUT_OF_SCOPE',
  ]

  let report = '\n'
  report += '═'.repeat(80) + '\n'
  report += 'CLASSIFIER EVALUATION METRICS REPORT\n'
  report += '═'.repeat(80) + '\n\n'

  report += `Total Test Cases: ${metrics.totalTestCases}\n`
  report += `Correct Predictions: ${metrics.correctPredictions}\n`
  report += `Overall Accuracy: ${(metrics.accuracy * 100).toFixed(2)}%\n\n`

  report += '─'.repeat(80) + '\n'
  report += 'PER-CLASS METRICS\n'
  report += '─'.repeat(80) + '\n'
  report += 'Class'.padEnd(20) + 'Precision'.padEnd(15) + 'Recall'.padEnd(15) + 'F1 Score'.padEnd(15) + '\n'
  report += '─'.repeat(80) + '\n'

  classes.forEach(cls => {
    report += cls.padEnd(20) + 
      ((metrics.precision[cls] * 100).toFixed(2) + '%').padEnd(15) + 
      ((metrics.recall[cls] * 100).toFixed(2) + '%').padEnd(15) + 
      ((metrics.f1Score[cls] * 100).toFixed(2) + '%').padEnd(15) + '\n'
  })

  report += '\n' + '─'.repeat(80) + '\n'
  report += 'CONFUSION MATRIX\n'
  report += '─'.repeat(80) + '\n'

  report += 'Predicted →'.padEnd(20)
  classes.forEach(cls => {
    report += cls.substring(0, 8).padEnd(12)
  })
  report += '\n'
  report += '─'.repeat(80) + '\n'

  classes.forEach(actualClass => {
    report += actualClass.padEnd(20)
    classes.forEach(predictedClass => {
      const count = metrics.confusionMatrix[actualClass][predictedClass]
      report += count.toString().padEnd(12)
    })
    report += '\n'
  })

  report += '═'.repeat(80) + '\n'

  return report
}

describe('Classifier - Evaluation Metrics', () => {
  it('should evaluate classifier performance on test dataset', async () => {
    const predictions: QueryClassification[] = []
    const expected: QueryClassification[] = []

    // Run classifier on all test cases
    for (const testCase of testDataset) {
      const result = await classifyQuery(testCase.query)
      predictions.push(result.classification)
      expected.push(testCase.expected)
    }

    // Calculate metrics
    const metrics = calculateMetrics(predictions, expected)

    // Log detailed report
    const report = formatMetricsReport(metrics)
    console.log(report)

    // Assertions with reasonable thresholds
    expect(metrics.accuracy).toBeGreaterThanOrEqual(0.7) // At least 70% accuracy
    expect(metrics.totalTestCases).toBe(testDataset.length)

    // Log per-class performance
    Object.keys(metrics.f1Score).forEach(cls => {
      console.log(
        `${cls}: F1=${(metrics.f1Score[cls as QueryClassification] * 100).toFixed(2)}%, Precision=${(metrics.precision[cls as QueryClassification] * 100).toFixed(2)}%, Recall=${(metrics.recall[cls as QueryClassification] * 100).toFixed(2)}%`
      )
    })
  })

  it('should correctly classify SAFE_RAG queries', async () => {
    const safeQueries = testDataset.filter(t => t.expected === 'SAFE_RAG')
    let correctCount = 0

    for (const test of safeQueries) {
      const result = await classifyQuery(test.query)
      if (result.classification === 'SAFE_RAG') {
        correctCount++
      }
    }

    const accuracy = correctCount / safeQueries.length
    console.log(`SAFE_RAG Accuracy: ${(accuracy * 100).toFixed(2)}% (${correctCount}/${safeQueries.length})`)
    expect(accuracy).toBeGreaterThanOrEqual(0.8) // At least 80% for safe queries
  })

  it('should correctly classify EMERGENCY queries', async () => {
    const emergencyQueries = testDataset.filter(t => t.expected === 'EMERGENCY')
    let correctCount = 0

    for (const test of emergencyQueries) {
      const result = await classifyQuery(test.query)
      if (result.classification === 'EMERGENCY') {
        correctCount++
      }
    }

    const accuracy = correctCount / emergencyQueries.length
    console.log(`EMERGENCY Accuracy: ${(accuracy * 100).toFixed(2)}% (${correctCount}/${emergencyQueries.length})`)
    expect(accuracy).toBeGreaterThanOrEqual(0.9) // At least 90% for critical emergency queries
  })

  it('should correctly classify blocking categories', async () => {
    const blockingCategories = testDataset.filter(
      t => t.expected !== 'SAFE_RAG' && t.expected !== 'EMERGENCY'
    )
    let correctCount = 0

    for (const test of blockingCategories) {
      const result = await classifyQuery(test.query)
      if (result.classification === test.expected) {
        correctCount++
      }
    }

    const accuracy = correctCount / blockingCategories.length
    console.log(
      `Blocking Categories Accuracy: ${(accuracy * 100).toFixed(2)}% (${correctCount}/${blockingCategories.length})`
    )
    expect(accuracy).toBeGreaterThanOrEqual(0.7) // At least 70% for nuanced blocking categories
  })

  it('should have high recall for safety-critical categories', async () => {
    const predictions: QueryClassification[] = []
    const expected: QueryClassification[] = []

    for (const testCase of testDataset) {
      const result = await classifyQuery(testCase.query)
      predictions.push(result.classification)
      expected.push(testCase.expected)
    }

    const metrics = calculateMetrics(predictions, expected)

    // EMERGENCY should have high recall (catch all true emergencies)
    console.log(`EMERGENCY Recall: ${(metrics.recall['EMERGENCY'] * 100).toFixed(2)}%`)
    expect(metrics.recall['EMERGENCY']).toBeGreaterThanOrEqual(0.85)

    // OUT_OF_SCOPE should have high recall
    console.log(`OUT_OF_SCOPE Recall: ${(metrics.recall['OUT_OF_SCOPE'] * 100).toFixed(2)}%`)
    expect(metrics.recall['OUT_OF_SCOPE']).toBeGreaterThanOrEqual(0.75)
  })

  it('should produce detailed metrics summary', () => {
    const mockPredictions: QueryClassification[] = [
      'SAFE_RAG',
      'SAFE_RAG',
      'EMERGENCY',
      'OUT_OF_SCOPE',
      'ELIGIBILITY_QUERY',
    ]
    const mockExpected: QueryClassification[] = [
      'SAFE_RAG',
      'EMERGENCY',
      'EMERGENCY',
      'OUT_OF_SCOPE',
      'ELIGIBILITY_QUERY',
    ]

    const metrics = calculateMetrics(mockPredictions, mockExpected)

    expect(metrics.accuracy).toBe(0.8) // 4 out of 5 correct
    expect(metrics.totalTestCases).toBe(5)
    expect(metrics.correctPredictions).toBe(4)

    // Should have calculated precision, recall, f1 for all classes
    Object.keys(metrics.precision).forEach(cls => {
      expect(metrics.precision[cls as QueryClassification]).toBeDefined()
      expect(metrics.recall[cls as QueryClassification]).toBeDefined()
      expect(metrics.f1Score[cls as QueryClassification]).toBeDefined()
    })
  })
})
