export interface Product {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  category: string;
  features?: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  documentType: string;
  documentNumber: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  documentType?: string;
  documentNumber?: string;
  subject?: string;
  message?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
