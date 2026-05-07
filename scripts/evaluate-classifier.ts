import { classifyQuery } from '../src/lib/guardrails/classifier';
import { testDataset } from '../src/lib/guardrails/eval-dataset';

async function evaluate() {
  console.log('Evaluating Guardrail Classifier...\n');

  let truePositives = 0; // Expected Safe, Predicted Safe
  let falsePositives = 0; // Expected Blocked, Predicted Safe
  let trueNegatives = 0; // Expected Blocked, Predicted Blocked
  let falseNegatives = 0; // Expected Safe, Predicted Blocked

  let exactMatches = 0; // Predicted EXACT class correctly

  const mismatches: any[] = [];

  for (const testCase of testDataset) {
    const result = await classifyQuery(testCase.query);

    const expectedSafe = testCase.expected === 'SAFE_RAG';
    const predictedSafe = result.classification === 'SAFE_RAG';

    // Binary Classification Metrics
    if (expectedSafe && predictedSafe) {
      truePositives++;
    } else if (!expectedSafe && predictedSafe) {
      falsePositives++;
    } else if (!expectedSafe && !predictedSafe) {
      trueNegatives++;
    } else if (expectedSafe && !predictedSafe) {
      falseNegatives++;
    }

    // Exact Match Metrics
    if (result.classification === testCase.expected) {
      exactMatches++;
    } else {
      mismatches.push({
        query: testCase.query,
        expected: testCase.expected,
        predicted: result.classification,
      });
    }
  }

  const total = testDataset.length;
  const accuracy = (truePositives + trueNegatives) / total;
  const precision = truePositives / (truePositives + falsePositives) || 0;
  const recall = truePositives / (truePositives + falseNegatives) || 0;
  const f1Score = (2 * precision * recall) / (precision + recall) || 0;

  console.log('--- Binary Classification Metrics (Safe vs Blocked) ---');
  console.log(`Total Queries: ${total}`);
  console.log(`True Positives (Safe -> Safe): ${truePositives}`);
  console.log(`True Negatives (Block -> Block): ${trueNegatives}`);
  console.log(`False Positives (Block -> Safe): ${falsePositives}`);
  console.log(`False Negatives (Safe -> Block): ${falseNegatives}\n`);

  console.log('| Metric | Score |');
  console.log('|---|---|');
  console.log(`| Accuracy | ${(accuracy * 100).toFixed(2)}% |`);
  console.log(`| Precision | ${(precision * 100).toFixed(2)}% |`);
  console.log(`| Recall | ${(recall * 100).toFixed(2)}% |`);
  console.log(`| F1 Score | ${(f1Score * 100).toFixed(2)}% |`);
  console.log('\n');

  console.log('--- Multi-class Accuracy (Exact Reason Match) ---');
  console.log(`Exact Match Accuracy: ${((exactMatches / total) * 100).toFixed(2)}% (${exactMatches}/${total})\n`);

  if (mismatches.length > 0) {
    console.log('--- Mismatches ---');
    mismatches.forEach((m, i) => {
      console.log(`${i + 1}. Query: "${m.query}"`);
      console.log(`   Expected:  ${m.expected}`);
      console.log(`   Predicted: ${m.predicted}\n`);
    });
  } else {
    console.log('No mismatches! Perfect classification.');
  }
}

evaluate().catch(console.error);
