/**
 * @file Integration tests for the full App component.
 * Tests routing, navigation structure, accessibility landmarks, and page rendering.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';
import React from 'react';

describe('App Integration', () => {
  it('renders the landing page hero text', async () => {
    render(<App />);
    const heroText = await screen.findByText(/Democracy,/i);
    expect(heroText).toBeInTheDocument();
  });

  it('renders the Start Guide button', async () => {
    render(<App />);
    const startButton = await screen.findByText(/Start the Guide/i);
    expect(startButton).toBeInTheDocument();
  });

  it('renders the VoteWise brand name in the header', async () => {
    render(<App />);
    await screen.findByText(/Democracy,/i);
    expect(screen.getByText('VoteWise')).toBeInTheDocument();
  });

  it('has accessible skip-to-content link', async () => {
    render(<App />);
    await screen.findByText(/Democracy,/i);
    const skipLink = screen.getByText(/Skip to Main Content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('has main navigation with aria-label', async () => {
    render(<App />);
    await screen.findByText(/Democracy,/i);
    const mainNav = screen.getByRole('navigation', { name: /Main Navigation/i });
    expect(mainNav).toBeInTheDocument();
  });

  it('renders all navigation link labels', async () => {
    render(<App />);
    await screen.findByText(/Democracy,/i);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Election Guide')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
  });

  it('has interactive buttons with aria-labels', async () => {
    render(<App />);
    await screen.findByText(/Democracy,/i);
    expect(screen.getByLabelText('Sign In')).toBeInTheDocument();
    expect(screen.getByLabelText('User Profile')).toBeInTheDocument();
  });

  it('has a main content area element', async () => {
    render(<App />);
    await screen.findByText(/Democracy,/i);
    const mainContent = document.getElementById('main-content');
    expect(mainContent).not.toBeNull();
  });
});
