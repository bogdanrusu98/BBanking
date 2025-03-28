import React from "react";
import { useParams, Link } from "react-router-dom";
import { deleteDoc } from 'firebase/firestore'; 
import { useEffect } from 'react'
import { initFlowbite } from 'flowbite';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RecipientsItem() {
  const navigate = useNavigate()
    useEffect(() => {
        initFlowbite()
      }, [])
      
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

  const handleDelete = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this recipient?');
    if (!isConfirmed) return;
  
    try {
      if (!recipientId) {
        console.error('No recipient ID provided.');
        return;
      }
  
      const docRef = doc(db, 'recipients', recipientId);
      await deleteDoc(docRef);
  
      toast.success('Recipient deleted successfully!');
      navigate('/recipients');
    } catch (error) {
      console.error('Error deleting recipient:', error);
      toast.error('Failed to delete recipient. Please try again.');
    }
  };

  return (
    <div className="sm:ml-64">
    <div className="p-4 rounded-xl ">
    <div className="mb-6  dark:bg-gray-800 dark:text-gray-400">
      {recipient ? (
                <div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 flex items-center  justify-center bg-gray-200 rounded-full text-xl font-bold">
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
            <button
            onClick={handleDelete}
            className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
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
    </div>
    </div>
  );}