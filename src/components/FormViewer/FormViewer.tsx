import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Form, Answer } from '../../types/form';
import { formApi } from '../../services/api';
import { validateEmail } from '../../utils/helpers';
import CategorizeQuestion from './CategorizeQuestion';
import ClozeQuestion from './ClozeQuestion';
import ComprehensionQuestion from './ComprehensionQuestion';

const FormViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (id) {
      loadForm(id);
    }
  }, [id]);

  const loadForm = async (formId: string) => {
    try {
      const response = await formApi.getForm(formId);
      setForm(response.data);
      
      // Initialize answers array
      const initialAnswers: Answer[] = response.data.questions.map(question => ({
        questionId: question.id,
        questionType: question.type,
        ...(question.type === 'categorize' && { categorizations: [] }),
        ...(question.type === 'cloze' && { blankAnswers: [] }),
        ...(question.type === 'comprehension' && { subAnswers: [] }),
      }));
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error loading form:', error);
      setError('Form not found or no longer available');
    } finally {
      setLoading(false);
    }
  };

  const updateAnswer = (questionId: string, answerData: Partial<Answer>) => {
    setAnswers(prev => prev.map(answer => 
      answer.questionId === questionId 
        ? { ...answer, ...answerData }
        : answer
    ));
  };

  const validateCurrentQuestion = (): boolean => {
    if (!form) return false;
    
    const question = form.questions[currentQuestion];
    const answer = answers.find(a => a.questionId === question.id);
    
    if (!question.required) return true;
    
    switch (question.type) {
      case 'categorize':
        return (answer?.categorizations?.length || 0) > 0;
      case 'cloze':
        return (answer?.blankAnswers?.length || 0) > 0 && 
               answer?.blankAnswers?.every(ba => ba.answer.trim() !== '');
      case 'comprehension':
        return (answer?.subAnswers?.length || 0) > 0 &&
               answer?.subAnswers?.every(sa => sa.answer.trim() !== '');
      default:
        return true;
    }
  };

  const nextQuestion = () => {
    if (form && currentQuestion < form.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitForm = async () => {
    if (!form || !id) return;

    // Validate email if required
    if (form.settings.collectEmail) {
      if (!email.trim()) {
        setEmailError('Email is required');
        return;
      }
      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email address');
        return;
      }
    }

    setSubmitting(true);
    try {
      await formApi.submitForm(id, {
        submitterEmail: form.settings.collectEmail ? email : undefined,
        answers,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">Your response has been submitted successfully.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!form) return null;

  const progress = ((currentQuestion + 1) / form.questions.length) * 100;
  const currentQ = form.questions[currentQuestion];
  const isLastQuestion = currentQuestion === form.questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            
            {form.settings.showProgressBar && (
              <div className="flex-1 max-w-md mx-8">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Question {currentQuestion + 1} of {form.questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Header */}
        <div className="text-center mb-8">
          {form.headerImage && (
            <div className="mb-6">
              <img
                src={`http://localhost:5000${form.headerImage}`}
                alt={form.title}
                className="w-full max-w-2xl mx-auto h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
          {form.description && (
            <p className="text-lg text-gray-600">{form.description}</p>
          )}
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {currentQ.image && (
            <div className="mb-6">
              <img
                src={`http://localhost:5000${currentQ.image}`}
                alt="Question"
                className="w-full max-w-lg mx-auto h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {currentQ.title}
              {currentQ.required && <span className="text-red-500 ml-1">*</span>}
            </h2>
            {currentQ.description && (
              <p className="text-gray-600">{currentQ.description}</p>
            )}
          </div>

          {/* Question Component */}
          {currentQ.type === 'categorize' && (
            <CategorizeQuestion
              question={currentQ}
              answer={answers.find(a => a.questionId === currentQ.id)}
              onUpdate={(answerData) => updateAnswer(currentQ.id, answerData)}
            />
          )}
          
          {currentQ.type === 'cloze' && (
            <ClozeQuestion
              question={currentQ}
              answer={answers.find(a => a.questionId === currentQ.id)}
              onUpdate={(answerData) => updateAnswer(currentQ.id, answerData)}
            />
          )}
          
          {currentQ.type === 'comprehension' && (
            <ComprehensionQuestion
              question={currentQ}
              answer={answers.find(a => a.questionId === currentQ.id)}
              onUpdate={(answerData) => updateAnswer(currentQ.id, answerData)}
            />
          )}
        </div>

        {/* Email Collection */}
        {isLastQuestion && form.settings.collectEmail && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={submitForm}
              disabled={submitting || (currentQ.required && !validateCurrentQuestion())}
              className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? 'Submitting...' : 'Submit Form'}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={currentQ.required && !validateCurrentQuestion()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default FormViewer;