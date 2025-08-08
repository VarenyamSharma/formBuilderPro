import React from 'react';
import { Users, FileText, BookOpen } from 'lucide-react';
import { Question } from '../../types/form';

interface QuestionPaletteProps {
  onAddQuestion: (type: Question['type']) => void;
}

const QuestionPalette: React.FC<QuestionPaletteProps> = ({ onAddQuestion }) => {
  const questionTypes = [
    {
      type: 'categorize' as const,
      name: 'Categorize',
      description: 'Drag & drop items into categories',
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
    {
      type: 'cloze' as const,
      name: 'Fill in the Blanks',
      description: 'Complete sentences with missing words',
      icon: FileText,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      type: 'comprehension' as const,
      name: 'Reading Comprehension',
      description: 'Text passage with questions',
      icon: BookOpen,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Types</h3>
      <div className="space-y-3">
        {questionTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <button
              key={type.type}
              onClick={() => onAddQuestion(type.type)}
              className="w-full p-4 text-left bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-300 border border-transparent transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${type.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{type.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionPalette;