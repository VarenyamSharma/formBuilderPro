import React, { useState, useEffect } from 'react';
import { Question, Answer } from '../../types/form';

interface ClozeQuestionProps {
  question: Question;
  answer?: Answer;
  onUpdate: (answerData: Partial<Answer>) => void;
}

const ClozeQuestion: React.FC<ClozeQuestionProps> = ({
  question,
  answer,
  onUpdate,
}) => {
  const [blankAnswers, setBlankAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Initialize blank answers from existing answer
    if (answer?.blankAnswers) {
      const answersMap: { [key: string]: string } = {};
      answer.blankAnswers.forEach(ba => {
        answersMap[ba.blankId] = ba.answer;
      });
      setBlankAnswers(answersMap);
    }
  }, [answer]);

  const updateBlankAnswer = (blankId: string, value: string) => {
    const newBlankAnswers = { ...blankAnswers, [blankId]: value };
    setBlankAnswers(newBlankAnswers);

    // Convert to array format for the answer
    const blankAnswersArray = Object.entries(newBlankAnswers).map(([blankId, answer]) => ({
      blankId,
      answer,
    }));

    onUpdate({ blankAnswers: blankAnswersArray });
  };

  const renderTextWithBlanks = () => {
    if (!question.text) return null;

    const parts = question.text.split(/\[blank\]/g);
    const elements: React.ReactNode[] = [];

    parts.forEach((part, index) => {
      // Add the text part
      if (part) {
        elements.push(
          <span key={`text-${index}`} className="text-gray-900">
            {part}
          </span>
        );
      }

      // Add blank input if not the last part
      if (index < parts.length - 1) {
        const blankIndex = index;
        const blank = question.blanks?.[blankIndex];
        
        if (blank) {
          elements.push(
            <input
              key={`blank-${blank.id}`}
              type="text"
              value={blankAnswers[blank.id] || ''}
              onChange={(e) => updateBlankAnswer(blank.id, e.target.value)}
              className="inline-block mx-1 px-2 py-1 border-b-2 border-blue-500 bg-transparent focus:outline-none focus:border-blue-700 min-w-[100px] text-center"
              placeholder="___"
            />
          );
        }
      }
    });

    return elements;
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          Fill in the blanks with the appropriate words or phrases.
        </p>
      </div>

      {/* Text with blanks */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="text-lg leading-relaxed">
          {renderTextWithBlanks()}
        </div>
      </div>

      {/* Answer summary */}
      {Object.keys(blankAnswers).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Your answers:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.blanks?.map((blank, index) => (
              <div key={blank.id} className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 w-16">
                  Blank {index + 1}:
                </span>
                <span className="font-medium text-gray-900">
                  {blankAnswers[blank.id] || '(empty)'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClozeQuestion;