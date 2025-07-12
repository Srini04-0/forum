import React, { useState } from 'react';
import { ArrowLeft, Tag, Type } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface AskQuestionProps {
  onSubmit: (title: string, description: string, tags: string[]) => void;
  onBack: () => void;
  user: { name: string } | null;
}

export const AskQuestion: React.FC<AskQuestionProps> = ({
  onSubmit,
  onBack,
  user
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      alert('Please fill in both title and description');
      return;
    }

    if (!user) {
      alert('Please sign in to post a question');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onSubmit(title.trim(), description.trim(), tags);
    
    // Reset form
    setTitle('');
    setDescription('');
    setTagsInput('');
  };

  const isValid = title.trim() && description.trim();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Ask a Question</h1>
      </div>

      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            Please set your name in the header before asking a question.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Type className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Title</h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Be specific and imagine you're asking a question to another person.
          </p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How do I center a div in CSS?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={200}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {title.length}/200
          </div>
        </div>

        {/* Description */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Type className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Description</h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Include all the information someone would need to answer your question.
          </p>
          <RichTextEditor
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide more details about your question..."
          />
        </div>

        {/* Tags */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Tag className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Add up to 5 tags to describe what your question is about (comma-separated).
          </p>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. css, html, frontend"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isValid || !user}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Post Your Question
          </button>
        </div>
      </form>
    </div>
  );
};