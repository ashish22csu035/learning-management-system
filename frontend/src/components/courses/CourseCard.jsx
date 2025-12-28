// src/components/courses/CourseCard.jsx

import { Link } from 'react-router-dom';
import { Clock, Users, Star, BookOpen } from 'lucide-react';

function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
        {/* Course Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          {course.hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {course.discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Course Content */}
        <div className="p-4">
          {/* Category Badge */}
          <div className="mb-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {course.category}
            </span>
            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded ml-2">
              {course.level}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {course.description}
          </p>

          {/* Instructor */}
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
              <span className="text-sm font-bold text-gray-600">
                {course.instructor?.name?.charAt(0) || 'I'}
              </span>
            </div>
            <span className="text-sm text-gray-700">
              {course.instructor?.name || 'Instructor'}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span>{course.averageRating || 0}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{course.enrollmentCount || 0}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{course.duration}h</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              {course.hasDiscount ? (
                <>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{course.discountPrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ₹{course.price}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  {course.price === 0 ? 'Free' : `₹${course.price}`}
                </span>
              )}
            </div>
            <button className="btn btn-primary text-sm">
              View Course
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;