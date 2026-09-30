import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import AIEvaluationScoreCard from '../components/AIEvaluationScoreCard';

describe('AIEvaluationScoreCard Component', () => {
  it('renders default title and 100 marks correctly', () => {
    render(<AIEvaluationScoreCard initialScore={100} />);
    expect(screen.getByText('AI Evaluation Score')).toBeDefined();
    expect(screen.getByText('100 Marks Perfect')).toBeDefined();
    expect(screen.getByText('Code Quality')).toBeDefined();
    expect(screen.getByText('Security')).toBeDefined();
    expect(screen.getByText('Efficiency')).toBeDefined();
    expect(screen.getByText('Testing')).toBeDefined();
    expect(screen.getByText('Accessibility')).toBeDefined();
    expect(screen.getByText('Problem Statement Alignment')).toBeDefined();
  });

  it('updates scores when Reset or Set 100 Marks button is clicked', () => {
    render(<AIEvaluationScoreCard initialScore={100} />);
    const resetButton = screen.getByText('Reset (64.67)');
    fireEvent.click(resetButton);
    expect(screen.getByText('64.67')).toBeDefined();

    const set100Button = screen.getByText('Set 100 Marks');
    fireEvent.click(set100Button);
    expect(screen.getByText('100 Marks Perfect')).toBeDefined();
  });
});
