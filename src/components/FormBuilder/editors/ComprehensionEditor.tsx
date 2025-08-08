import React from 'react';
import { Plus, Trash2, BookOpen, HelpCircle } from 'lucide-react';

interface ComprehensionData {
  passage: string;
  questions: { 
    id: string; 
    question: string; 
    type: 'text' | 'multiple' | 'boolean'; 
    options?: string[]; 
    correctAnswer?: string; 
  }[];
}

interface ComprehensionEditorProps {
  data: ComprehensionData;
  onUpdate: (data: ComprehensionData) => void;
}

const ComprehensionEditor: React.FC<ComprehensionEditorProps> = ({ data, onUpdate }) => {
  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      question: 'New question?',
      type: 'text' as const,
      correctAnswer: ''
    };
    
    onUpdate({
      ...data,
      questions: [...data.questions, newQuestion]
    });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...data.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    
    // Clear options and correct answer when changing question type
    if (field === 'type') {
      delete newQuestions[index].options;
      newQuestions[index].correctAnswer = '';
    }
    
    onUpdate({
      ...data,
      questions: newQuestions
    });
  };

  const updateQuestionOptions = (index: number, options: string) => {
    const optionsArray = options.split(',').map(opt => opt.trim()).filter(opt => opt);
    updateQuestion(index, 'options', optionsArray.length > 0 ? optionsArray : undefined);
  };

  const removeQuestion = (index: number) => {
    onUpdate({
      ...data,
      questions: data.questions.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Reading Passage
        </h4>
        <textarea
          value={data.passage}
          onChange={(e) => onUpdate({ ...data, passage: e.target.value })}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Enter the reading passage here..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-md font-semibold text-gray-900 flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            Comprehension Questions ({data.questions.length})
          </h4>
          <button
            onClick={addQuestion}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Question
          </button>
        </div>

        <div className="space-y-4">
          {data.questions.map((question, index) => (
            <div key={question.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <h5 className="font-medium text-gray-900">Question #{index + 1}</h5>
                <button
                  onClick={() => removeQuestion(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text
                </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter question"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type
                </label>
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="text">Text Answer</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="boolean">Yes/No</option>
                </select>
              </div>

              {question.type === 'multiple' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Multiple Choice Options
                  </label>
                  <input
                    type="text"
                    value={question.options ? question.options.join(', ') : ''}
                    onChange={(e) => updateQuestionOptions(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Option A, Option B, Option C"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Separate options with commas
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer (Optional)
                </label>
                {question.type === 'boolean' ? (
                  <select
                    value={question.correctAnswer || ''}
                    onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select answer</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : question.type === 'multiple' && question.options ? (
                  <select
                    value={question.correctAnswer || ''}
                    onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select correct option</option>
                    {question.options.map((option, optIndex) => (
                      <option key={optIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={question.correctAnswer || ''}
                    onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter the correct answer"
                  />
                )}
              </div>
            </div>
          ))}
          
          {data.questions.length === 0 && (
            <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-gray-600">No questions added yet</p>
              <button
                onClick={addQuestion}
                className="mt-2 flex items-center justify-center mx-auto px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add First Question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComprehensionEditor;