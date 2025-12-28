// src/pages/courses/CourseDetailPage.jsx

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '../../components/layout/Navbar';
import { courseService } from '../../api/courseService';
import { enrollmentService } from '../../api/enrollmentService';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import {
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  Award,
  Globe,
  BarChart,
  Loader,
} from 'lucide-react';

function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();

  // Fetch course details
  const {
    data: courseData,
    isLoading: courseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourseById(id),
  });

  // Check enrollment status
  const { data: enrollmentData } = useQuery({
    queryKey: ['enrollment', id],
    queryFn: () => enrollmentService.checkEnrollment(id),
    enabled: isAuthenticated && user?.role === 'student',
  });

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: () => enrollmentService.enrollInCourse(id),
    onSuccess: () => {
      toast.success('Successfully enrolled in course!');
      queryClient.invalidateQueries(['enrollment', id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    },
  });

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll');
      navigate('/login');
      return;
    }

    if (user?.role !== 'student') {
      toast.error('Only students can enroll in courses');
      return;
    }

    enrollMutation.mutate();
  };

  if (courseLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader className="w-12 h-12 animate-spin text-primary-600" />
        </div>
      </>
    );
  }

  if (courseError || !courseData?.data) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Course Not Found
            </h1>
            <button onClick={() => navigate('/courses')} className="btn btn-primary">
              Back to Courses
            </button>
          </div>
        </div>
      </>
    );
  }

  const course = courseData.data;
  const isEnrolled = enrollmentData?.isEnrolled;
  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-yellow">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Content */}
              <div className="md:col-span-2">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-4">
                  <span className="opacity-75">{course.category}</span>
                  <span className="opacity-75">›</span>
                  <span>{course.level}</span>
                </div>

                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg opacity-90 mb-6">{course.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-bold">{course.averageRating}</span>
                    <span className="opacity-75">
                      ({course.ratingsCount} ratings)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{course.enrollmentCount} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration} hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    <span>{course.language}</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white border-opacity-20">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-600">
                      {course.instructor?.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Created by</p>
                    <p className="font-semibold">{course.instructor?.name}</p>
                  </div>
                </div>
              </div>

              {/* Right Card */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-xl p-6 text-gray-900">
                  {/* Price */}
                  <div className="mb-6">
                    {course.hasDiscount ? (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold">
                            ₹{course.discountPrice}
                          </span>
                          <span className="text-xl text-gray-500 line-through">
                            ₹{course.price}
                          </span>
                        </div>
                        <p className="text-sm text-red-600 font-semibold mt-1">
                          {course.discountPercentage}% off
                        </p>
                      </>
                    ) : (
                      <div className="text-4xl font-bold">
                        {course.price === 0 ? 'Free' : `₹${course.price}`}
                      </div>
                    )}
                  </div>

                  {/* Enroll Button */}
                  {isEnrolled ? (
                    <button className="btn btn-primary w-full mb-3" disabled>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Already Enrolled
                    </button>
                  ) : isInstructor ? (
                    <button className="btn btn-secondary w-full mb-3" disabled>
                      Instructors cannot enroll
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrollMutation.isPending}
                      className="btn btn-primary w-full mb-3"
                    >
                      {enrollMutation.isPending ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-5 h-5 mr-2" />
                          Enroll Now
                        </>
                      )}
                    </button>
                  )}

                  {/* Course Includes */}
                  <div className="space-y-3 text-sm">
                    <h3 className="font-bold text-lg mb-3">This course includes:</h3>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>{course.duration} hours of video content</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>Access on mobile and desktop</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* What You'll Learn */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.learningOutcomes?.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-700">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructor Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">About the instructor</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary-600">
                      {course.instructor?.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{course.instructor?.name}</h3>
                    <p className="text-gray-600 mt-1">
                      {course.instructor?.bio || 'Experienced instructor'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              {/* Course Stats */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Course Details</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level</span>
                    <span className="font-semibold">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{course.duration} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language</span>
                    <span className="font-semibold">{course.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students</span>
                    <span className="font-semibold">{course.enrollmentCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold">{course.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetailPage;