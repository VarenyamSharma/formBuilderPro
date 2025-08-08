import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Form } from '../../types/form';

interface FormHeaderProps {
  form: Form;
  onUpdate: (form: Form) => void;
  onUploadImage: (file: File) => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ form, onUpdate, onUploadImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  const removeImage = () => {
    onUpdate({
      ...form,
      headerImage: undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="space-y-4">
        {/* Header Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Header Image
          </label>
          {form.headerImage ? (
            <div className="relative">
              <img
                src={`http://localhost:5000${form.headerImage}`}
                alt="Form header"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-600">Click to upload header image</p>
              <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Form Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onUpdate({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter form title..."
          />
        </div>

        {/* Form Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={form.description || ''}
            onChange={(e) => onUpdate({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Describe your form..."
          />
        </div>
      </div>
    </div>
  );
};

export default FormHeader;