import React from 'react';
import { Question } from '../../../types';

interface ComprehensionPreviewProps {
  question: Question;
  answer?: Record<string, string>;
  onAnswerChange: (answer: Record<string, string>) => void;
}

const ComprehensionPreview: React.FC<ComprehensionPreviewProps> = ({
  question,
  answer = {},
  onAnswerChange
}) => {
  const { passage, questions } = question.data;

  const updateAnswer = (questionId: string, value: string) => {
    const newAnswer = { ...answer, [questionId]: value };
    onAnswerChange(newAnswer);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">Reading Passage</h4>
        <div className="p-4 bg-gray-50 rounded-lg border text-gray-800 leading-relaxed">
          {passage.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-semibold text-gray-900">Questions</h4>
        {questions.map((q: any, index: number) => (
          <div key={q.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <h5 className="font-medium text-gray-900">
              {index + 1}. {q.question}
            </h5>
            
            {q.type === 'text' && (
              <textarea
                value={answer[q.id] || ''}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Enter your answer..."
              />
            )}
            
            {q.type === 'multiple' && q.options && (
              <div className="space-y-2">
                {q.options.map((option: string, optIndex: number) => (
                  <label key={optIndex} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option}
                      checked={answer[q.id] === option}
                      onChange={(e) => updateAnswer(q.id, e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            )}
            
            {q.type === 'boolean' && (
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value="yes"
                    checked={answer[q.id] === 'yes'}
                    onChange={(e) => updateAnswer(q.id, e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-900">Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value="no"
                    checked={answer[q.id] === 'no'}
                    onChange={(e) => updateAnswer(q.id, e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-900">No</span>
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComprehensionPreview;