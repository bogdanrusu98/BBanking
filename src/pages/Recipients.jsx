

import { useEffect } from 'react'
import { initFlowbite } from 'flowbite';
import { useUser } from '../hooks/userContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CurrencyFlag from 'react-currency-flags';

function Recipients() {
    
    useEffect(() => {
        initFlowbite()
      }, [])
      
      const user = useUser()

      const [recipients, setRecipients] = useState([]); // definești state-ul pentru recipients
      const [searchTerm, setSearchTerm] = useState('');

 // Funcția pentru a obține inițialele
 const getInitials = (name) => {
    const nameParts = name.split(' ');
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase()) // extrage prima literă din fiecare cuvânt și o face mare
      .join('');
    return initials;
  };

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const q = query(collection(db, 'recipients'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedRecipients = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setRecipients(fetchedRecipients); // actualizezi state-ul recipients
      } catch (error) {
        console.error('Error fetching recipients:', error);
      }
    };

    fetchRecipients();
  }, [user.uid]); // asigură-te că user-ul este actualizat corect

  const filteredRecipients = recipients.filter((recipient) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      recipient.accountHolderName.toLowerCase().includes(searchLower) ||
      recipient.email?.toLowerCase().includes(searchLower) ||
      recipient.iban.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 rounded-lg ">
      <div className="mb-6">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Recipients</h1>

      <div className="flex items-center gap-2 mb-4">
        <input
        type="text"
        placeholder="Name, email, phone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1  dark:bg-gray-600 border border-gray-300 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <Link to="/recipients/add" className=" dark:bg-gray-400 px-4 py-2 bg-gray-200 logo-button rounded-full">
          Add recipient
        </Link>
      </div>

      <div className="space-y-2">


{filteredRecipients.length === 0 ? (
  <p className="text-gray-500 dark:text-white">No recipients found.</p>
) : (
  filteredRecipients.map((recipient, index) => (
    <Link
      to={`/recipients/${recipient.id}`}
      key={index}
      className="flex items-center dark:text-white  p-4 rounded-lg cursor-pointer hover:shadow-md transition"
    >
      <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-black font-bold relative ">
        {getInitials(recipient.accountHolderName)}<CurrencyFlag currency={recipient.currency} size="md" className="bottom-0 left-7 absolute rounded-full w-3.5 h-3.5" />
      </div>
      <div className="ml-4">
        <p className="font-semibold">{recipient.accountHolderName}</p>
        <p className="text-sm text-gray-500">
          {recipient.currency} account ending in {recipient.iban.slice(-4)}
        </p>
      </div>
      <div className="ml-auto text-gray-400">&gt;</div>

    </Link>
  ))
)}
      </div>
    </div>
    </div>
    </div>
  )
}

export default Recipients