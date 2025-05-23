import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    expect(screen.getByText("This is Odan's boilerplate!")).toBeInTheDocument();
  });

  it('renders the Vite + React heading', () => {
    render(<App />);
    expect(screen.getByText('Vite + React')).toBeInTheDocument();
  });

  it('renders the HMR instruction text', () => {
    render(<App />);
    expect(screen.getByText(/Edit/)).toBeInTheDocument();
  });
});