import React, { useContext } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import jwtDecode from 'jwt-decode';

const UserSignup = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const handleSuccess = async (credentialResponse) => {
    try {
      const decodedToken = jwtDecode(credentialResponse.credential);
      const { name, email } = decodedToken;

      setUser({ email });

      await fetch('https://simple-word-processor.onrender.com/catalog/author/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${credentialResponse.credential}`,
        },
        body: JSON.stringify({
          name: name,
          email: email,
          summary: `My name is ${name} and I signed up using Google.`,
        }),
      });

      navigate('/contact');
    } catch (error) {
      console.error('Error in handleSuccess:', error);
    }
  };

  const handleError = (error) => {
    console.log('Google Sign In Error', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://www.kindpng.com/picc/m/368-3680049_word-processing-software-logo-hd-png-download.png"
            alt="Logo"
            className="w-16 h-16"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign up to get started with our word processor.
        </p>

        {/* Google Sign-in */}
        <GoogleOAuthProvider clientId="590577612365-ha7qrqb1ebd1v7mjv9ramlk73ctk9k10.apps.googleusercontent.com">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              size="large"
              shape="pill"
              width="250"
            />
          </div>
        </GoogleOAuthProvider>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </p>

        {/* Footer */}
        <p className="text-[10px] text-gray-400 text-center mt-8">
          This site is protected by reCAPTCHA and the{' '}
          <span className="underline">Google Privacy Policy</span> and{' '}
          <span className="underline">Terms of Service</span> apply.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
