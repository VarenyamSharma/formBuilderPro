import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from '../../context/FormContext';
import { Copy, Mail, ExternalLink, Share, Check, AlertCircle } from 'lucide-react';

const ShareForm: React.FC = () => {
  const { id } = useParams();
  const { getForm, updateForm } = useForm();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = id ? getForm(id) : null;
  const formUrl = form ? `${window.location.origin}/form/${form.id}` : '';

  React.useEffect(() => {
    if (form) {
      setEmailSubject(`You're invited to fill out: ${form.title}`);
      setEmailMessage(`Hi there,

You've been invited to fill out a form: "${form.title}"

${form.description ? form.description + '\n\n' : ''}Please click the link below to get started:
${formUrl}

Thank you!`);
    }
  }, [form, formUrl]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handlePublish = () => {
    if (form && id) {
      updateForm(id, { isPublished: true });
      alert('Form published successfully!');
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Simulate email sending - in real app, this would call your backend
    setTimeout(() => {
      setSending(false);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    }, 1500);
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Form not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Share "{form.title}"
          </h1>
          <p className="text-gray-600">
            Share your form with others to start collecting responses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Publishing Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Share className="h-5 w-5 mr-2" />
              Publishing Status
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Form Status</h3>
                  <p className="text-sm text-gray-600">
                    {form.isPublished ? 'Your form is live and accepting responses' : 'Your form is not published yet'}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  form.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {form.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              {!form.isPublished && (
                <button
                  onClick={handlePublish}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Publish Form
                </button>
              )}
            </div>
          </div>

          {/* Public Link */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ExternalLink className="h-5 w-5 mr-2" />
              Public Link
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Form URL
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={formUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-600"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-r-lg border border-l-0 border-gray-300 transition-colors ${
                      copied 
                        ? 'bg-green-100 text-green-700 border-green-300' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    {copied ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-2">
                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                >
                  Open Form
                </a>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Email Sharing */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Send via Email
          </h2>

          {emailSent && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-green-700">
              <Check className="h-5 w-5" />
              <span>Email sent successfully! (Demo mode - no actual email sent)</span>
            </div>
          )}

          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="recipient@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Your message..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sending || !email}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <strong>Note:</strong> This is a demo application. In a production environment, 
            this would integrate with an email service like Nodemailer to send actual emails.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareForm;