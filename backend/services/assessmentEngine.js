/**
 * Assessment Engine
 * Merges:
 * - HR Interview scores (communication, confidence, relevance, depth, interview_readiness)
 * - Technical / Domain question scores (q1_score, q2_score)
 * - Aptitude Quiz score (0-100)
 * 
 * Into 5 Core Profile Dimensions:
 * 1. Technical Skill (30%)
 * 2. Aptitude (20%)
 * 3. Communication (20%)
 * 4. Domain Knowledge (15%)
 * 5. Interview Readiness (15%)
 */

function mergeAssessmentScores({ hrScores, techScores, aptitudeScore, branch, targetRole }) {
  const hr = hrScores || {
    communication: 80,
    confidence: 80,
    relevance: 80,
    depth_of_answers: 75,
    overall_interview_readiness: 80
  };

  const q1 = (techScores && techScores.score_1) ? Number(techScores.score_1) : 75;
  const q2 = (techScores && techScores.score_2) ? Number(techScores.score_2) : 80;
  const avgTechQ = Math.round((q1 + q2) / 2);

  const apt = aptitudeScore !== undefined ? Number(aptitudeScore) : 80;

  // 1. Technical Skill Score
  const technical_score = Math.round((avgTechQ * 0.75) + (hr.depth_of_answers * 0.25));

  // 2. Aptitude Score
  const aptitude_score = Math.round((apt * 0.85) + (avgTechQ * 0.15));

  // 3. Communication Score
  const comm_score = Math.round((hr.communication * 0.6) + (hr.confidence * 0.4));

  // 4. Domain Knowledge Score (skills_score)
  const skills_score = Math.round((avgTechQ * 0.5) + (hr.relevance * 0.5));

  // 5. Interview Readiness Score
  const interview_score = Math.round((hr.overall_interview_readiness * 0.6) + (hr.confidence * 0.2) + (comm_score * 0.2));

  // Overall Placement Readiness Index (0-100)
  const overall_readiness = Math.round(
    (technical_score * 0.25) +
    (aptitude_score * 0.20) +
    (comm_score * 0.20) +
    (skills_score * 0.15) +
    (interview_score * 0.20)
  );

  // Benchmarks for target role comparison
  const target_benchmarks = {
    technical_score: 85,
    aptitude_score: 80,
    comm_score: 85,
    skills_score: 82,
    interview_score: 88
  };

  return {
    technical_score,
    aptitude_score,
    comm_score,
    skills_score,
    interview_score,
    overall_readiness,
    target_benchmarks,
    calculated_at: new Date().toISOString()
  };
}

module.exports = {
  mergeAssessmentScores
};
