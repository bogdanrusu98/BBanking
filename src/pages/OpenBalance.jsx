import React, { useState } from 'react';
import { db } from '../firebase.config'; // Asigură-te că importi configurarea Firestore corectă
import { useUser } from '../hooks/userContext';
import { collection, addDoc } from 'firebase/firestore';
import IbanGenerator from '../components/IbanGenerator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CurrencyFlag from 'react-currency-flags';

function OpenBalance() {
  const [currency, setCurrency] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUser();
  const navigate = useNavigate()

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currency) {
      alert('Please select a currency.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generează un IBAN folosind funcția `generateIBAN`
      const newIban = IbanGenerator();

      // Adăugăm noul cont în colecția "accounts" din Firestore
      await addDoc(collection(db, 'accounts'), {
        userId: user.uid, // Asociază contul cu utilizatorul curent
        currency: currency,
        balance: 0, // Balance inițial pentru noul cont
        createdAt: new Date(), // Data la care a fost creat contul
        iban: newIban, // Adăugăm IBAN-ul generat
        name: user.firstName + ' ' + user.lastName
      });

      toast.success('Account created succesfully')
      navigate('/home')
      setCurrency('');
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:ml-64 flex justify-center ">
      <div className="max-w-md w-full bg-white p-6  dark:bg-gray-700 dark:text-gray-400 rounded-xl ">
        <h2 className="text-2xl font-semibold dark:text-white text-center mb-4">Open a balance</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="currency" className="block text-sm dark:text-gray-400 font-medium text-gray-700">Choose currency</label>
            <select
              id="currency"
              name="currency"
              value={currency}
              onChange={handleCurrencyChange}
              className="mt-2  dark:bg-gray-700 dark:text-gray-400 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Choose currency...</option>
              <option value="USD"><CurrencyFlag currency='USD' size="sm" className='rounded-xl' />USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="RON">RON - Romanian Leu</option>
              <option value="GBP">GBP - British Pound</option>
              {/* Adaugă alte valute disponibile */}
            </select>
            <p className="mt-1 text-sm text-gray-500">You can open balances in 40+ currencies.</p>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className={`px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OpenBalance;
