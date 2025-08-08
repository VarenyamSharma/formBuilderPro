import React from 'react';
import { Plus, Trash2, Tag, Package } from 'lucide-react';

interface CategorizeData {
  categories: string[];
  items: { id: string; text: string; correctCategory: string }[];
}

interface CategorizeEditorProps {
  data: CategorizeData;
  onUpdate: (data: CategorizeData) => void;
}

const CategorizeEditor: React.FC<CategorizeEditorProps> = ({ data, onUpdate }) => {
  const addCategory = () => {
    const newCategory = `Category ${data.categories.length + 1}`;
    onUpdate({
      ...data,
      categories: [...data.categories, newCategory]
    });
  };

  const updateCategory = (index: number, value: string) => {
    const newCategories = [...data.categories];
    const oldCategory = newCategories[index];
    newCategories[index] = value;
    
    // Update items that reference the old category
    const newItems = data.items.map(item => 
      item.correctCategory === oldCategory 
        ? { ...item, correctCategory: value }
        : item
    );
    
    onUpdate({
      categories: newCategories,
      items: newItems
    });
  };

  const removeCategory = (index: number) => {
    const categoryToRemove = data.categories[index];
    const newCategories = data.categories.filter((_, i) => i !== index);
    const newItems = data.items.filter(item => item.correctCategory !== categoryToRemove);
    
    onUpdate({
      categories: newCategories,
      items: newItems
    });
  };

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      text: `Item ${data.items.length + 1}`,
      correctCategory: data.categories[0] || ''
    };
    
    onUpdate({
      ...data,
      items: [...data.items, newItem]
    });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    onUpdate({
      ...data,
      items: newItems
    });
  };

  const removeItem = (index: number) => {
    onUpdate({
      ...data,
      items: data.items.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
          <Tag className="h-5 w-5 mr-2" />
          Categories
        </h4>
        <div className="space-y-2">
          {data.categories.map((category, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={category}
                onChange={(e) => updateCategory(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Category name"
              />
              <button
                onClick={() => removeCategory(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addCategory}
            className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 border border-blue-300 border-dashed rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Items to Categorize
        </h4>
        <div className="space-y-3">
          {data.items.map((item, index) => (
            <div key={item.id} className="p-3 border border-gray-200 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateItem(index, 'text', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Item text"
                />
                <button
                  onClick={() => removeItem(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Correct Category
                </label>
                <select
                  value={item.correctCategory}
                  onChange={(e) => updateItem(index, 'correctCategory', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {data.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <button
            onClick={addItem}
            className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 border border-blue-300 border-dashed rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorizeEditor;