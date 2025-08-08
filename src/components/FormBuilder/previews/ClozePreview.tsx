import React from 'react';
import { Question } from '../../../types';

interface ClozePreviewProps {
  question: Question;
  answer?: Record<string, string>;
  onAnswerChange: (answer: Record<string, string>) => void;
}

const ClozePreview: React.FC<ClozePreviewProps> = ({
  question,
  answer = {},
  onAnswerChange
}) => {
  const { text, blanks } = question.data;

  const updateAnswer = (blankId: string, value: string) => {
    const newAnswer = { ...answer, [blankId]: value };
    onAnswerChange(newAnswer);
  };

  const renderTextWithBlanks = () => {
    const parts = text.split('___');
    const result = [];

    for (let i = 0; i < parts.length; i++) {
      result.push(<span key={`text-${i}`}>{parts[i]}</span>);
      
      if (i < parts.length - 1 && blanks[i]) {
        const blank = blanks[i];
        result.push(
          <span key={`blank-${i}`} className="inline-block mx-1">
            {blank.options && blank.options.length > 0 ? (
              <select
                value={answer[blank.id] || ''}
                onChange={(e) => updateAnswer(blank.id, e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]"
              >
                <option value="">Select...</option>
                {blank.options.map((option: string, optIndex: number) => (
                  <option key={optIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={answer[blank.id] || ''}
                onChange={(e) => updateAnswer(blank.id, e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px] text-center"
                placeholder="..."
              />
            )}
          </span>
        );
      }
    }

    return result;
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Fill in the blanks in the text below.
      </p>
      <div className="text-lg leading-relaxed p-4 bg-gray-50 rounded-lg border">
        {renderTextWithBlanks()}
      </div>
    </div>
  );
};

export default ClozePreview;