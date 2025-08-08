import React, { createContext, useContext, useState, useEffect } from 'react';
import { FormContextType, Form, Response } from '../types';

const FormContext = createContext<FormContextType | null>(null);

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within FormProvider');
  }
  return context;
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [forms, setForms] = useState<Form[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [currentForm, setCurrentForm] = useState<Form | null>(null);

  useEffect(() => {
    const savedForms = localStorage.getItem('forms');
    const savedResponses = localStorage.getItem('responses');
    
    if (savedForms) {
      try {
        setForms(JSON.parse(savedForms));
      } catch (error) {
        console.error('Error loading forms:', error);
      }
    }
    
    if (savedResponses) {
      try {
        setResponses(JSON.parse(savedResponses));
      } catch (error) {
        console.error('Error loading responses:', error);
      }
    }
  }, []);

  const saveToStorage = (newForms: Form[], newResponses?: Response[]) => {
    localStorage.setItem('forms', JSON.stringify(newForms));
    if (newResponses) {
      localStorage.setItem('responses', JSON.stringify(newResponses));
    }
  };

  const createForm = (formData: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const newForm: Form = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const newForms = [...forms, newForm];
    setForms(newForms);
    saveToStorage(newForms);
    
    return newForm.id;
  };

  const updateForm = (formId: string, updates: Partial<Form>) => {
    const newForms = forms.map(form => 
      form.id === formId 
        ? { ...form, ...updates, updatedAt: new Date().toISOString() }
        : form
    );
    
    setForms(newForms);
    saveToStorage(newForms);
    
    if (currentForm && currentForm.id === formId) {
      setCurrentForm({ ...currentForm, ...updates, updatedAt: new Date().toISOString() });
    }
  };

  const deleteForm = (formId: string) => {
    const newForms = forms.filter(form => form.id !== formId);
    const newResponses = responses.filter(response => response.formId !== formId);
    
    setForms(newForms);
    setResponses(newResponses);
    saveToStorage(newForms, newResponses);
    
    if (currentForm && currentForm.id === formId) {
      setCurrentForm(null);
    }
  };

  const getForm = (formId: string): Form | null => {
    return forms.find(form => form.id === formId) || null;
  };

  const submitResponse = (formId: string, answers: Record<string, any>, submitterInfo?: any) => {
    const newResponse: Response = {
      id: Date.now().toString(),
      formId,
      answers,
      submittedAt: new Date().toISOString(),
      submitterInfo
    };
    
    const newResponses = [...responses, newResponse];
    setResponses(newResponses);
    localStorage.setItem('responses', JSON.stringify(newResponses));
  };

  const getFormResponses = (formId: string): Response[] => {
    return responses.filter(response => response.formId === formId);
  };

  return (
    <FormContext.Provider value={{
      forms,
      responses,
      currentForm,
      createForm,
      updateForm,
      deleteForm,
      getForm,
      submitResponse,
      getFormResponses,
      setCurrentForm
    }}>
      {children}
    </FormContext.Provider>
  );
};