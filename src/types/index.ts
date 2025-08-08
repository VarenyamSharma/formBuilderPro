export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface Question {
  id: string;
  type: 'categorize' | 'cloze' | 'comprehension';
  title: string;
  image?: string;
  data: any;
}

export interface CategorizeQuestion extends Question {
  type: 'categorize';
  data: {
    categories: string[];
    items: { id: string; text: string; correctCategory: string }[];
  };
}

export interface ClozeQuestion extends Question {
  type: 'cloze';
  data: {
    text: string;
    blanks: { id: string; position: number; options?: string[]; correctAnswer: string }[];
  };
}

export interface ComprehensionQuestion extends Question {
  type: 'comprehension';
  data: {
    passage: string;
    questions: { id: string; question: string; type: 'text' | 'multiple' | 'boolean'; options?: string[]; correctAnswer?: string }[];
  };
}

export interface Form {
  id: string;
  title: string;
  description: string;
  headerImage?: string;
  questions: Question[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

export interface Response {
  id: string;
  formId: string;
  answers: Record<string, any>;
  submittedAt: string;
  submitterInfo?: {
    email?: string;
    name?: string;
  };
}

export interface FormContextType {
  forms: Form[];
  responses: Response[];
  currentForm: Form | null;
  createForm: (form: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateForm: (formId: string, updates: Partial<Form>) => void;
  deleteForm: (formId: string) => void;
  getForm: (formId: string) => Form | null;
  submitResponse: (formId: string, answers: Record<string, any>, submitterInfo?: any) => void;
  getFormResponses: (formId: string) => Response[];
  setCurrentForm: (form: Form | null) => void;
}