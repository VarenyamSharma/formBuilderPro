import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '../../context/FormContext';
import { Form } from '../../types';
import CategorizePreview from '../FormBuilder/previews/CategorizePreview';
import ClozePreview from '../FormBuilder/previews/ClozePreview';
import ComprehensionPreview from '../FormBuilder/previews/ComprehensionPreview';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { apiGet, apiPost } from '../../context/api';

const PublicForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { submitResponse } = useForm();
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitterInfo, setSubmitterInfo] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const data = await apiGet(`/api/forms/public/${id}`);
          setForm({
            id: data.id,
            title: data.title,
            description: data.description,
            headerImage: data.headerImage,
            questions: data.questions,
            createdBy: '',
            createdAt: '',
            updatedAt: '',
            isPublished: true,
            publicId: data.publicId,
          });
        } catch (e) {
          setError('Form not found or not available.');
        }
      })();
    }
  }, [id]);

  const updateAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form) return;
    
    // Validate required questions have answers
    const unansweredQuestions = form.questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      setError(`Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await apiPost(`/api/responses/public/${form.publicId}`, { answers, submitterInfo });
      submitResponse(form.id, answers, submitterInfo);
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to submit form. Please try again.');
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: any, index: number) => {
    switch (question.type) {
      case 'categorize':
        return (
          <CategorizePreview
            question={question}
            answer={answers[question.id]}
            onAnswerChange={(answer) => updateAnswer(question.id, answer)}
          />
        );
      case 'cloze':
        return (
          <ClozePreview
            question={question}
            answer={answers[question.id]}
            onAnswerChange={(answer) => updateAnswer(question.id, answer)}
          />
        );
      case 'comprehension':
        return (
          <ComprehensionPreview
            question={question}
            answer={answers[question.id]}
            onAnswerChange={(answer) => updateAnswer(question.id, answer)}
          />
        );
      default:
        return <div>Unknown question type</div>;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your response has been submitted successfully. We appreciate your participation.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Form Header */}
          <div className="relative">
            {form.headerImage && (
              <div className="h-64 bg-gray-200 overflow-hidden">
                <img
                  src={form.headerImage}
                  alt="Form header"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
              {form.description && (
                <p className="text-gray-600 text-lg">{form.description}</p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8">
            {/* Submitter Info */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={submitterInfo.name}
                    onChange={(e) => setSubmitterInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={submitterInfo.email}
                    onChange={(e) => setSubmitterInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-8">
              {form.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {index + 1}. {question.title}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        {question.type}
                      </span>
                    </div>
                    {question.image && (
                      <div className="mb-4">
                        <img
                          src={question.image}
                          alt="Question"
                          className="max-w-md h-48 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {renderQuestion(question, index)}
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end pt-8 border-t mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublicForm;