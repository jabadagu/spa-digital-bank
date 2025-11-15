// Using Jest globals
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { Contact } from './Contact';
import { apiService } from '@/services/api';

const renderContact = () => {
  return render(<Contact />);
};

describe('Contact Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar todos los campos del formulario', () => {
    renderContact();

    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de documento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/número de documento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/asunto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /limpiar/i })).toBeInTheDocument();
  });

  it('debe mostrar errores de validación cuando los campos están vacíos', async () => {
    const user = userEvent.setup();
    renderContact();

    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el tipo de documento es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el número de documento es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el asunto es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el mensaje es requerido/i)).toBeInTheDocument();
    });
  });

  it('debe validar el formato del email', async () => {
    const user = userEvent.setup();
    renderContact();

    const emailInput = screen.getByLabelText(/email/i);
    await user.click(emailInput);
    await user.type(emailInput, 'email-invalido');
    await user.tab(); // Trigger blur

    await waitFor(
      () => {
        expect(screen.getByText(/el email no es válido/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('debe validar la longitud mínima del mensaje', async () => {
    const user = userEvent.setup();
    renderContact();

    const messageInput = screen.getByLabelText(/mensaje/i);
    await user.click(messageInput);
    await user.type(messageInput, 'corto');
    await user.tab(); // Trigger blur

    await waitFor(
      () => {
        expect(
          screen.getByText(/el mensaje debe tener al menos 10 caracteres/i)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('debe enviar el formulario cuando todos los campos son válidos', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.spyOn(apiService, 'submitContactForm');
    mockSubmit.mockResolvedValue({
      success: true,
      message: 'Mensaje enviado correctamente',
    });

    renderContact();

    // Llenar el formulario
    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');
    await user.selectOptions(screen.getByLabelText(/tipo de documento/i), 'DNI');
    await user.type(screen.getByLabelText(/número de documento/i), '12345678');
    await user.type(screen.getByLabelText(/asunto/i), 'Consulta sobre productos');
    await user.type(
      screen.getByLabelText(/mensaje/i),
      'Este es un mensaje de prueba con más de 10 caracteres'
    );

    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'Juan Pérez',
        email: 'juan@example.com',
        documentType: 'DNI',
        documentNumber: '12345678',
        subject: 'Consulta sobre productos',
        message: 'Este es un mensaje de prueba con más de 10 caracteres',
      });
    });
  });

  it('debe mostrar un modal de éxito cuando el envío es exitoso', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.spyOn(apiService, 'submitContactForm');
    mockSubmit.mockResolvedValue({
      success: true,
      message: 'Tu mensaje ha sido enviado correctamente',
    });

    renderContact();

    // Llenar y enviar el formulario
    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');
    await user.selectOptions(screen.getByLabelText(/tipo de documento/i), 'DNI');
    await user.type(screen.getByLabelText(/número de documento/i), '12345678');
    await user.type(screen.getByLabelText(/asunto/i), 'Consulta');
    await user.type(
      screen.getByLabelText(/mensaje/i),
      'Este es un mensaje de prueba con más de 10 caracteres'
    );

    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/¡éxito!/i)).toBeInTheDocument();
      expect(screen.getByText(/tu mensaje ha sido enviado correctamente/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar un modal de error cuando el envío falla', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.spyOn(apiService, 'submitContactForm');
    mockSubmit.mockResolvedValue({
      success: false,
      message: 'Error al enviar el mensaje',
    });

    renderContact();

    // Llenar y enviar el formulario
    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');
    await user.selectOptions(screen.getByLabelText(/tipo de documento/i), 'DNI');
    await user.type(screen.getByLabelText(/número de documento/i), '12345678');
    await user.type(screen.getByLabelText(/asunto/i), 'Consulta');
    await user.type(
      screen.getByLabelText(/mensaje/i),
      'Este es un mensaje de prueba con más de 10 caracteres'
    );

    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /error/i })).toBeInTheDocument();
      expect(screen.getByText(/error al enviar el mensaje/i)).toBeInTheDocument();
    });
  });

  it('debe limpiar el formulario cuando se hace clic en el botón Limpiar', async () => {
    const user = userEvent.setup();
    renderContact();

    const nameInput = screen.getByLabelText(/nombre completo/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

    await user.type(nameInput, 'Juan Pérez');
    await user.type(emailInput, 'juan@example.com');

    expect(nameInput.value).toBe('Juan Pérez');
    expect(emailInput.value).toBe('juan@example.com');

    const resetButton = screen.getByRole('button', { name: /limpiar/i });
    await user.click(resetButton);

    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
  });

  it('debe deshabilitar el botón de envío mientras se está enviando', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.spyOn(apiService, 'submitContactForm');
    mockSubmit.mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              success: true,
              message: 'Mensaje enviado',
            });
          }, 100);
        })
    );

    renderContact();

    // Llenar el formulario
    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');
    await user.selectOptions(screen.getByLabelText(/tipo de documento/i), 'DNI');
    await user.type(screen.getByLabelText(/número de documento/i), '12345678');
    await user.type(screen.getByLabelText(/asunto/i), 'Consulta');
    await user.type(
      screen.getByLabelText(/mensaje/i),
      'Este es un mensaje de prueba con más de 10 caracteres'
    );

    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/enviando.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
