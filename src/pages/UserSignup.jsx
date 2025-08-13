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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-300 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden max-w-5xl w-full">
        
        {/* Left Side Image */}
        <div className="md:w-1/2 w-full bg-cover bg-center" 
             style={{
               backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80')`
             }}>
          <div className="bg-black/40 h-full w-full flex items-center justify-center p-8">
            <h1 className="text-white text-3xl font-bold text-center">
              Your Ideas, Our Platform
            </h1>
          </div>
        </div>

        {/* Right Side Signup */}
        <div className="md:w-1/2 w-full p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-3 text-center">
            Join Our Community
          </h2>
          <p className="text-gray-500 mb-8 text-center">
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
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
