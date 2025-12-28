// src/components/courses/AICourseGenerator.jsx

import { useState } from 'react';
import { aiService } from '../../api/aiService';
import { Sparkles, Loader, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function AICourseGenerator({ onGenerated }) {
  const [formData, setFormData] = useState({
    topic: '',
    category: 'Web Development',
    level: 'Beginner',
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cloud Computing',
    'Cybersecurity',
    'UI/UX Design',
    'DevOps',
    'Blockchain',
    'Other',
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.topic.trim()) {
      toast.error('Please enter a course topic');
      return;
    }

    setLoading(true);

    try {
      const response = await aiService.generateCourse(formData);

      if (response.success) {
        toast.success('✨ AI generated course content!');
        onGenerated(response.data); // Send data back to parent
        setShowModal(false);
        setFormData({ topic: '', category: 'Web Development', level: 'Beginner' });
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-primary flex items-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        Generate with AI
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  AI Course Generator
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Info Banner */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-purple-800">
                Our AI will generate a complete course outline including title, description, 
                learning outcomes, and curriculum structure based on your inputs.
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Topic *
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., Building REST APIs with Node.js"
                  className="input w-full"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific about what you want to teach
                </p>
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input w-full"
                  disabled={loading}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="input w-full"
                  disabled={loading}
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Loading Message */}
            {loading && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  🤖 AI is crafting your course content... This may take 10-15 seconds.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AICourseGenerator;