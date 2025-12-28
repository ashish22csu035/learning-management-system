// src/pages/HomePage.jsx

import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';

function HomePage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section - UPDATED with gradient */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Learn Without Limits
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Access thousands of courses taught by expert instructors. 
              Start learning today and transform your career.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-outline text-lg px-8 py-3">
                Sign In
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-4 gap-8 mt-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">1000+ Courses</h3>
              <p className="text-gray-600">Choose from a wide range of topics</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Instructors</h3>
              <p className="text-gray-600">Learn from industry professionals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Certificates</h3>
              <p className="text-gray-600">Earn certificates upon completion</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Career Growth</h3>
              <p className="text-gray-600">Advance your professional skills</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;