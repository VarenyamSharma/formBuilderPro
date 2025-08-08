import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '../../context/FormContext';
import { useAuth } from '../../context/AuthContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Question } from '../../types';
import FormBasicInfo from './FormBasicInfo';
import QuestionEditor from './QuestionEditor';
import QuestionList from './QuestionList';
import FormPreview from './FormPreview';
import { Save, Eye, Plus, Settings } from 'lucide-react';

const FormBuilder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createForm, updateForm, getForm } = useForm();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [headerImage, setHeaderImage] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (id) {
      const form = getForm(id);
      if (form) {
        setTitle(form.title);
        setDescription(form.description);
        setHeaderImage(form.headerImage || '');
        setQuestions(form.questions);
      }
    }
  }, [id, getForm]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex(q => q.id === active.id);
      const newIndex = questions.findIndex(q => q.id === over.id);
      
      setQuestions(arrayMove(questions, oldIndex, newIndex));
    }
  };

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      title: 'New Question',
      data: getDefaultQuestionData(type)
    };
    
    setQuestions([...questions, newQuestion]);
    setCurrentQuestion(newQuestion);
  };

  const getDefaultQuestionData = (type: Question['type']) => {
    switch (type) {
      case 'categorize':
        return {
          categories: ['Category 1', 'Category 2'],
          items: [
            { id: '1', text: 'Item 1', correctCategory: 'Category 1' },
            { id: '2', text: 'Item 2', correctCategory: 'Category 2' }
          ]
        };
      case 'cloze':
        return {
          text: 'This is a sample text with _____ that need to be filled.',
          blanks: [
            { id: '1', position: 0, correctAnswer: 'blanks' }
          ]
        };
      case 'comprehension':
        return {
          passage: 'Write your passage here...',
          questions: [
            { id: '1', question: 'What is the main idea?', type: 'text', correctAnswer: '' }
          ]
        };
      default:
        return {};
    }
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
    
    if (currentQuestion && currentQuestion.id === questionId) {
      setCurrentQuestion({ ...currentQuestion, ...updates });
    }
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    if (currentQuestion && currentQuestion.id === questionId) {
      setCurrentQuestion(null);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a form title');
      return;
    }

    setSaving(true);

    try {
      const formData = {
        title,
        description,
        headerImage,
        questions,
        createdBy: user?.id || '',
        isPublished: false
      };

      if (id) {
        updateForm(id, formData);
      } else {
        const newFormId = await createForm(formData);
        navigate(`/forms/${newFormId}/edit`);
      }

      setSaving(false);
      alert('Form saved successfully!');
    } catch (error) {
      setSaving(false);
      alert('Error saving form');
    }
  };

  const handlePublish = () => {
    if (id) {
      updateForm(id, { isPublished: true });
      alert('Form published successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {id ? 'Edit Form' : 'Create New Form'}
                </h1>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setActiveTab('edit')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'edit'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Settings className="h-4 w-4 inline-block mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'preview'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Eye className="h-4 w-4 inline-block mr-1" />
                    Preview
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
                {id && (
                  <button
                    onClick={handlePublish}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex">
          {activeTab === 'edit' ? (
            <>
              {/* Left Sidebar */}
              <div className="w-80 bg-white shadow-sm border-r min-h-screen">
                <div className="p-6 space-y-6">
                  <FormBasicInfo
                    title={title}
                    description={description}
                    headerImage={headerImage}
                    onTitleChange={setTitle}
                    onDescriptionChange={setDescription}
                    onHeaderImageChange={setHeaderImage}
                  />
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Questions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => addQuestion('categorize')}
                        className="w-full flex items-center px-4 py-3 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors"
                      >
                        <Plus className="h-5 w-5 mr-3 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">Categorize</div>
                          <div className="text-sm text-gray-600">Drag & drop items</div>
                        </div>
                      </button>
                      <button
                        onClick={() => addQuestion('cloze')}
                        className="w-full flex items-center px-4 py-3 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors"
                      >
                        <Plus className="h-5 w-5 mr-3 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">Cloze</div>
                          <div className="text-sm text-gray-600">Fill in the blanks</div>
                        </div>
                      </button>
                      <button
                        onClick={() => addQuestion('comprehension')}
                        className="w-full flex items-center px-4 py-3 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors"
                      >
                        <Plus className="h-5 w-5 mr-3 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">Comprehension</div>
                          <div className="text-sm text-gray-600">Reading with questions</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Content */}
              <div className="flex-1 p-6">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={questions.map(q => q.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <QuestionList
                      questions={questions}
                      onQuestionSelect={setCurrentQuestion}
                      onQuestionDelete={deleteQuestion}
                      selectedQuestionId={currentQuestion?.id}
                    />
                  </SortableContext>
                </DndContext>
              </div>

              {/* Right Sidebar */}
              {currentQuestion && (
                <div className="w-96 bg-white shadow-sm border-l min-h-screen">
                  <div className="p-6">
                    <QuestionEditor
                      question={currentQuestion}
                      onUpdate={(updates) => updateQuestion(currentQuestion.id, updates)}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 p-6">
              <FormPreview
                title={title}
                description={description}
                headerImage={headerImage}
                questions={questions}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;