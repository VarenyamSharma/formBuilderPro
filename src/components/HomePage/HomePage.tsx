import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText, Eye, Calendar, Users, BarChart3 } from 'lucide-react';
import { Form } from '../../types/form';
import { formApi } from '../../services/api';
import FormSubmissions from '../FormEditor/FormSubmissions';

const HomePage: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [loadingSelectedForm, setLoadingSelectedForm] = useState(false);
  const [responsesError, setResponsesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await formApi.getForms();
        setForms(response.data);
      } catch (error) {
        console.error('Error fetching forms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const openResponses = async (formId: string | undefined) => {
    if (!formId) return;
    try {
      setResponsesError(null);
      setLoadingSelectedForm(true);
      const response = await formApi.getForm(formId);
      setSelectedForm(response.data);
      setShowSubmissions(true);
    } catch (error) {
      console.error('Error loading form for responses:', error);
      setResponsesError('Failed to load form details. Please try again.');
    } finally {
      setLoadingSelectedForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FormCraft</h1>
                <p className="text-sm text-gray-500">Build beautiful forms with ease</p>
              </div>
            </div>
            <Link
              to="/editor"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Form
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Create Interactive Forms
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Build engaging forms with unique question types including categorization, 
            fill-in-the-blanks, and reading comprehension. Perfect for educators, 
            researchers, and businesses.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/editor"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg"
            >
              <PlusCircle className="w-6 h-6 mr-2" />
              Start Building
            </Link>
            <a
              href="#features"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium text-lg"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Categorize Questions</h3>
              <p className="text-gray-600">
                Create drag-and-drop categorization exercises perfect for learning and assessment.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cloze Tests</h3>
              <p className="text-gray-600">
                Build fill-in-the-blank exercises to test knowledge and comprehension skills.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Comprehension</h3>
              <p className="text-gray-600">
                Create reading comprehension exercises with passages and related questions.
              </p>
            </div>
          </div>
        </section>

        {/* Published Forms */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Published Forms</h3>
            <Link
              to="/editor"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first form →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : forms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => (
                <div key={form._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {form.headerImage && (
                    <div className="w-full h-32 overflow-hidden">
                      <img
                        src={`http://localhost:5000${form.headerImage}`}
                        alt={form.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {form.title}
                    </h4>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {form.description || 'No description provided'}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : '-'}
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {form.questions?.length || 0} questions
                      </div>
                    </div>
                    <Link
                      to={`/form/${form._id}`}
                      className="inline-flex items-center w-full justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Take Form
                    </Link>
                    <button
                      onClick={() => openResponses(form._id)}
                      className="mt-2 inline-flex items-center w-full justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Responses
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No forms yet</h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first form
              </p>
              <Link
                to="/editor"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Create Form
              </Link>
            </div>
          )}
        </section>
      </main>

      {loadingSelectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow w-[320px] text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading responses...</p>
          </div>
        </div>
      )}

      {responsesError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setResponsesError(null)}>
          <div className="bg-white rounded-lg p-6 shadow w-[360px]">
            <h4 className="text-lg font-semibold text-red-700 mb-2">Error</h4>
            <p className="text-gray-700 mb-4">{responsesError}</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => setResponsesError(null)}>Close</button>
          </div>
        </div>
      )}

      {showSubmissions && selectedForm && (
        <FormSubmissions
          form={selectedForm}
          onClose={() => { setShowSubmissions(false); setSelectedForm(null); }}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2025 FormCraft. Built with React, Node.js, and MongoDB.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;