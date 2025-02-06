import React from "react";
import { useParams, Link } from "react-router-dom";


import { useEffect } from 'react'
import { initFlowbite } from 'flowbite';
import { useUser } from '../hooks/userContext';
import { doc, where, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useState } from 'react';

export default function RecipientsItem() {
    useEffect(() => {
        initFlowbite()
      }, [])
      
      const user = useUser()
      const [recipient, setRecipient] = useState(null);
      const { recipientId } = useParams(); // preia id-ul din URL


 // Funcția pentru a obține inițialele
 const getInitials = (name) => {
    const nameParts = name.split(' ');
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase()) // extrage prima literă din fiecare cuvânt și o face mare
      .join('');
    return initials;
  };

  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        // Creează referința către documentul specific al contului
        const docRef = doc(db, 'recipients', recipientId);
        const docSnap = await getDoc(docRef);

        // Verifică dacă documentul există și setează datele în `account`
        if (docSnap.exists()) {
          const fetchedRecipient = {
            id: docSnap.id,
            ...docSnap.data(),
          };
          setRecipient(fetchedRecipient);
        } else {
          console.error('No account found with the specified ID.');
        }
      } catch (error) {
        console.error('Error fetching account:', error);
      } finally {

    }
    };

    if (recipientId) {
      fetchRecipient();
    }
  }, [recipientId]);

  console.log('id is ' + {recipientId})

  return (
    <div className="max-w-4xl mx-auto p-6">
      {recipient ? (
                <div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full text-xl font-bold">
                  {getInitials(recipient.accountHolderName)}
      
                  </div>
                </div>
          
            <h1 className="text-3xl font-semibold my-3 ">{recipient.accountHolderName}</h1>
  
          <div className="flex space-x-4 my-4">
            <Link to="/balances/send-money">
              <button className="text-sm px-5 py-2.5 text-center me-2 mb-2 bg-gray-200 logo-active-button rounded-full">
                Send
              </button>
            </Link>
            <button className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
              Delete
            </button>
          </div>
  
          <hr className="my-4" />
          <h2 className="text-xl font-semibold mb-2">Account details</h2>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Account holder name</p>
              <p>{recipient.accountHolderName}</p>
            </div>
  
            <div>
              <p className="text-gray-500">Nickname</p>
              <Link to="#" className="text-green-600 underline">
                Add nickname
              </Link>
            </div>
  
            <div>
              <p className="text-gray-500">Account type</p>
              <p>{recipient.accountType}</p>
            </div>
  
            <div>
              <p className="text-gray-500">Bank code (BIC/SWIFT)</p>
              <p>{recipient.bankCode}</p>
            </div>
  
            <div>
              <p className="text-gray-500">IBAN</p>
              <p>{recipient.iban}</p>
            </div>
  
            <div>
              <p className="text-gray-500">Email (Optional)</p>
              <p>{recipient.email ?? '-'}</p>
            </div>
  
            <div>
              <p className="text-gray-500">Bank name</p>
              <p>{recipient.bankName ?? '-'}</p>
            </div>
  
            <div>
              <p className="text-gray-500">Address</p>
              <p>{recipient.address ?? '-'}</p>
            </div>
          </div>
        </div>
      ) : '' }
    </div>
  );}