import React, { useState } from 'react';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../firebase.config'; // Asigură-te că importi configurarea Firebase corectă

function PasswordConfirmationModal({ isOpen, onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handlePasswordConfirm = async () => {
    if (!password) {
      setError('Please enter your password.');
      return;
    }
  
    setLoading(true);
  
    try {
      const user = auth.currentUser;
  
      if (!user) {
        setError('No user is currently signed in.');
        setLoading(false);
        return;
      }
  

      
      const credential = EmailAuthProvider.credential(user.email, password);
  
      // Reautentifică utilizatorul
      await reauthenticateWithCredential(user, credential);
  
      // Dacă autentificarea este reușită, apelează funcția `onSuccess`
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Reauthentication failed:', error);
      setError('Invalid password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white  dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <button onClick={onClose} className="float-right">
          X
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center">Enter your password</h2>
        <p className="text-sm text-gray-500 mb-4 text-center">
          To access your account details, please enter your password.
        </p>
        <label htmlFor="password" className="font-semibold mt-2 text-sm">
          Your password
        </label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Your password"
          className="w-full px-4  dark:bg-gray-800 py-2 border rounded-xl border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handlePasswordConfirm}
            className="logo-active-button w-full text-white px-6 py-2 rounded-xl hover:bg-green-600 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Done'}
          </button>
        </div>
        <div className="mt-4">
          <a href="/forgot-password" className="logo-color font-semibold hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}

export default PasswordConfirmationModal;
