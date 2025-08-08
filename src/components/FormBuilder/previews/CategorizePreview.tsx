import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Question } from '../../../types';
import { GripVertical } from 'lucide-react';

interface DraggableItemProps {
  id: string;
  text: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, text }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center p-3 bg-white border rounded-lg shadow-sm cursor-move ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
      <span className="text-gray-900">{text}</span>
    </div>
  );
};

interface CategorizePreviewProps {
  question: Question;
  answer?: Record<string, string[]>;
  onAnswerChange: (answer: Record<string, string[]>) => void;
}

const CategorizePreview: React.FC<CategorizePreviewProps> = ({
  question,
  answer,
  onAnswerChange
}) => {
  const { categories, items } = question.data;
  const [categorizedItems, setCategorizedItems] = useState<Record<string, string[]>>(() => {
    if (answer) return answer;
    
    // Initialize with uncategorized items
    const uncategorized = items.map((item: any) => item.id);
    const initial: Record<string, string[]> = {
      'uncategorized': uncategorized
    };
    
    categories.forEach((category: string) => {
      initial[category] = [];
    });
    
    return initial;
  });

  useEffect(() => {
    onAnswerChange(categorizedItems);
  }, [categorizedItems, onAnswerChange]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const itemId = active.id as string;
    const targetCategory = over.id as string;

    // Find current category of the item
    let currentCategory = '';
    Object.entries(categorizedItems).forEach(([category, items]) => {
      if (items.includes(itemId)) {
        currentCategory = category;
      }
    });

    if (currentCategory !== targetCategory) {
      setCategorizedItems(prev => ({
        ...prev,
        [currentCategory]: prev[currentCategory].filter(id => id !== itemId),
        [targetCategory]: [...prev[targetCategory], itemId]
      }));
    }
  };

  const getItemById = (id: string) => {
    return items.find((item: any) => item.id === id);
  };

  const allCategories = ['uncategorized', ...categories];

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <p className="text-gray-700">
          Drag and drop the items below into the correct categories.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCategories.map((category) => (
            <div key={category} className="space-y-3">
              <h4 className="font-semibold text-gray-900 text-center p-3 bg-gray-100 rounded-lg">
                {category === 'uncategorized' ? 'Items to Categorize' : category}
              </h4>
              <SortableContext
                items={categorizedItems[category] || []}
                strategy={verticalListSortingStrategy}
              >
                <div
                  className="min-h-[120px] p-3 border-2 border-dashed border-gray-200 rounded-lg space-y-2"
                  id={category}
                  style={{ minHeight: '120px' }}
                >
                  {(categorizedItems[category] || []).map((itemId) => {
                    const item = getItemById(itemId);
                    return item ? (
                      <DraggableItem
                        key={itemId}
                        id={itemId}
                        text={item.text}
                      />
                    ) : null;
                  })}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default CategorizePreview;