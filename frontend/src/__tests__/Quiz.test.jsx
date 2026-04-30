/**
 * @file Integration and component tests for the Quiz page.
 * Tests rendering, answering, navigation, scoring, and accessibility.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Quiz from '../pages/Quiz';
import React from 'react';

describe('Quiz Component', () => {
  beforeEach(() => {
    render(<Quiz />);
  });

  it('renders the quiz header', () => {
    expect(screen.getByText(/Election Intelligence Quiz/i)).toBeInTheDocument();
  });

  it('renders the first question', () => {
    expect(screen.getByText(/What is the minimum age to register to vote/i)).toBeInTheDocument();
  });

  it('displays all 4 answer options', () => {
    expect(screen.getByText('16 years old')).toBeInTheDocument();
    expect(screen.getByText('18 years old')).toBeInTheDocument();
    expect(screen.getByText('21 years old')).toBeInTheDocument();
    expect(screen.getByText('25 years old')).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    expect(screen.getByText(/Metric 1 of 4/i)).toBeInTheDocument();
  });

  it('handles a correct answer and shows explanation', () => {
    fireEvent.click(screen.getByText('18 years old'));
    expect(screen.getByText(/Civic Insight/i)).toBeInTheDocument();
    expect(screen.getByText(/In most jurisdictions, you must be 18 years old/i)).toBeInTheDocument();
  });

  it('handles an incorrect answer and shows the next button', () => {
    fireEvent.click(screen.getByText('16 years old'));
    expect(screen.getByText(/Civic Insight/i)).toBeInTheDocument();
    expect(screen.getByText(/Next Challenge/i)).toBeInTheDocument();
  });

  it('navigates to the next question after answering', () => {
    fireEvent.click(screen.getByText('18 years old'));
    fireEvent.click(screen.getByText(/Next Challenge/i));
    expect(screen.getByText(/Which of these is typically required for voter registration/i)).toBeInTheDocument();
    expect(screen.getByText(/Metric 2 of 4/i)).toBeInTheDocument();
  });

  it('shows Finalize Score button on the last question', () => {
    // Q1
    fireEvent.click(screen.getByText('18 years old'));
    fireEvent.click(screen.getByText(/Next Challenge/i));
    // Q2
    fireEvent.click(screen.getByText('Proof of citizenship'));
    fireEvent.click(screen.getByText(/Next Challenge/i));
    // Q3
    fireEvent.click(screen.getByText('Stay in line to vote'));
    fireEvent.click(screen.getByText(/Next Challenge/i));
    // Q4 - last question
    fireEvent.click(screen.getByText('Yes, in some states'));
    expect(screen.getByText(/Finalize Score/i)).toBeInTheDocument();
  });

  it('prevents double-clicking on answered questions', () => {
    fireEvent.click(screen.getByText('18 years old'));
    fireEvent.click(screen.getByText('21 years old'));
    // Explanation should still be shown from first click
    expect(screen.getByText(/In most jurisdictions/i)).toBeInTheDocument();
  });

  it('has accessible progress bar with proper ARIA attributes', () => {
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '1');
    expect(progressBar).toHaveAttribute('aria-valuemax', '4');
  });

  it('has radiogroup with proper role for answer options', () => {
    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup).toBeInTheDocument();
  });

  it('marks correct answer option as aria-checked after selection', () => {
    const option = screen.getByRole('radio', { name: /Option B: 18 years old/i });
    fireEvent.click(option);
    expect(option).toHaveAttribute('aria-checked', 'true');
  });
});
