import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { createAppointment } from '@/lib/actions/appointment.actions';
import { Dispatch, SetStateAction } from 'react';

jest.mock('@/lib/actions/appointment.actions');

describe('AppointmentForm Component', () => {
  const mockProps = {
    userId: 'mockUserId',
    patientId: 'mockPatientId',
    type: 'create' as 'create',
    setOpen: jest.fn() as Dispatch<SetStateAction<boolean>>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the AppointmentForm', () => {
    render(<AppointmentForm {...mockProps} />);
    expect(screen.getByText('New Appointment')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select a doctor')).toBeInTheDocument();
  });

  it('displays validation errors for empty required fields', async () => {
    render(<AppointmentForm {...mockProps} />);

    const submitButton = screen.getByText('Submit Apppointment');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Primary Physician is required')
      ).toBeInTheDocument();
    });
  });

  it('submits the form with correct data', async () => {
    const mockCreateAppointment = jest.fn().mockResolvedValue({ $id: '789' });
    (createAppointment as jest.Mock) = mockCreateAppointment;

    render(<AppointmentForm {...mockProps} />);

    fireEvent.change(screen.getByPlaceholderText('Select a doctor'), {
      target: { value: 'Dr. Smith' },
    });

    fireEvent.change(screen.getByPlaceholderText('Expected appointment date'), {
      target: { value: new Date().toISOString() },
    });

    fireEvent.change(screen.getByPlaceholderText('Annual montly check-up'), {
      target: { value: 'Routine check-up' },
    });

    const submitButton = screen.getByText('Submit Apppointment');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateAppointment).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'mockUserId',
          patient: 'mockPatientId',
          primaryPhysician: 'Dr. Smith',
          reason: 'Routine check-up',
        })
      );
    });
  });
});