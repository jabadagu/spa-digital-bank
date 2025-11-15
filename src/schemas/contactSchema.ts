import { z } from 'zod';
import { useTranslation } from 'react-i18next';

// Base schema (used only for typing/static shape)
export const contactSchema = z.object({
  name: z.string().min(1, 'validation.nameRequired').min(2, 'validation.nameMin'),
  email: z.string().min(1, 'validation.emailRequired').email('validation.emailInvalid'),
  documentType: z.string().min(1, 'validation.documentTypeRequired'),
  documentNumber: z
    .string()
    .min(1, 'validation.documentNumberRequired')
    .min(5, 'validation.documentNumberMin'),
  subject: z.string().min(1, 'validation.subjectRequired').min(3, 'validation.subjectMin'),
  message: z.string().min(1, 'validation.messageRequired').min(10, 'validation.messageMin'),
});

// Hook that returns a schema with translated (human) messages.
// Use this in components so Zod validation errors contain localized strings.
export const useContactSchema = () => {
  const { t } = useTranslation();

  return z.object({
    name: z
      .string()
      .min(1, t('contact.validation.nameRequired'))
      .min(2, t('contact.validation.nameMin')),
    email: z
      .string()
      .min(1, t('contact.validation.emailRequired'))
      .email(t('contact.validation.emailInvalid')),
    documentType: z.string().min(1, t('contact.validation.documentTypeRequired')),
    documentNumber: z
      .string()
      .min(1, t('contact.validation.documentNumberRequired'))
      .min(5, t('contact.validation.documentNumberMin')),
    subject: z
      .string()
      .min(1, t('contact.validation.subjectRequired'))
      .min(3, t('contact.validation.subjectMin')),
    message: z
      .string()
      .min(1, t('contact.validation.messageRequired'))
      .min(10, t('contact.validation.messageMin')),
  });
};

export type ContactFormData = z.infer<typeof contactSchema>;
