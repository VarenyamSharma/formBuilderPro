import React from 'react';
import { ImageIcon, Type, FileText } from 'lucide-react';

interface FormBasicInfoProps {
  title: string;
  description: string;
  headerImage: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onHeaderImageChange: (image: string) => void;
}

const FormBasicInfo: React.FC<FormBasicInfoProps> = ({
  title,
  description,
  headerImage,
  onTitleChange,
  onDescriptionChange,
  onHeaderImageChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <FileText className="h-5 w-5 mr-2" />
        Form Details
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Type className="h-4 w-4 inline-block mr-1" />
          Form Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter form title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Describe your form..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <ImageIcon className="h-4 w-4 inline-block mr-1" />
          Header Image URL
        </label>
        <input
          type="url"
          value={headerImage}
          onChange={(e) => onHeaderImageChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://example.com/image.jpg"
        />
        {headerImage && (
          <div className="mt-2">
            <img
              src={headerImage}
              alt="Header preview"
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBasicInfo;