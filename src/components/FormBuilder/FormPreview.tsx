import React, { useState } from 'react';
import { Question } from '../../types';
import CategorizePreview from './previews/CategorizePreview';
import ClozePreview from './previews/ClozePreview';
import ComprehensionPreview from './previews/ComprehensionPreview';
import { Eye } from 'lucide-react';

interface FormPreviewProps {
  title: string;
  description: string;
  headerImage?: string;
  questions: Question[];
}

const FormPreview: React.FC<FormPreviewProps> = ({
  title,
  description,
  headerImage,
  questions
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const updateAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const renderQuestion = (question: Question) => {
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

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Form Header */}
      <div className="relative">
        {headerImage && (
          <div className="h-64 bg-gray-200 overflow-hidden">
            <img
              src={headerImage}
              alt="Form header"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="px-8 py-6">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Preview Mode</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {title || 'Untitled Form'}
          </h1>
          {description && (
            <p className="text-gray-600 text-lg">{description}</p>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="px-8 pb-8">
        {questions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-600">No questions added yet. Add questions to see the preview.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {questions.map((question, index) => (
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
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                {renderQuestion(question)}
              </div>
            ))}
            
            <div className="flex justify-end pt-6 border-t">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => alert('This is just a preview. Responses are not saved.')}
              >
                Submit Form (Preview)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPreview;