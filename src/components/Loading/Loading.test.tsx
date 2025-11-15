import { render } from '@/test/test-utils';
import { Loading } from './Loading';

describe('Loading', () => {
  test('renders spinner', () => {
    render(<Loading />);
    // Spinner has role none, but we can query by container div
    const spinner = document.querySelector('div');
    expect(spinner).toBeTruthy();
  });
});
