import React from 'react';
import { Plus, Trash2, FileText, Target } from 'lucide-react';

interface ClozeData {
  text: string;
  blanks: { id: string; position: number; options?: string[]; correctAnswer: string }[];
}

interface ClozeEditorProps {
  data: ClozeData;
  onUpdate: (data: ClozeData) => void;
}

const ClozeEditor: React.FC<ClozeEditorProps> = ({ data, onUpdate }) => {
  const updateText = (text: string) => {
    // Count blanks (___) in the text
    const blankCount = (text.match(/___/g) || []).length;
    const currentBlanks = data.blanks.length;
    
    let newBlanks = [...data.blanks];
    
    if (blankCount > currentBlanks) {
      // Add new blanks
      for (let i = currentBlanks; i < blankCount; i++) {
        newBlanks.push({
          id: Date.now().toString() + i,
          position: i,
          correctAnswer: ''
        });
      }
    } else if (blankCount < currentBlanks) {
      // Remove excess blanks
      newBlanks = newBlanks.slice(0, blankCount);
    }
    
    onUpdate({
      text,
      blanks: newBlanks
    });
  };

  const updateBlank = (index: number, field: string, value: any) => {
    const newBlanks = [...data.blanks];
    newBlanks[index] = { ...newBlanks[index], [field]: value };
    
    onUpdate({
      ...data,
      blanks: newBlanks
    });
  };

  const updateBlankOptions = (index: number, options: string) => {
    const optionsArray = options.split(',').map(opt => opt.trim()).filter(opt => opt);
    updateBlank(index, 'options', optionsArray.length > 0 ? optionsArray : undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Text with Blanks
        </h4>
        <div className="space-y-2">
          <textarea
            value={data.text}
            onChange={(e) => updateText(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Write your text here and use ___ for blanks that need to be filled..."
          />
          <p className="text-xs text-gray-600">
            Use three underscores (___) to create blanks. Each ___ will become a fillable field.
          </p>
        </div>
      </div>

      {data.blanks.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Blank Answers ({data.blanks.length})
          </h4>
          <div className="space-y-4">
            {data.blanks.map((blank, index) => (
              <div key={blank.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-gray-900">Blank #{index + 1}</h5>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    value={blank.correctAnswer}
                    onChange={(e) => updateBlank(index, 'correctAnswer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter the correct answer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Multiple Choice Options (Optional)
                  </label>
                  <input
                    type="text"
                    value={blank.options ? blank.options.join(', ') : ''}
                    onChange={(e) => updateBlankOptions(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Option 1, Option 2, Option 3 (leave empty for text input)"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Separate options with commas. Leave empty to use text input instead of dropdown.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {data.blanks.length === 0 && (
        <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-600">Add blanks (___) to your text to configure answers</p>
        </div>
      )}
    </div>
  );
};

export default ClozeEditor;