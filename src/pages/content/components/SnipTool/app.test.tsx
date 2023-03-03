import { render, screen } from '@testing-library/react';
import App from '@src/pages/content/components/SnipTool/app';

describe('appTest', () => {
  test('render text', () => {
    // given
    const text = 'content view2';

    // when
    render(<App />);

    // then
    //screen.getByText(text);
  });
});
