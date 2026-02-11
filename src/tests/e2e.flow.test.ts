import { render, screen } from '@testing-library/react';
import App from '../App';

describe('critical flow: public viewer loads landing page', () => {
  it('renders the main profile discovery heading', () => {
    render(<App />);
    expect(screen.getByText(/Injective on-chain contribution profiles/i)).toBeInTheDocument();
  });
});
