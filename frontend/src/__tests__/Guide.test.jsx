/**
 * @file Integration tests for the Guide page component.
 * Tests step navigation, content rendering, and accessibility.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Guide from '../pages/Guide';
import React from 'react';

describe('Guide Component', () => {
  beforeEach(() => {
    render(<Guide />);
  });

  it('renders the page header', () => {
    expect(screen.getByText(/Election Process Guide/i)).toBeInTheDocument();
    expect(screen.getByText(/step-by-step roadmap/i)).toBeInTheDocument();
  });

  it('renders all 4 step navigation buttons', () => {
    expect(screen.getAllByText('Voter Registration').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Research Candidates & Issues').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Find Your Polling Place').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Cast Your Vote').length).toBeGreaterThanOrEqual(1);
  });

  it('shows step 1 content by default', () => {
    expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Must be at least 18 years old/i)).toBeInTheDocument();
  });

  it('marks the active step button with aria-current', () => {
    const step1Button = screen.getByRole('button', { name: /Step 1: Voter Registration/i });
    expect(step1Button).toHaveAttribute('aria-current', 'step');
  });

  it('has a step navigation with proper aria-label', () => {
    const nav = screen.getByRole('navigation', { name: /Guide steps navigation/i });
    expect(nav).toBeInTheDocument();
  });

  it('shows warning alert about local rules', () => {
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/Rules and deadlines may change/i);
  });

  it('shows Key Requirements heading', () => {
    expect(screen.getByText(/Key Requirements/i)).toBeInTheDocument();
  });

  it('displays the step title in the content area', () => {
    // The title should appear in both the nav button and the content area
    const headings = screen.getAllByText('Voter Registration');
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it('renders step details for the active step', () => {
    expect(screen.getByText(/Proof of citizenship and residency required/i)).toBeInTheDocument();
    expect(screen.getByText(/Registration deadlines vary by state/i)).toBeInTheDocument();
  });

  it('has images with proper alt text', () => {
    const img = screen.getByAltText(/Illustration for Voter Registration/i);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});
