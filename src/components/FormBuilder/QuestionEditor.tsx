import React from 'react';
import { Question } from '../../types';
import CategorizeEditor from './editors/CategorizeEditor';
import ClozeEditor from './editors/ClozeEditor';
import ComprehensionEditor from './editors/ComprehensionEditor';
import { Type, ImageIcon } from 'lucide-react';

interface QuestionEditorProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onUpdate }) => {
  const renderEditor = () => {
    switch (question.type) {
      case 'categorize':
        return (
          <CategorizeEditor
            data={question.data}
            onUpdate={(data) => onUpdate({ data })}
          />
        );
      case 'cloze':
        return (
          <ClozeEditor
            data={question.data}
            onUpdate={(data) => onUpdate({ data })}
          />
        );
      case 'comprehension':
        return (
          <ComprehensionEditor
            data={question.data}
            onUpdate={(data) => onUpdate({ data })}
          />
        );
      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Edit Question
        </h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Type className="h-4 w-4 inline-block mr-1" />
          Question Title
        </label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter question title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <ImageIcon className="h-4 w-4 inline-block mr-1" />
          Question Image (Optional)
        </label>
        <input
          type="url"
          value={question.image || ''}
          onChange={(e) => onUpdate({ image: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://example.com/image.jpg"
        />
        {question.image && (
          <div className="mt-2">
            <img
              src={question.image}
              alt="Question preview"
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        {renderEditor()}
      </div>
    </div>
  );
};

export default QuestionEditor;