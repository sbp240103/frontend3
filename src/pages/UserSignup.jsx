import React, { useContext } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
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
          name,
          email,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center">
        
        {/* Optional: Nice circular logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Logo"
            className="w-20 h-20 rounded-full shadow-lg"
          />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Join Our Community
        </h2>
        <p className="text-gray-500 mb-8">
          Sign up quickly with Google and start your creative journey today.
        </p>

        {/* Google Signup */}
        <GoogleOAuthProvider clientId="590577612365-ha7qrqb1ebd1v7mjv9ramlk73ctk9k10.apps.googleusercontent.com">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              size="large"
              shape="pill"
              width="280"
            />
          </div>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default UserSignup;
