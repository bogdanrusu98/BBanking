import React, { useState } from 'react';
import { db } from '../firebase.config'; // Asigură-te că importi configurarea Firestore corectă
import { useUser } from '../hooks/userContext';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { query, where, getDocs } from 'firebase/firestore';

const AddRecipient = () => {
    const user = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      iban: '',
      bank: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const { name, email, iban, bank } = formData;
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
  
      try {
        // Verificăm dacă există deja un recipient cu același IBAN pentru utilizatorul curent
        const recipientRef = collection(db, 'recipients');
        const q = query(
          recipientRef,
          where('userId', '==', user.uid),
          where('iban', '==', iban)
        );
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          // Există deja un recipient cu acel IBAN pentru utilizatorul curent
          toast.error('Recipient with this IBAN already exists.');
          return;
        }
  
        // Dacă nu există, adăugăm recipientul
        await addDoc(recipientRef, {
          userId: user.uid, // Asociază contul cu utilizatorul curent
          createdAt: new Date(), // Data la care a fost creat contul
          iban: iban, // Adăugăm IBAN-ul generat
          bankName: bank,
          accountType: 'Private',
          accountHolderName: name, // Folosim name în loc de fullName
        });
  
        toast.success('Recipient added successfully');
        navigate('/recipients');
      } catch (error) {
        console.error('Error adding recipient:', error);
        alert('Failed to add recipient. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 dark:bg-gray-800 dark:text-gray-400 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Add a new recipient</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm  dark:bg-gray-800 dark:text-gray-400 font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1   dark:bg-gray-800 dark:text-gray-400 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="  dark:bg-gray-800 dark:text-gray-400 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1  dark:bg-gray-800 dark:text-gray-400 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="  dark:bg-gray-800 dark:text-gray-400 block text-sm font-medium text-gray-700">IBAN</label>
          <input
            type="text"
            name="iban"
            value={formData.iban}
            onChange={handleChange}
            className="mt-1  dark:bg-gray-800 dark:text-gray-400 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="  dark:bg-gray-800 dark:text-gray-400 block text-sm font-medium text-gray-700">Banca</label>
          <input
            type="text"
            name="bank"
            value={formData.bank}
            onChange={handleChange}
            className="mt-1  dark:bg-gray-800 dark:text-gray-400 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full logo-active-button py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Recipient
        </button>
      </form>
    </div>
  );
};

export default AddRecipient;