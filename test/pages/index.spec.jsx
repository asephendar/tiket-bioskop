import { render, screen } from '@testing-library/react';

import Index from '@pages/index.js';

describe('pages/index', () => {
  it('should renders learn nextweb link', () => {
    expect.hasAssertions();

    render(<Index />);

    const linkElement = screen.getByText(/learn nextweb/ui);

    expect(linkElement).toBeInTheDocument();
  });
});
