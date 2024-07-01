'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import PocketBase from 'pocketbase';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { createGlobalStyle } from 'styled-components';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

  h1, h2, h3 {
    font-family: 'Roboto', sans-serif;
  }
`;

export default function SignInPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [passwordResetSent, setPasswordResetSent] = useState<boolean>(false);
  const router = useRouter();

  const handleForgotPasswordSwitch = () => {
    setForgotPassword(!forgotPassword);
    setEmail('');
    setPassword('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (forgotPassword) {
        await pb.collection('users').requestPasswordReset(email);
        setPasswordResetSent(true);
      } else {
        await pb.collection('users').authWithPassword(email, password);
        router.push('/dashboard');
      }
    } catch (error: any) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <GlobalStyle />
      <header>
        <h1>AI Inspiration Tool</h1>
      </header>
      <main className="auth-container">
        <div className="form-container">
          <h2>{forgotPassword ? 'Reset your password' : 'Log in to your account'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {!forgotPassword && (
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            )}
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : forgotPassword ? 'Send reset link' : 'Login'}
            </button>
            {error && <p className="error">{error}</p>}
            {passwordResetSent && <p>Password reset email sent!</p>}
          </form>
          <p>
            {forgotPassword ? (
              <>
                Remember your password? <span onClick={handleForgotPasswordSwitch}>Login</span>
              </>
            ) : (
              <>
                Don&apos;t have an account? <span onClick={() => router.push('/signup')}>Sign Up</span>
              </>
            )}
          </p>
          {!forgotPassword && (
            <p>
              Forgot your password? <span onClick={handleForgotPasswordSwitch}>Reset Password</span>
            </p>
          )}

          {/* New section for login options */}
          <div className="social-login-container">
            <p>or</p>
            <div className="social-login-buttons">
              <a href="https://accounts.google.com/signin" target="_blank" rel="noopener noreferrer" className="social-login-button">
                <img src="/images/google-48.png" alt="Login with Google" width={24} height={24}/>
                Login with Google
              </a>
              <a href="https://login.microsoftonline.com/" target="_blank" rel="noopener noreferrer" className="social-login-button">
                <img src="/images/microsoft-48.png" alt="Login with Microsoft" width={24} height={24} />
                Login with Microsoft
              </a>
              <a href="https://appleid.apple.com/" target="_blank" rel="noopener noreferrer" className="social-login-button">
                <img src="/images/apple-48.png" alt="Login with Apple" width={24} height={24}/>
                Login with Apple
              </a>
            </div>
          </div>
        </div>
      </main>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f7f7f7;
        }
        header {
          position: absolute;
          top: 0;
          width: 100%;
          background-color: white;
          border-bottom: 1px solid #ddd;
          padding: 10px 0;
          text-align: center;
        }
        header h1 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }
        .auth-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 350px; 
          padding: 20px;
          margin-top: 60px; 
        }
        .form-container {
          width: 100%;
          min-height: 500px; 
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center; 
        }
        .form-container h2 {
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center; 
        }
        .form-container form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%; 
        }
        .form-container input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: calc(100% - 22px); 
        }
        .form-container .password-input {
          position: relative;
          width: 91.3%; 
        }
        .form-container .password-input input {
          padding-right: 40px; 
        }
        .form-container .password-toggle {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
        }
        .form-container button[type="submit"] {
          padding: 10px;
          border: none;
          border-radius: 4px;
          background-color: black;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%; 
        }
        .form-container button[type="submit"]:hover {
          background-color: white;
          color: black;
          border: 1px solid black;
        }
        .form-container .error {
          color: red;
          margin-top: 10px;
        }
        .form-container p {
          margin-top: 10px;
          font-size: 14px;
          text-align: center; 
        }
        .form-container p span {
          color: blue;
          cursor: pointer;
          text-decoration: underline;
        }
        .social-login-container {
          margin-top: 20px;
          width: 100%;
        }
        .social-login-container p {
          text-align: center;
          margin-bottom: 10px;
        }
        .social-login-buttons {
          display: flex;
          flex-direction: column; 
          gap: 10px;
        }
        .social-login-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: #f7f7f7;
          color: black;
          text-decoration: none;
          font-size: 14px;
          transition: background-color 0.3s, border-color 0.3s;
        }
        .social-login-button:hover {
          background-color: #f7f7f7;
          color: black;
          border-color: black;
        }
        .social-login-button img {
          width: 24px; 
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
}
