import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from '../../context/FormContext';
import { format } from 'date-fns';
import { Download, Filter, Search, Eye, Calendar, User } from 'lucide-react';

const ResponseView: React.FC = () => {
  const { id } = useParams();
  const { getForm, getFormResponses } = useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);

  const form = id ? getForm(id) : null;
  const responses = id ? getFormResponses(id) : [];

  const filteredResponses = responses.filter(response => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (response.submitterInfo?.name?.toLowerCase() || '').includes(searchLower) ||
      (response.submitterInfo?.email?.toLowerCase() || '').includes(searchLower) ||
      Object.values(response.answers).some(answer => 
        String(answer).toLowerCase().includes(searchLower)
      )
    );
  });

  const exportToCSV = () => {
    if (!form || responses.length === 0) return;

    const headers = ['Submission Date', 'Submitter Name', 'Submitter Email'];
    
    // Add question headers
    form.questions.forEach(question => {
      headers.push(question.title);
    });

    const csvData = [
      headers.join(','),
      ...responses.map(response => {
        const row = [
          format(new Date(response.submittedAt), 'yyyy-MM-dd HH:mm:ss'),
          response.submitterInfo?.name || 'Anonymous',
          response.submitterInfo?.email || ''
        ];

        // Add answers
        form.questions.forEach(question => {
          const answer = response.answers[question.id];
          let cellValue = '';
          
          if (answer) {
            if (typeof answer === 'object') {
              cellValue = JSON.stringify(answer);
            } else {
              cellValue = String(answer);
            }
          }
          
          // Escape commas and quotes
          cellValue = cellValue.replace(/"/g, '""');
          if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
            cellValue = `"${cellValue}"`;
          }
          
          row.push(cellValue);
        });

        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const renderAnswer = (question: any, answer: any) => {
    if (!answer) return <span className="text-gray-400">No answer</span>;

    switch (question.type) {
      case 'categorize':
        return (
          <div className="space-y-2">
            {Object.entries(answer).map(([category, items]: [string, any]) => (
              <div key={category} className="text-sm">
                <span className="font-medium">{category}:</span> {Array.isArray(items) ? items.join(', ') : items}
              </div>
            ))}
          </div>
        );
      case 'cloze':
        return (
          <div className="space-y-1">
            {Object.entries(answer).map(([blankId, value]: [string, any], index) => (
              <div key={blankId} className="text-sm">
                <span className="font-medium">Blank {index + 1}:</span> {value}
              </div>
            ))}
          </div>
        );
      case 'comprehension':
        return (
          <div className="space-y-1">
            {Object.entries(answer).map(([qId, value]: [string, any]) => {
              const subQuestion = question.data.questions.find((q: any) => q.id === qId);
              return (
                <div key={qId} className="text-sm">
                  <span className="font-medium">{subQuestion?.question}:</span> {value}
                </div>
              );
            })}
          </div>
        );
      default:
        return <span>{String(answer)}</span>;
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Form not found</p>
        </div>
      </div>
    );
  }

  const selectedResponseData = selectedResponse 
    ? responses.find(r => r.id === selectedResponse)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Responses for "{form.title}"
          </h1>
          <p className="text-gray-600">
            Total responses: {responses.length}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={exportToCSV}
            disabled={responses.length === 0}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>

        {responses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
            <p className="text-gray-600">Responses will appear here once people start filling out your form.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResponses.map((response, index) => (
                    <tr key={response.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          Response #{responses.length - index}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {response.submitterInfo?.name || 'Anonymous'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {response.submitterInfo?.email || 'No email provided'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(response.submittedAt), 'MMM d, yyyy HH:mm')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedResponse(response.id)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Response Detail Modal */}
        {selectedResponseData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Response Details</h3>
                  <button
                    onClick={() => setSelectedResponse(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    ×
                  </button>
                </div>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {selectedResponseData.submitterInfo?.name || 'Anonymous'}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(selectedResponseData.submittedAt), 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {form.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                      {index + 1}. {question.title}
                    </h4>
                    <div className="text-gray-800">
                      {renderAnswer(question, selectedResponseData.answers[question.id])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseView;