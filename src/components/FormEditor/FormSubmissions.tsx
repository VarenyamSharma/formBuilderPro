import React, { useState, useEffect } from 'react';
import { Download, Eye, Calendar, Mail, BarChart3, Users, FileText, BookOpen } from 'lucide-react';
import { Submission, Form, Question } from '../../types/form';
import { formApi } from '../../services/api';

interface FormSubmissionsProps {
  form: Form;
  onClose: () => void;
}

interface SubmissionStats {
  totalSubmissions: number;
  averageScore: number;
  completionRate: number;
  questionStats: {
    [questionId: string]: {
      questionTitle: string;
      questionType: string;
      responseCount: number;
      correctAnswers?: number;
    };
  };
}

const FormSubmissions: React.FC<FormSubmissionsProps> = ({ form, onClose }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [stats, setStats] = useState<SubmissionStats | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, [form._id]);

  const loadSubmissions = async () => {
    if (!form._id) return;
    
    try {
      setLoading(true);
      const response = await formApi.getFormSubmissions(form._id);
      setSubmissions(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error loading submissions:', error);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (submissions: Submission[]) => {
    const totalSubmissions = submissions.length;
    const scores = submissions.map(s => s.score || 0).filter(s => s > 0);
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    const questionStats: { [questionId: string]: any } = {};
    
    form.questions.forEach(question => {
      const responses = submissions.filter(s => 
        s.answers.some(a => a.questionId === question.id)
      ).length;
      
      questionStats[question.id] = {
        questionTitle: question.title,
        questionType: question.type,
        responseCount: responses,
      };
    });

    setStats({
      totalSubmissions,
      averageScore: Math.round(averageScore * 100) / 100,
      completionRate: totalSubmissions > 0 ? 100 : 0,
      questionStats,
    });
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'categorize':
        return <Users className="w-4 h-4 text-green-600" />;
      case 'cloze':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'comprehension':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderAnswer = (answer: any, question: Question) => {
    switch (question.type) {
      case 'categorize':
        return (
          <div className="space-y-2">
            {answer.categorizations?.map((cat: any, index: number) => {
              const item = question.items?.find(i => i.id === cat.itemId);
              const category = question.categories?.find(c => c.id === cat.categoryId);
              return (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <span className="font-medium">{item?.text}</span>
                  <span className="text-gray-500">→</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {category?.name}
                  </span>
                </div>
              );
            })}
          </div>
        );

      case 'cloze':
        return (
          <div className="space-y-2">
            {answer.blankAnswers?.map((blank: any, index: number) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Blank {index + 1}:</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  {blank.answer}
                </span>
              </div>
            ))}
          </div>
        );

      case 'comprehension':
        return (
          <div className="space-y-2">
            {answer.subAnswers?.map((subAnswer: any, index: number) => {
              const subQuestion = question.subQuestions?.find(sq => sq.id === subAnswer.subQuestionId);
              return (
                <div key={index} className="space-y-1">
                  <div className="text-sm font-medium text-gray-700">
                    {subQuestion?.question}
                  </div>
                  <div className="text-sm bg-gray-100 p-2 rounded">
                    {subAnswer.answer}
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return <span className="text-gray-500">No answer data</span>;
    }
  };

  const exportSubmissions = () => {
    const csvData = submissions.map(submission => {
      const row: any = {
        'Submission ID': submission._id,
        'Email': submission.submitterEmail || 'N/A',
        'Submitted At': formatDate(submission.completedAt || ''),
        'Score': submission.score || 'N/A',
      };

      form.questions.forEach(question => {
        const answer = submission.answers.find(a => a.questionId === question.id);
        if (answer) {
          switch (question.type) {
            case 'categorize':
              row[`${question.title} (Categorize)`] = answer.categorizations
                ?.map((cat: any) => {
                  const item = question.items?.find(i => i.id === cat.itemId);
                  const category = question.categories?.find(c => c.id === cat.categoryId);
                  return `${item?.text} → ${category?.name}`;
                })
                .join('; ') || 'N/A';
              break;
            case 'cloze':
              row[`${question.title} (Cloze)`] = answer.blankAnswers
                ?.map((blank: any) => blank.answer)
                .join('; ') || 'N/A';
              break;
            case 'comprehension':
              row[`${question.title} (Comprehension)`] = answer.subAnswers
                ?.map((subAnswer: any) => {
                  const subQuestion = question.subQuestions?.find(sq => sq.id === subAnswer.subQuestionId);
                  return `${subQuestion?.question}: ${subAnswer.answer}`;
                })
                .join('; ') || 'N/A';
              break;
          }
        } else {
          row[question.title] = 'No answer';
        }
      });

      return row;
    });

    // Convert to CSV
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title}_submissions.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading submissions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Form Submissions</h2>
            <p className="text-gray-600">{form.title}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportSubmissions}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Submissions List */}
          <div className="w-1/3 border-r overflow-y-auto">
            <div className="p-4">
              {error ? (
                <div className="text-red-600 text-center py-8">{error}</div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
                  <p className="text-sm">Share your form to start collecting responses</p>
                </div>
              ) : (
                <>
                  {/* Stats */}
                  {stats && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-3">Summary</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-blue-600 font-medium">Total Responses</div>
                          <div className="text-2xl font-bold text-blue-900">{stats.totalSubmissions}</div>
                        </div>
                        <div>
                          <div className="text-blue-600 font-medium">Avg Score</div>
                          <div className="text-2xl font-bold text-blue-900">{stats.averageScore}%</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submissions List */}
                  <div className="space-y-2">
                    {submissions.map((submission) => (
                      <div
                        key={submission._id}
                        onClick={() => setSelectedSubmission(submission)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedSubmission?._id === submission._id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium">
                              {submission.submitterEmail || 'Anonymous'}
                            </span>
                          </div>
                          {submission.score !== undefined && (
                            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                              {submission.score}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(submission.completedAt || '')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Panel - Submission Details */}
          <div className="flex-1 overflow-y-auto">
            {selectedSubmission ? (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Submission Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">
                        {selectedSubmission.submitterEmail || 'Anonymous'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Submitted:</span>
                      <span className="ml-2 font-medium">
                        {formatDate(selectedSubmission.completedAt || '')}
                      </span>
                    </div>
                    {selectedSubmission.score !== undefined && (
                      <div>
                        <span className="text-gray-600">Score:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {selectedSubmission.score}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {form.questions.map((question) => {
                    const answer = selectedSubmission.answers.find(a => a.questionId === question.id);
                    return (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          {getQuestionIcon(question.type)}
                          <h4 className="font-medium text-gray-900">{question.title}</h4>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {question.type}
                          </span>
                        </div>
                        {question.description && (
                          <p className="text-sm text-gray-600 mb-3">{question.description}</p>
                        )}
                        <div className="bg-gray-50 rounded-lg p-3">
                          {answer ? (
                            renderAnswer(answer, question)
                          ) : (
                            <span className="text-gray-500 italic">No answer provided</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a submission to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSubmissions;
