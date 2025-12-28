// src/pages/dashboard/DashboardPage.jsx

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { courseService } from '../../api/courseService';
import Navbar from '../../components/layout/Navbar';
import { BookOpen, GraduationCap, Award, TrendingUp, Plus, Eye } from 'lucide-react';

function DashboardPage() {
  const { user } = useAuthStore();

  // Fetch instructor's courses if user is instructor
  const { data: myCoursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['myCourses'],
    queryFn: courseService.getMyCourses,
    enabled: user?.role === 'instructor' || user?.role === 'admin',
  });

  const myCourses = myCoursesData?.data || [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600">
              Continue your learning journey
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-10 h-10 text-blue-600" />
                <span className="text-3xl font-bold text-gray-900">
                  {user?.role === 'instructor' ? myCourses.length : 0}
                </span>
              </div>
              <h3 className="text-gray-600 font-medium">
                {user?.role === 'instructor' ? 'Your Courses' : 'Enrolled Courses'}
              </h3>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <GraduationCap className="w-10 h-10 text-green-600" />
                <span className="text-3xl font-bold text-gray-900">0</span>
              </div>
              <h3 className="text-gray-600 font-medium">Completed</h3>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-10 h-10 text-yellow-600" />
                <span className="text-3xl font-bold text-gray-900">0</span>
              </div>
              <h3 className="text-gray-600 font-medium">Certificates</h3>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-10 h-10 text-purple-600" />
                <span className="text-3xl font-bold text-gray-900">0%</span>
              </div>
              <h3 className="text-gray-600 font-medium">Progress</h3>
            </div>
          </div>

          {/* Role-specific content */}
          {user?.role === 'student' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Continue Learning</h2>
              <p className="text-gray-600 mb-4">
                You haven't enrolled in any courses yet.
              </p>
              <Link to="/courses" className="btn btn-primary">
                Browse Courses
              </Link>
            </div>
          )}

          {user?.role === 'instructor' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Courses</h2>
                <Link to="/courses/create" className="btn btn-primary flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Course
                </Link>
              </div>

              {coursesLoading ? (
                <p className="text-gray-600">Loading courses...</p>
              ) : myCourses.length > 0 ? (
                <div className="space-y-4">
                  {myCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">
                            {course.title}
                          </h3>
                          {course.isPublished ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                              Published
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                              Draft
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{course.category}</span>
                          <span>•</span>
                          <span>{course.enrollmentCount} students</span>
                          <span>•</span>
                          <span>₹{course.price}</span>
                        </div>
                      </div>
                      <Link
                        to={`/courses/${course.id}`}
                        className="btn btn-outline flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </div>
                  ))}
                  
                  {myCourses.length > 3 && (
                    <Link
                      to="/courses/my-courses"
                      className="block text-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View All Courses →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    You haven't created any courses yet.
                  </p>
                  <Link to="/courses/create" className="btn btn-primary">
                    Create Your First Course
                  </Link>
                </div>
              )}
            </div>
          )}

          {user?.role === 'admin' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Link
                  to="/admin"
                  className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <h3 className="font-bold text-lg mb-2">Dashboard</h3>
                  <p className="text-sm text-gray-600">View statistics</p>
                </Link>
                <Link
                  to="/admin/users"
                  className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
                >
                  <h3 className="font-bold text-lg mb-2">Manage Users</h3>
                  <p className="text-sm text-gray-600">View and edit users</p>
                </Link>
                <Link
                  to="/admin/courses"
                  className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                >
                  <h3 className="font-bold text-lg mb-2">Manage Courses</h3>
                  <p className="text-sm text-gray-600">Oversee all courses</p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardPage;