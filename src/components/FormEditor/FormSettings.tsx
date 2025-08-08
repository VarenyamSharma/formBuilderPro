import React from 'react';
import { X, Settings, Globe, Shield, BarChart3 } from 'lucide-react';
import { Form } from '../../types/form';

interface FormSettingsProps {
  form: Form;
  onUpdate: (form: Form) => void;
  onClose: () => void;
}

const FormSettings: React.FC<FormSettingsProps> = ({ form, onUpdate, onClose }) => {
  const updateSettings = (key: keyof typeof form.settings, value: boolean) => {
    onUpdate({
      ...form,
      settings: {
        ...form.settings,
        [key]: value,
      },
    });
  };

  const togglePublished = () => {
    onUpdate({
      ...form,
      isPublished: !form.isPublished,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Form Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Publishing Status */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Publishing</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Make form public</h4>
                <p className="text-sm text-gray-600 mt-1">
                  When published, anyone with the link can fill out your form
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={togglePublished}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {form.isPublished && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Form is published and can be accessed at: 
                  <br />
                  <code className="bg-green-100 px-2 py-1 rounded text-xs mt-1 inline-block">
                    {window.location.origin}/form/{form._id}
                  </code>
                </p>
              </div>
            )}
          </div>

          {/* Response Settings */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Response Collection</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Allow multiple submissions</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Let users submit the form multiple times
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.settings.allowMultipleSubmissions}
                    onChange={(e) => updateSettings('allowMultipleSubmissions', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Show progress bar</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Display progress indicator to users
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.settings.showProgressBar}
                    onChange={(e) => updateSettings('showProgressBar', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Collect email addresses</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Require users to provide their email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.settings.collectEmail}
                    onChange={(e) => updateSettings('collectEmail', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Security & Privacy</h3>
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-2">
                • All form responses are securely stored and encrypted
              </p>
              <p className="mb-2">
                • IP addresses are logged for spam prevention
              </p>
              <p className="mb-2">
                • Forms can be unpublished at any time to stop collecting responses
              </p>
              <p>
                • Response data can be exported or deleted upon request
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormSettings;