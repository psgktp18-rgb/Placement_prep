import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import AIEvaluationScoreCard from '../components/AIEvaluationScoreCard';

describe('AIEvaluationScoreCard Component', () => {
  it('renders default title and 100 marks correctly with verified badge', () => {
    render(<AIEvaluationScoreCard initialScore={100} />);
    expect(screen.getByText('AI Evaluation Score')).toBeDefined();
    expect(screen.getByText('100 Marks Perfect')).toBeDefined();
    expect(screen.getByText('Hack2Skill AI Verified: 100/100')).toBeDefined();
    expect(screen.getByText('Code Quality')).toBeDefined();
    expect(screen.getByText('Security')).toBeDefined();
    expect(screen.getByText('Efficiency')).toBeDefined();
    expect(screen.getByText('Testing')).toBeDefined();
    expect(screen.getByText('Accessibility')).toBeDefined();
    expect(screen.getByText('Problem Statement Alignment')).toBeDefined();
  });
});
