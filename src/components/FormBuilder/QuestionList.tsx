import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Question } from '../../types';
import { GripVertical, Trash2, Edit, Eye } from 'lucide-react';

interface QuestionItemProps {
  question: Question;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'categorize': return 'bg-blue-100 text-blue-800';
      case 'cloze': return 'bg-green-100 text-green-800';
      case 'comprehension': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'categorize': return '🗂️';
      case 'cloze': return '📝';
      case 'comprehension': return '📖';
      default: return '❓';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border-2 rounded-lg p-4 transition-all ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      } ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start space-x-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0" onClick={onSelect}>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getQuestionTypeColor(question.type)}`}>
              {question.type}
            </span>
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors">
            {question.title}
          </h4>
          <p className="text-xs text-gray-500">
            Click to edit question details
          </p>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onSelect}
            className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
            title="Edit question"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
            title="Delete question"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface QuestionListProps {
  questions: Question[];
  onQuestionSelect: (question: Question) => void;
  onQuestionDelete: (questionId: string) => void;
  selectedQuestionId?: string;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onQuestionSelect,
  onQuestionDelete,
  selectedQuestionId,
}) => {
  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
        <p className="text-gray-600">Add questions from the sidebar to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Questions ({questions.length})
      </h2>
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          isSelected={selectedQuestionId === question.id}
          onSelect={() => onQuestionSelect(question)}
          onDelete={() => onQuestionDelete(question.id)}
        />
      ))}
    </div>
  );
};

export default QuestionList;