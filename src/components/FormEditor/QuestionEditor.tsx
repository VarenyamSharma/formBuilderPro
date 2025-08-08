import React, { useRef } from 'react';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { Question, Category, Item, Blank, SubQuestion } from '../../types/form';
import { generateId } from '../../utils/helpers';
import { uploadApi } from '../../services/api';

interface QuestionEditorProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      const response = await uploadApi.uploadImage(file);
      onUpdate({ image: response.data.imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const removeImage = () => {
    onUpdate({ image: undefined });
  };

  const renderCategorizeEditor = () => (
    <div className="space-y-4">
      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Categories</label>
          <button
            onClick={() => onUpdate({
              categories: [...(question.categories || []), { id: generateId(), name: 'New Category' }]
            })}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Add Category
          </button>
        </div>
        {question.categories?.map((category, index) => (
          <div key={category.id} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={category.name}
              onChange={(e) => {
                const updatedCategories = question.categories!.map(c =>
                  c.id === category.id ? { ...c, name: e.target.value } : c
                );
                onUpdate({ categories: updatedCategories });
              }}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              placeholder="Category name"
            />
            <button
              onClick={() => {
                const updatedCategories = question.categories!.filter(c => c.id !== category.id);
                onUpdate({ categories: updatedCategories });
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Items</label>
          <button
            onClick={() => onUpdate({
              items: [...(question.items || []), { id: generateId(), text: 'New Item' }]
            })}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Add Item
          </button>
        </div>
        {question.items?.map((item) => (
          <div key={item.id} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={item.text}
              onChange={(e) => {
                const updatedItems = question.items!.map(i =>
                  i.id === item.id ? { ...i, text: e.target.value } : i
                );
                onUpdate({ items: updatedItems });
              }}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              placeholder="Item text"
            />
            <select
              value={item.correctCategory || ''}
              onChange={(e) => {
                const updatedItems = question.items!.map(i =>
                  i.id === item.id ? { ...i, correctCategory: e.target.value } : i
                );
                onUpdate({ items: updatedItems });
              }}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="">Select category</option>
              {question.categories?.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <button
              onClick={() => {
                const updatedItems = question.items!.filter(i => i.id !== item.id);
                onUpdate({ items: updatedItems });
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClozeEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text with Blanks
        </label>
        <textarea
          value={question.text || ''}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          rows={4}
          placeholder="Use [blank] to create fillable spaces..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Use [blank] to create fillable spaces. Each [blank] will become an input field.
        </p>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Answer Key</label>
          <button
            onClick={() => onUpdate({
              blanks: [...(question.blanks || []), { 
                id: generateId(), 
                correctAnswer: '', 
                position: question.blanks?.length || 0 
              }]
            })}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Add Answer
          </button>
        </div>
        {question.blanks?.map((blank, index) => (
          <div key={blank.id} className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-600 w-16">Blank {index + 1}:</span>
            <input
              type="text"
              value={blank.correctAnswer}
              onChange={(e) => {
                const updatedBlanks = question.blanks!.map(b =>
                  b.id === blank.id ? { ...b, correctAnswer: e.target.value } : b
                );
                onUpdate({ blanks: updatedBlanks });
              }}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              placeholder="Correct answer"
            />
            <button
              onClick={() => {
                const updatedBlanks = question.blanks!.filter(b => b.id !== blank.id);
                onUpdate({ blanks: updatedBlanks });
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderComprehensionEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reading Passage
        </label>
        <textarea
          value={question.passage || ''}
          onChange={(e) => onUpdate({ passage: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          rows={6}
          placeholder="Enter the reading passage here..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Questions</label>
          <button
            onClick={() => onUpdate({
              subQuestions: [...(question.subQuestions || []), {
                id: generateId(),
                type: 'multiple-choice',
                question: 'New question',
                options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
              }]
            })}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Add Question
          </button>
        </div>
        
        {question.subQuestions?.map((subQ, index) => (
          <div key={subQ.id} className="border border-gray-200 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
              <button
                onClick={() => {
                  const updatedSubQuestions = question.subQuestions!.filter(sq => sq.id !== subQ.id);
                  onUpdate({ subQuestions: updatedSubQuestions });
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <input
              type="text"
              value={subQ.question}
              onChange={(e) => {
                const updatedSubQuestions = question.subQuestions!.map(sq =>
                  sq.id === subQ.id ? { ...sq, question: e.target.value } : sq
                );
                onUpdate({ subQuestions: updatedSubQuestions });
              }}
              className="w-full px-3 py-1 border border-gray-300 rounded text-sm mb-2"
              placeholder="Question text"
            />
            
            <select
              value={subQ.type}
              onChange={(e) => {
                const updatedSubQuestions = question.subQuestions!.map(sq =>
                  sq.id === subQ.id ? { ...sq, type: e.target.value as SubQuestion['type'] } : sq
                );
                onUpdate({ subQuestions: updatedSubQuestions });
              }}
              className="w-full px-3 py-1 border border-gray-300 rounded text-sm mb-2"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="short-answer">Short Answer</option>
              <option value="true-false">True/False</option>
            </select>

            {subQ.type === 'multiple-choice' && (
              <div>
                {subQ.options?.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center space-x-2 mb-1">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const updatedOptions = [...(subQ.options || [])];
                        updatedOptions[optIndex] = e.target.value;
                        const updatedSubQuestions = question.subQuestions!.map(sq =>
                          sq.id === subQ.id ? { ...sq, options: updatedOptions } : sq
                        );
                        onUpdate({ subQuestions: updatedSubQuestions });
                      }}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                      placeholder={`Option ${optIndex + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Question</h3>
      
      <div className="space-y-4">
        {/* Question Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Image (Optional)
          </label>
          {question.image ? (
            <div className="relative">
              <img
                src={`http://localhost:5000${question.image}`}
                alt="Question"
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Upload className="w-6 h-6 text-gray-400 mb-1" />
              <p className="text-sm text-gray-600">Upload image</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="hidden"
          />
        </div>

        {/* Question Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Title
          </label>
          <input
            type="text"
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter question title..."
          />
        </div>

        {/* Question Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={question.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="Add instructions or context..."
          />
        </div>

        {/* Required Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            checked={question.required || false}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
            Required question
          </label>
        </div>

        {/* Question Type Specific Editor */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Question Settings</h4>
          {question.type === 'categorize' && renderCategorizeEditor()}
          {question.type === 'cloze' && renderClozeEditor()}
          {question.type === 'comprehension' && renderComprehensionEditor()}
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;