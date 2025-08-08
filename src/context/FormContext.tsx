import React, { createContext, useContext, useState, useEffect } from 'react';
import { FormContextType, Form, Response } from '../types';
import { apiDelete, apiGet, apiPost, apiPut } from './api';

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
    (async () => {
      try {
        const data = await apiGet('/api/forms');
        setForms(data);
      } catch (e) {
        setForms([]);
      }
    })();
  }, []);

  const saveToStorage = (_newForms: Form[], _newResponses?: Response[]) => {};

  const createForm = async (formData: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const created = await apiPost('/api/forms', formData);
    setForms((prev) => [created, ...prev]);
    return created.id;
  };

  const updateForm = (formId: string, updates: Partial<Form>) => {
    setForms((prev) => prev.map((f) => (f.id === formId ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f)));
    if (currentForm && currentForm.id === formId) {
      setCurrentForm({ ...currentForm, ...updates, updatedAt: new Date().toISOString() });
    }
    (async () => {
      try {
        const updated = await apiPut(`/api/forms/${formId}`, updates);
        setForms((prev) => prev.map((f) => (f.id === formId ? updated : f)));
      } catch {}
    })();
  };

  const deleteForm = (formId: string) => {
    setForms((prev) => prev.filter((f) => f.id !== formId));
    setResponses((prev) => prev.filter((r) => r.formId !== formId));
    if (currentForm && currentForm.id === formId) {
      setCurrentForm(null);
    }
    (async () => {
      try { await apiDelete(`/api/forms/${formId}`); } catch {}
    })();
  };

  const getForm = (formId: string): Form | null => {
    return forms.find(form => form.id === formId) || null;
  };

  const submitResponse = (formId: string, answers: Record<string, any>, submitterInfo?: any) => {
    const newResponse: Response = { id: `temp-${Date.now()}`, formId, answers, submittedAt: new Date().toISOString(), submitterInfo } as any;
    setResponses((prev) => [...prev, newResponse]);
  };

  const getFormResponses = (formId: string): Response[] => {
    (async () => {
      try {
        const list = await apiGet(`/api/responses/form/${formId}`);
        const normalized: Response[] = list.map((r: any) => ({ id: r.id, formId, answers: r.answers, submittedAt: r.submittedAt, submitterInfo: r.submitterInfo }));
        setResponses((prev) => {
          const others = prev.filter((p) => p.formId !== formId);
          return [...others, ...normalized];
        });
      } catch {}
    })();
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