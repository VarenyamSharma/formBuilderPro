import React from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Question, Answer } from '../../types/form';

interface CategorizeQuestionProps {
  question: Question;
  answer?: Answer;
  onUpdate: (answerData: Partial<Answer>) => void;
}

interface SortableItemProps {
  id: string;
  text: string;
  isPlaced: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, text, isPlaced }) => {
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
      {...attributes}
      {...listeners}
      className={`p-3 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? 'opacity-50 rotate-3' : ''
      } ${isPlaced ? 'opacity-50' : 'hover:border-blue-400 hover:bg-blue-50'}`}
    >
      <div className="flex items-center space-x-2">
        <GripVertical className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900">{text}</span>
      </div>
    </div>
  );
};

const CategorizeQuestion: React.FC<CategorizeQuestionProps> = ({
  question,
  answer,
  onUpdate,
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const itemId = active.id as string;
    const categoryId = over.id as string;

    // Check if dropping on a category
    const isCategory = question.categories?.some(cat => cat.id === categoryId);
    if (!isCategory) return;

    const currentCategorizations = answer?.categorizations || [];
    
    // Remove existing categorization for this item
    const filteredCategorizations = currentCategorizations.filter(
      cat => cat.itemId !== itemId
    );

    // Add new categorization
    const newCategorizations = [
      ...filteredCategorizations,
      { itemId, categoryId }
    ];

    onUpdate({ categorizations: newCategorizations });
  };

  const removeFromCategory = (itemId: string) => {
    const currentCategorizations = answer?.categorizations || [];
    const filteredCategorizations = currentCategorizations.filter(
      cat => cat.itemId !== itemId
    );
    onUpdate({ categorizations: filteredCategorizations });
  };

  const getItemsInCategory = (categoryId: string) => {
    const categorizations = answer?.categorizations || [];
    return categorizations
      .filter(cat => cat.categoryId === categoryId)
      .map(cat => question.items?.find(item => item.id === cat.itemId))
      .filter(Boolean);
  };

  const getUnplacedItems = () => {
    const categorizations = answer?.categorizations || [];
    const placedItemIds = categorizations.map(cat => cat.itemId);
    return question.items?.filter(item => !placedItemIds.includes(item.id)) || [];
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            Drag and drop the items below into the appropriate categories.
          </p>
        </div>

        {/* Items to categorize */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Items to categorize:</h4>
          <SortableContext
            items={getUnplacedItems().map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {getUnplacedItems().map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  isPlaced={false}
                />
              ))}
            </div>
          </SortableContext>
          
          {getUnplacedItems().length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              All items have been categorized!
            </div>
          )}
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Categories:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.categories?.map((category) => {
              const itemsInCategory = getItemsInCategory(category.id);
              
              return (
                <div
                  key={category.id}
                  className="border-2 border-gray-300 rounded-lg p-4 min-h-[120px] bg-gray-50"
                >
                  <h5 className="font-medium text-gray-900 mb-3 text-center">
                    {category.name}
                  </h5>
                  
                  {/* Drop zone */}
                  <div
                    className="min-h-[80px] border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white"
                    data-category-id={category.id}
                  >
                    <SortableContext
                      items={[category.id]}
                      strategy={verticalListSortingStrategy}
                    >
                      <div
                        className="min-h-[76px] rounded-lg transition-colors hover:bg-blue-50"
                        style={{ minHeight: '76px' }}
                        data-droppable-id={category.id}
                      >
                        {itemsInCategory.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            Drop items here
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {itemsInCategory.map((item) => (
                              <div
                                key={item?.id}
                                className="p-2 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-between"
                              >
                                <span className="text-blue-900 text-sm">{item?.text}</span>
                                <button
                                  onClick={() => removeFromCategory(item?.id || '')}
                                  className="text-blue-600 hover:text-blue-800 text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default CategorizeQuestion;