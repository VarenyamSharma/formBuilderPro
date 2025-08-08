import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Save, Eye, Settings, Upload, ArrowLeft, Plus, BarChart3 } from 'lucide-react';
import { Form, Question } from '../../types/form';
import { formApi, uploadApi } from '../../services/api';
import { generateId } from '../../utils/helpers';
import FormHeader from './FormHeader';
import QuestionEditor from './QuestionEditor';
import QuestionPalette from './QuestionPalette';
import FormSettings from './FormSettings';
import FormSubmissions from './FormSubmissions';
import SortableQuestion from './SortableQuestion';

const FormEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  const [form, setForm] = useState<Form>({
    title: 'Untitled Form',
    description: '',
    questions: [],
    isPublished: false,
    settings: {
      allowMultipleSubmissions: true,
      showProgressBar: true,
      collectEmail: false,
    },
  });
  
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadForm(id);
    }
  }, [id]);

  const loadForm = async (formId: string) => {
    setLoading(true);
    try {
      const response = await formApi.getForm(formId);
      setForm(response.data);
    } catch (error) {
      console.error('Error loading form:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveForm = async () => {
    setSaving(true);
    try {
      if (form._id) {
        await formApi.updateForm(form._id, form);
      } else {
        const response = await formApi.createForm(form);
        setForm(response.data);
        navigate(`/editor/${response.data._id}`, { replace: true });
      }
    } catch (error) {
      console.error('Error saving form:', error);
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: generateId(),
      type,
      title: `New ${type} question`,
      required: false,
      ...(type === 'categorize' && {
        categories: [{ id: generateId(), name: 'Category 1' }],
        items: [{ id: generateId(), text: 'Item 1' }],
      }),
      ...(type === 'cloze' && {
        text: 'This is a [blank] text with multiple [blanks] to fill.',
        blanks: [
          { id: generateId(), correctAnswer: 'sample', position: 0 },
          { id: generateId(), correctAnswer: 'blank', position: 1 },
        ],
      }),
      ...(type === 'comprehension' && {
        passage: 'Enter your reading passage here...',
        subQuestions: [{
          id: generateId(),
          type: 'multiple-choice',
          question: 'What is the main idea?',
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        }],
      }),
    };

    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    setSelectedQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId),
    }));
    
    if (selectedQuestion === questionId) {
      setSelectedQuestion(null);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setForm(prev => {
        const oldIndex = prev.questions.findIndex(q => q.id === active.id);
        const newIndex = prev.questions.findIndex(q => q.id === over.id);
        
        return {
          ...prev,
          questions: arrayMove(prev.questions, oldIndex, newIndex),
        };
      });
    }
  };

  const uploadHeaderImage = async (file: File) => {
    try {
      const response = await uploadApi.uploadImage(file);
      setForm(prev => ({
        ...prev,
        headerImage: response.data.imageUrl,
      }));
    } catch (error) {
      console.error('Error uploading header image:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Form Editor</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {form._id && (
                <>
                  <button
                    onClick={() => setShowSubmissions(true)}
                    className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Responses
                  </button>
                  <button
                    onClick={() => navigate(`/form/${form._id}`)}
                    className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </button>
                </>
              )}
              
              <button
                onClick={saveForm}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Palette */}
          <div className="lg:col-span-1">
            <QuestionPalette onAddQuestion={addQuestion} />
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Form Header */}
            <FormHeader
              form={form}
              onUpdate={setForm}
              onUploadImage={uploadHeaderImage}
            />

            {/* Questions */}
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={form.questions.map(q => q.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {form.questions.map((question) => (
                    <SortableQuestion
                      key={question.id}
                      question={question}
                      isSelected={selectedQuestion === question.id}
                      onSelect={() => setSelectedQuestion(question.id)}
                      onDelete={() => deleteQuestion(question.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {form.questions.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                <p className="text-gray-600">Add your first question from the palette on the left</p>
              </div>
            )}
          </div>

          {/* Question Editor */}
          <div className="lg:col-span-1">
            {selectedQuestion && (
              <QuestionEditor
                question={form.questions.find(q => q.id === selectedQuestion)!}
                onUpdate={(updates) => updateQuestion(selectedQuestion, updates)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <FormSettings
          form={form}
          onUpdate={setForm}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Submissions Modal */}
      {showSubmissions && (
        <FormSubmissions
          form={form}
          onClose={() => setShowSubmissions(false)}
        />
      )}
    </div>
  );
};

export default FormEditor;