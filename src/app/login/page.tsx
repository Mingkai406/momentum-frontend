'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, signIn, confirmSignUp } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signIn(email, password);
      localStorage.setItem('userToken', JSON.stringify(result));
      localStorage.setItem('userEmail', email);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    try {
      await signUp(email, password);
      setNeedsConfirmation(true);
      setError('Check your email for verification code');
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await confirmSignUp(email, confirmationCode);
      setNeedsConfirmation(false);
      setIsSignUp(false);
      setError('Account confirmed! Please sign in.');
    } catch (err: any) {
      setError(err.message || 'Confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  if (needsConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Verify Your Email</h2>
          <p className="text-gray-600 mb-4 text-center">We sent a verification code to {email}</p>
          <input
            type="text"
            placeholder="Verification Code"
            className="w-full p-3 border rounded-lg mb-4"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
          />
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Confirming...' : 'Confirm Account'}
          </button>
          {error && <p className="mt-4 text-center text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Momentum</h1>
        <h2 className="text-xl text-gray-600 text-center mb-6">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          className="w-full p-3 border rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button
          onClick={isSignUp ? handleSignUp : handleSignIn}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mb-4 disabled:bg-gray-400"
        >
          {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>
        
        <p className="text-center text-gray-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="ml-2 text-blue-600 hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
        
        {error && <p className="mt-4 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}
