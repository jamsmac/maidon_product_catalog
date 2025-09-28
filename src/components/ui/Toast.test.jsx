import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { act } from '@testing-library/react';

import { useToast, TOAST_TYPES, ToastContext } from '../../hooks/useToast';
import { useToastLogic } from '../../hooks/useToast';
import ToastProviderWrapper from '../../hooks/ToastProvider';
import Toast, { ToastContainer } from './Toast';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock react-dom createPortal
vi.mock('react-dom', () => ({
  createPortal: (children) => <div data-testid="portal">{children}</div>,
}));

// Test provider component
const TestToastProvider = ({ children }) => {
  const toastValue = useToastLogic();

  return (
    <ToastContext.Provider value={toastValue}>
      {children}
    </ToastContext.Provider>
  );
};

// Test component that uses toast
const TestComponent = () => {
  const { success, error, warning, info } = useToast();

  return (
    <div>
      <button onClick={() => success('Success message!')}>Success</button>
      <button onClick={() => error('Error message!')}>Error</button>
      <button onClick={() => warning('Warning message!')}>Warning</button>
      <button onClick={() => info('Info message!')}>Info</button>
    </div>
  );
};

describe('Toast System', () => {
  it('renders ToastContainer when toasts exist', async () => {
    const user = userEvent.setup();

    render(
      <ToastProviderWrapper>
        <TestComponent />
        <ToastContainer />
      </ToastProviderWrapper>
    );

    // Initially no toasts
    expect(screen.queryByTestId('portal')).not.toBeInTheDocument();

    // Add success toast
    await user.click(screen.getByRole('button', { name: /success/i }));

    expect(screen.getByTestId('portal')).toBeInTheDocument();
    expect(screen.getByText('Success message!')).toBeInTheDocument();
  });

  it('shows different toast types with correct styling', async () => {
    const user = userEvent.setup();

    render(
      <ToastProviderWrapper>
        <TestComponent />
        <ToastContainer />
      </ToastProviderWrapper>
    );

    // Success toast
    await user.click(screen.getByRole('button', { name: /success/i }));
    expect(screen.getByText('Success message!')).toBeInTheDocument();
    
    // Check for success styling class on the toast element
    const toastElement = screen.getByText('Success message!').closest('.bg-green-50');
    expect(toastElement).toBeInTheDocument();

    // Clear toasts for next test
    await act(async () => {
      // Wait for auto-hide (5000ms timeout simulation)
      await new Promise(resolve => setTimeout(resolve, 100));
    });
  });

  it('shows multiple toasts stacked', async () => {
    const user = userEvent.setup();

    render(
      <ToastProviderWrapper>
        <TestComponent />
        <ToastContainer />
      </ToastProviderWrapper>
    );

    // Add multiple toasts with small delay
    await user.click(screen.getByRole('button', { name: /success/i }));
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    await user.click(screen.getByRole('button', { name: /error/i }));

    expect(screen.getByText('Success message!')).toBeInTheDocument();
    expect(screen.getByText('Error message!')).toBeInTheDocument();
    
    // Check that both toasts are rendered
    const successToast = screen.getByText('Success message!');
    const errorToast = screen.getByText('Error message!');
    expect(successToast).toBeInTheDocument();
    expect(errorToast).toBeInTheDocument();
  });

  it('handles manual toast removal', async () => {
    const user = userEvent.setup();

    render(
      <ToastProviderWrapper>
        <TestComponent />
        <ToastContainer />
      </ToastProviderWrapper>
    );

    // Add toast
    await user.click(screen.getByRole('button', { name: /success/i }));
    expect(screen.getByText('Success message!')).toBeInTheDocument();

    // Find and click close button
    const closeButton = screen.getByRole('button', { name: '' }); // X button
    await user.click(closeButton);

    // Toast should be removed
    expect(screen.queryByText('Success message!')).not.toBeInTheDocument();
  });

  it('auto-removes toast after duration', async () => {
    vi.useFakeTimers();
    
    const TestComponentWithTimer = () => {
      const { success } = useToast();
      
      return (
        <button onClick={() => success('Test message', 1000)}>Add Toast</button>
      );
    };

    render(
      <ToastProviderWrapper>
        <TestComponentWithTimer />
        <ToastContainer />
      </ToastProviderWrapper>
    );

    // Add toast with 1 second duration
    const addButton = screen.getByRole('button', { name: /add toast/i });
    
    await act(async () => {
      addButton.click();
    });
    
    expect(screen.getByText('Test message')).toBeInTheDocument();

    // Fast-forward time beyond duration + animation
    await act(async () => {
      vi.advanceTimersByTime(1400); // Duration + animation time
    });

    // Toast should be gone
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();

    vi.useRealTimers();
  }, 10000); // Increase timeout

  it('throws error when useToast used outside provider', () => {
    expect(() => render(<TestComponent />)).toThrow(
      'useToast must be used within a ToastProvider'
    );
  });
});

describe('Toast Component (Standalone)', () => {
  it('renders standalone toast with message', () => {
    render(
      <Toast message="Test message" type={TOAST_TYPES.SUCCESS} />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
    
    // Check for success styling
    const toastElement = screen.getByText('Test message').closest('.bg-green-50');
    expect(toastElement).toBeInTheDocument();
  });

  it('applies correct styles for different types', () => {
    const { rerender } = render(
      <Toast message="Success" type={TOAST_TYPES.SUCCESS} />
    );

    // Check success styling
    const successElement = screen.getByText('Success').closest('.bg-green-50');
    expect(successElement).toBeInTheDocument();

    rerender(
      <Toast message="Error" type={TOAST_TYPES.ERROR} />
    );

    // Check error styling
    const errorElement = screen.getByText('Error').closest('.bg-red-50');
    expect(errorElement).toBeInTheDocument();
  });

  it('shows close button when onRemove provided', () => {
    const onRemove = vi.fn();

    render(
      <Toast message="Test" type={TOAST_TYPES.INFO} onRemove={onRemove} />
    );

    // Look for close button (X icon)
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(button => 
      button.querySelector('svg') // Contains the X icon
    );
    expect(closeButton).toBeInTheDocument();
  });
});
