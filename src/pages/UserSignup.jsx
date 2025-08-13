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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        
        {/* Left Image Section */}
        <div className="md:w-1/2 bg-cover bg-center" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80')" }}>
          <div className="h-full w-full bg-black bg-opacity-30 flex items-center justify-center p-6">
            <h1 className="text-white text-3xl md:text-4xl font-bold text-center leading-snug">
              Write. Create. Share. <br /> All in One Place.
            </h1>
          </div>
        </div>

        {/* Right Signup Card */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <img
              src="https://www.kindpng.com/picc/m/368-3680049_word-processing-software-logo-hd-png-download.png"
              alt="Logo"
              className="w-16 h-16"
            />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
            Join Our Community
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Sign up quickly with Google and start your creative journey today.
          </p>

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

          <p className="text-center mt-8 text-gray-600">
            Already with us?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              Log in here
            </Link>
          </p>

          <p className="text-[10px] text-gray-400 text-center mt-6 leading-tight">
            Protected by reCAPTCHA and the{' '}
            <span className="underline">Google Privacy Policy</span> and{' '}
            <span className="underline">Terms of Service</span> apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
