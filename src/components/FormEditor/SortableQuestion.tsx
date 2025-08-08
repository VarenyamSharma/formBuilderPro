import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Users, FileText, BookOpen } from 'lucide-react';
import { Question } from '../../types/form';

interface SortableQuestionProps {
  question: Question;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const SortableQuestion: React.FC<SortableQuestionProps> = ({
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

  const getQuestionIcon = () => {
    switch (question.type) {
      case 'categorize':
        return <Users className="w-5 h-5 text-green-600" />;
      case 'cloze':
        return <FileText className="w-5 h-5 text-amber-600" />;
      case 'comprehension':
        return <BookOpen className="w-5 h-5 text-purple-600" />;
    }
  };

  const getQuestionTypeLabel = () => {
    switch (question.type) {
      case 'categorize':
        return 'Categorize';
      case 'cloze':
        return 'Fill in the Blanks';
      case 'comprehension':
        return 'Reading Comprehension';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border-2 transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-gray-300'
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <button
            {...attributes}
            {...listeners}
            className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          
          <div className="flex-1" onClick={onSelect}>
            <div className="flex items-center space-x-3 cursor-pointer">
              {getQuestionIcon()}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">
                    {question.title}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {getQuestionTypeLabel()}
                  </span>
                </div>
                {question.description && (
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {question.description}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {question.image && (
          <div className="mt-3 ml-8">
            <img
              src={`http://localhost:5000${question.image}`}
              alt="Question"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SortableQuestion;