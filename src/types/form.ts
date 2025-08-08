export interface Category {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  text: string;
  correctCategory?: string;
}

export interface Blank {
  id: string;
  correctAnswer: string;
  position: number;
}

export interface SubQuestion {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer?: string;
}

export interface Question {
  id: string;
  type: 'categorize' | 'cloze' | 'comprehension';
  title: string;
  description?: string;
  image?: string;
  required?: boolean;
  
  // Categorize-specific fields
  categories?: Category[];
  items?: Item[];
  
  // Cloze-specific fields
  text?: string;
  blanks?: Blank[];
  
  // Comprehension-specific fields
  passage?: string;
  subQuestions?: SubQuestion[];
}

export interface FormSettings {
  allowMultipleSubmissions: boolean;
  showProgressBar: boolean;
  collectEmail: boolean;
}

export interface Form {
  _id?: string;
  title: string;
  description?: string;
  headerImage?: string;
  questions: Question[];
  isPublished: boolean;
  createdBy?: string;
  settings: FormSettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface Answer {
  questionId: string;
  questionType: 'categorize' | 'cloze' | 'comprehension';
  
  // Categorize answers
  categorizations?: Array<{
    itemId: string;
    categoryId: string;
  }>;
  
  // Cloze answers
  blankAnswers?: Array<{
    blankId: string;
    answer: string;
  }>;
  
  // Comprehension answers
  subAnswers?: Array<{
    subQuestionId: string;
    answer: string;
  }>;
}

export interface Submission {
  _id?: string;
  formId: string;
  submitterEmail?: string;
  answers: Answer[];
  completedAt?: string;
  score?: number;
}