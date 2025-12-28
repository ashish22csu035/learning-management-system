// src/pages/courses/CoursesPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../../components/layout/Navbar';
import CourseCard from '../../components/courses/CourseCard';
import { courseService } from '../../api/courseService';
import { Plus, Search, Filter, BookOpen } from 'lucide-react';

function CoursesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  // Fetch courses
  const { data: coursesData, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await courseService.getAllCourses();
      return response;
    },
  });

  const courses = coursesData?.data || [];

  const categories = [
    'All',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cloud Computing',
    'Cybersecurity',
    'UI/UX Design',
    'DevOps',
    'Blockchain',
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">All Courses</h1>
                <p className="text-gray-600">
                  Explore and manage your learning content
                </p>
              </div>
              <button
                onClick={() => navigate('/courses/create')}
                className="btn btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Course
              </button>
            </div>

            {/* Search and Filters */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="input w-full pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input w-full pl-10"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="input w-full"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level} Level
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading courses...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">
                Failed to load courses: {error.message}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredCourses.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All'
                  ? 'Try adjusting your filters or search query'
                  : 'Get started by creating your first course'}
              </p>
              {!searchQuery && selectedCategory === 'All' && selectedLevel === 'All' && (
                <button
                  onClick={() => navigate('/courses/create')}
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Course
                </button>
              )}
            </div>
          )}

          {/* Courses Grid */}
          {!isLoading && !error && filteredCourses.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id || course.id} course={course} />
              ))}
            </div>
          )}

          {/* Results Count */}
          {!isLoading && !error && filteredCourses.length > 0 && (
            <div className="mt-6 text-center text-gray-600">
              Showing {filteredCourses.length} of {courses.length} courses
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CoursesPage;