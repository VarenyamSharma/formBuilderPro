import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from '../../context/FormContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Share2, 
  BarChart3,
  Calendar,
  Users,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { forms, deleteForm, getFormResponses } = useForm();
  const { user } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (formId: string) => {
    deleteForm(formId);
    setDeleteConfirm(null);
  };

  const getTotalResponses = () => {
    return forms.reduce((total, form) => total + getFormResponses(form.id).length, 0);
  };

  const getPublishedForms = () => {
    return forms.filter(form => form.isPublished).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your forms and track responses from your dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold text-gray-900">{forms.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{getPublishedForms()}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalResponses()}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {forms.filter(form => {
                    const createdThisMonth = new Date(form.createdAt).getMonth() === new Date().getMonth();
                    return createdThisMonth;
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
            to="/forms/create"
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Form
          </Link>
        </div>

        {/* Forms List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Your Forms</h2>
          </div>

          {forms.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
              <p className="text-gray-600 mb-6">Create your first form to get started</p>
              <Link
                to="/forms/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {forms.map((form) => {
                const responses = getFormResponses(form.id);
                return (
                  <div key={form.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{form.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            form.isPublished 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {form.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{form.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created {format(new Date(form.createdAt), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{responses.length} responses</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="h-4 w-4" />
                            <span>{form.questions.length} questions</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          to={`/forms/${form.id}/preview`}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Preview"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/forms/${form.id}/edit`}
                          className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/forms/${form.id}/share`}
                          className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                          title="Share"
                        >
                          <Share2 className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/forms/${form.id}/responses`}
                          className="p-2 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                          title="View Responses"
                        >
                          <BarChart3 className="h-5 w-5" />
                        </Link>
                        {deleteConfirm === form.id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDelete(form.id)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(form.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;