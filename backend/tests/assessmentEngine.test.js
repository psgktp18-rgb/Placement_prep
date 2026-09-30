const { mergeAssessmentScores } = require('../services/assessmentEngine');

describe('Assessment Engine Unit Tests', () => {
  test('should merge default scores correctly into 5 profile dimensions', () => {
    const result = mergeAssessmentScores({
      hrScores: {
        communication: 100,
        confidence: 100,
        relevance: 100,
        depth_of_answers: 100,
        overall_interview_readiness: 100
      },
      techScores: { score_1: 100, score_2: 100 },
      aptitudeScore: 100,
      branch: 'Computer Science',
      targetRole: 'Software Engineer'
    });

    expect(result.technical_score).toBe(100);
    expect(result.aptitude_score).toBe(100);
    expect(result.comm_score).toBe(100);
    expect(result.skills_score).toBe(100);
    expect(result.interview_score).toBe(100);
    expect(result.overall_readiness).toBe(100);
  });

  test('should return valid benchmarks and calculated timestamp', () => {
    const result = mergeAssessmentScores({});
    expect(result.target_benchmarks).toBeDefined();
    expect(result.calculated_at).toBeDefined();
    expect(result.overall_readiness).toBeGreaterThanOrEqual(0);
    expect(result.overall_readiness).toBeLessThanOrEqual(100);
  });
});
