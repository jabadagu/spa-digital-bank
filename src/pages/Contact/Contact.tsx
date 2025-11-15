import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { apiService } from '@/services/api';
import { Modal } from '@/components/Modal';
import { useContactSchema, type ContactFormData } from '@/schemas/contactSchema';
import PageHeader from '@/components/PageHeader/PageHeader';
import styled from 'styled-components';

const Main = styled(motion.main)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.md};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.bg.secondary} 0%,
    ${({ theme }) => theme.colors.bg.primary} 100%
  );
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

/* Header/Title/Subtitle moved to reusable PageHeader component */

const Form = styled(motion.form)`
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: ${({ theme }) => theme.spacing['3xl']};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1.25rem; /* compact padding on mobile */
  }
  border: 2px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(10px);
`;

const FormGroup = styled(motion.div)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Label = styled.label`
  display: block;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  letter-spacing: 0.3px;
`;

const Required = styled.span`
  color: ${({ theme }) => theme.colors.error};
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid
    ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.transitions.fast};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.accent};
    box-shadow: 0 0 0 3px
      ${({ theme, $hasError }) =>
        $hasError
          ? 'rgba(220, 53, 69, 0.1)'
          : theme.colors.accentLight || 'rgba(74, 158, 255, 0.1)'};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const Select = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid
    ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.accent};
    box-shadow: 0 0 0 3px
      ${({ theme, $hasError }) =>
        $hasError
          ? 'rgba(220, 53, 69, 0.1)'
          : theme.colors.accentLight || 'rgba(74, 158, 255, 0.1)'};
  }
`;

const TextArea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid
    ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: inherit;
  resize: vertical;
  min-height: 140px;
  transition: all ${({ theme }) => theme.transitions.fast};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.accent};
    box-shadow: 0 0 0 3px
      ${({ theme, $hasError }) =>
        $hasError
          ? 'rgba(220, 53, 69, 0.1)'
          : theme.colors.accentLight || 'rgba(74, 158, 255, 0.1)'};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const ErrorMessage = styled(motion.span)`
  display: block;
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const TwoColumns = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.md};
    flex-direction: column;
  }
`;

const SubmitButton = styled(motion.button)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent},
    ${({ theme }) => theme.colors.accentHover}
  );
  color: ${({ theme }) => theme.colors.white} !important;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0.5rem 0.875rem;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const ResetButton = styled(motion.button)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.bg.tertiary};
    border-color: ${({ theme }) => theme.colors.text.tertiary};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0.5rem 0.875rem;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

export const Contact = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ isOpen: boolean; success: boolean; message: string }>({
    isOpen: false,
    success: false,
    message: '',
  });

  const schema = useContactSchema();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    mode: 'all',
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      const response = await apiService.submitContactForm(data);
      setModal({
        isOpen: true,
        success: response.success,
        message: response.message,
      });

      if (response.success) {
        reset();
      }
    } catch {
      setModal({
        isOpen: true,
        success: false,
        message: t('contact.modal.error'),
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05,
      },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <Main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Container>
        <PageHeader title={t('contact.title')} subtitle={t('contact.subtitle')} />
        <Form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <FormGroup variants={fieldVariants}>
            <Label htmlFor="name">
              {t('contact.form.name')} <Required>*</Required>
            </Label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              placeholder={t('contact.form.namePlaceholder')}
              $hasError={!!errors.name}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <ErrorMessage
                id="name-error"
                role="alert"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.name.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup variants={fieldVariants}>
            <Label htmlFor="email">
              {t('contact.form.email')} <Required>*</Required>
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder={t('contact.form.emailPlaceholder')}
              $hasError={!!errors.email}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <ErrorMessage
                id="email-error"
                role="alert"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.email.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <TwoColumns variants={fieldVariants}>
            <FormGroup>
              <Label htmlFor="documentType">
                {t('contact.form.documentType')} <Required>*</Required>
              </Label>
              <Select
                id="documentType"
                {...register('documentType')}
                $hasError={!!errors.documentType}
                aria-invalid={!!errors.documentType}
                aria-describedby={errors.documentType ? 'documentType-error' : undefined}
              >
                <option value="">{t('contact.form.selectType')}</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Cédula">Cédula</option>
                <option value="Otro">Otro</option>
              </Select>
              {errors.documentType && (
                <ErrorMessage
                  id="documentType-error"
                  role="alert"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.documentType.message}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="documentNumber">
                {t('contact.form.documentNumber')} <Required>*</Required>
              </Label>
              <Input
                id="documentNumber"
                type="text"
                {...register('documentNumber')}
                placeholder={t('contact.form.documentPlaceholder')}
                $hasError={!!errors.documentNumber}
                aria-invalid={!!errors.documentNumber}
                aria-describedby={errors.documentNumber ? 'documentNumber-error' : undefined}
              />
              {errors.documentNumber && (
                <ErrorMessage
                  id="documentNumber-error"
                  role="alert"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.documentNumber.message}
                </ErrorMessage>
              )}
            </FormGroup>
          </TwoColumns>

          <FormGroup variants={fieldVariants}>
            <Label htmlFor="subject">
              {t('contact.form.subject')} <Required>*</Required>
            </Label>
            <Input
              id="subject"
              type="text"
              {...register('subject')}
              placeholder={t('contact.form.subjectPlaceholder')}
              $hasError={!!errors.subject}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
            />
            {errors.subject && (
              <ErrorMessage
                id="subject-error"
                role="alert"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.subject.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup variants={fieldVariants}>
            <Label htmlFor="message">
              {t('contact.form.message')} <Required>*</Required>
            </Label>
            <TextArea
              id="message"
              {...register('message')}
              placeholder={t('contact.form.messagePlaceholder')}
              rows={6}
              $hasError={!!errors.message}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <ErrorMessage
                id="message-error"
                role="alert"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.message.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <ButtonContainer variants={fieldVariants} initial="hidden" animate="visible">
            <ResetButton
              type="button"
              onClick={() => reset()}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t('contact.form.clear')}
            </ResetButton>
            <SubmitButton
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? t('contact.form.submitting') : t('contact.form.submit')}
            </SubmitButton>
          </ButtonContainer>
        </Form>

        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          success={modal.success}
          message={modal.message}
        />
      </Container>
    </Main>
  );
};
