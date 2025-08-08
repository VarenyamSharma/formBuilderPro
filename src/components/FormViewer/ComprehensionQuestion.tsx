import React, { useState, useEffect } from 'react';
import { Question, Answer } from '../../types/form';

interface ComprehensionQuestionProps {
  question: Question;
  answer?: Answer;
  onUpdate: (answerData: Partial<Answer>) => void;
}

const ComprehensionQuestion: React.FC<ComprehensionQuestionProps> = ({
  question,
  answer,
  onUpdate,
}) => {
  const [subAnswers, setSubAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Initialize sub answers from existing answer
    if (answer?.subAnswers) {
      const answersMap: { [key: string]: string } = {};
      answer.subAnswers.forEach(sa => {
        answersMap[sa.subQuestionId] = sa.answer;
      });
      setSubAnswers(answersMap);
    }
  }, [answer]);

  const updateSubAnswer = (subQuestionId: string, value: string) => {
    const newSubAnswers = { ...subAnswers, [subQuestionId]: value };
    setSubAnswers(newSubAnswers);

    // Convert to array format for the answer
    const subAnswersArray = Object.entries(newSubAnswers).map(([subQuestionId, answer]) => ({
      subQuestionId,
      answer,
    }));

    onUpdate({ subAnswers: subAnswersArray });
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          Read the passage below carefully and answer the questions that follow.
        </p>
      </div>

      {/* Reading passage */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Reading Passage:</h4>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {question.passage}
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <h4 className="font-medium text-gray-900">Questions:</h4>
        
        {question.subQuestions?.map((subQuestion, index) => (
          <div key={subQuestion.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="mb-3">
              <h5 className="font-medium text-gray-900 mb-2">
                {index + 1}. {subQuestion.question}
              </h5>
            </div>

            {subQuestion.type === 'multiple-choice' && (
              <div className="space-y-2">
                {subQuestion.options?.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${subQuestion.id}`}
                      value={option}
                      checked={subAnswers[subQuestion.id] === option}
                      onChange={(e) => updateSubAnswer(subQuestion.id, e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {subQuestion.type === 'short-answer' && (
              <textarea
                value={subAnswers[subQuestion.id] || ''}
                onChange={(e) => updateSubAnswer(subQuestion.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Enter your answer here..."
              />
            )}

            {subQuestion.type === 'true-false' && (
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${subQuestion.id}`}
                    value="true"
                    checked={subAnswers[subQuestion.id] === 'true'}
                    onChange={(e) => updateSubAnswer(subQuestion.id, e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-900">True</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${subQuestion.id}`}
                    value="false"
                    checked={subAnswers[subQuestion.id] === 'false'}
                    onChange={(e) => updateSubAnswer(subQuestion.id, e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-900">False</span>
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComprehensionQuestion;