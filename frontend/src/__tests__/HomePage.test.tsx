import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../app/page';
import { useRouter } from 'next/navigation';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('HomePage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders the main heading', () => {
    render(<HomePage />);
    const heading = screen.getByText(/Go Beyond the Algorithm/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the input field and search button', () => {
    render(<HomePage />);
    const input = screen.getByPlaceholderText(/Paste a YouTube channel URL here/i);
    const button = screen.getByRole('button', { name: /Search/i });
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('the search button is disabled when the input is empty', () => {
    render(<HomePage />);
    const button = screen.getByRole('button', { name: /Search/i });
    expect(button).toBeDisabled();
  });

  it('the search button is enabled when the input has text', () => {
    render(<HomePage />);
    const input = screen.getByPlaceholderText(/Paste a YouTube channel URL here/i);
    fireEvent.change(input, { target: { value: 'test' } });
    const button = screen.getByRole('button', { name: /Search/i });
    expect(button).toBeEnabled();
  });

  it('when the form is submitted, the router is called with the correct URL', () => {
    render(<HomePage />);
    const input = screen.getByPlaceholderText(/Paste a YouTube channel URL here/i);
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'https://www.youtube.com/@test' } });
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockRouter.push).toHaveBeenCalledWith('/channel/https%3A%2F%2Fwww.youtube.com%2F%40test');
  });
});
