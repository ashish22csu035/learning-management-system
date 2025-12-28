// src/pages/courses/CreateCoursePage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import AICourseGenerator from '../../components/courses/AICourseGenerator';
import { courseService } from '../../api/courseService';
import toast from 'react-hot-toast';
import { Save, Sparkles, Plus, X } from 'lucide-react';

function CreateCoursePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner',
    price: '',
    discountPrice: '',
    duration: '',
    language: 'English',
    learningOutcomes: [''],
    prerequisites: [''],
    requirements: [''],
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  // Handle AI generated data
  const handleAIGenerated = (aiData) => {
    setFormData({
      ...formData,
      title: aiData.title || formData.title,
      description: aiData.description || formData.description,
      learningOutcomes: aiData.learningOutcomes || formData.learningOutcomes,
      prerequisites: aiData.prerequisites || formData.prerequisites,
      requirements: aiData.requirements || formData.requirements,
      duration: aiData.suggestedDuration?.toString() || formData.duration,
      price: aiData.suggestedPrice?.toString() || formData.price,
    });

    toast.success('✨ AI content applied! Review and customize as needed.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty array items
      const cleanData = {
        ...formData,
        learningOutcomes: formData.learningOutcomes.filter((item) => item.trim()),
        prerequisites: formData.prerequisites.filter((item) => item.trim()),
        requirements: formData.requirements.filter((item) => item.trim()),
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        duration: Number(formData.duration),
      };

      const response = await courseService.createCourse(cleanData);

      if (response.success) {
        toast.success('Course created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Create Course Error:', error);
      toast.error(error.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Create New Course
                </h1>
                <p className="text-gray-600">
                  Fill in the details or use AI to generate content automatically
                </p>
              </div>
              <AICourseGenerator onGenerated={handleAIGenerated} />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Basic Information
                </h2>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input w-full"
                    placeholder="e.g., Complete Web Development Bootcamp"
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input w-full"
                    rows="4"
                    placeholder="Describe what students will learn..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length} / 2000 characters
                  </p>
                </div>

                {/* Category and Level */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input w-full"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level *
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="input w-full"
                    >
                      {levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price and Duration */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="4999"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Price (₹)
                    </label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="2999"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (hours) *
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="40"
                      required
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  What Students Will Learn
                </h2>
                {formData.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) =>
                        handleArrayChange('learningOutcomes', index, e.target.value)
                      }
                      className="input flex-1"
                      placeholder={`Learning outcome ${index + 1}`}
                    />
                    {formData.learningOutcomes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('learningOutcomes', index)}
                        className="btn btn-secondary"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('learningOutcomes')}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Learning Outcome
                </button>
              </div>

              {/* Prerequisites */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Prerequisites
                </h2>
                {formData.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={prereq}
                      onChange={(e) =>
                        handleArrayChange('prerequisites', index, e.target.value)
                      }
                      className="input flex-1"
                      placeholder={`Prerequisite ${index + 1}`}
                    />
                    {formData.prerequisites.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('prerequisites', index)}
                        className="btn btn-secondary"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('prerequisites')}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Prerequisite
                </button>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Requirements
                </h2>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) =>
                        handleArrayChange('requirements', index, e.target.value)
                      }
                      className="input flex-1"
                      placeholder={`Requirement ${index + 1}`}
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('requirements', index)}
                        className="btn btn-secondary"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('requirements')}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Requirement
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    'Creating...'
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Create Course
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateCoursePage;