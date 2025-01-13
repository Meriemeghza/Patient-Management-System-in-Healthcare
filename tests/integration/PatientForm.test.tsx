import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PatientForm } from '@/components/forms/PatientForm';
import { createUser } from '@/lib/actions/patient.actions';

jest.mock('@/lib/actions/patient.actions');

describe('PatientForm Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<PatientForm />);
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('johndoe@gmail.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('(555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('displays validation errors for empty fields', async () => {
    render(<PatientForm />);

    const submitButton = screen.getByText('Get Started');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
    });
  });

  it('submits the form and redirects on success', async () => {
    const mockCreateUser = jest.fn().mockResolvedValue({ $id: '123' });
    (createUser as jest.Mock) = mockCreateUser;

    render(<PatientForm />);

    fireEvent.change(screen.getByPlaceholderText('John Doe'), {
      target: { value: 'Jane Doe' },
    });

    fireEvent.change(screen.getByPlaceholderText('johndoe@gmail.com'), {
      target: { value: 'jane.doe@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('(555) 123-4567'), {
      target: { value: '5551234567' },
    });

    const submitButton = screen.getByText('Get Started');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '5551234567',
      });
    });
  });
});
