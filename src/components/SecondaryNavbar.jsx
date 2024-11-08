import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa'; // Asigură-te că ai instalat react-icons
import { FaPiggyBank } from "react-icons/fa6";

function HeaderWithCloseButton() {
  const navigate = useNavigate();

  const handleClose = () => {
    // Logica de închidere sau navigare
    navigate('/'); // De exemplu, navighează înapoi la pagina principală
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center">

          <FaPiggyBank className="h-6 w-auto logo" /> &nbsp;

        <span className="text-xl font-bold text-green-900">BBANKING</span>
      </div>
      {/* Butonul de închidere */}
      <button
        onClick={handleClose}
        className="text-green-900 hover:text-green-700 focus:outline-none"
        aria-label="Close"
      >
        <FaTimes className="h-5 w-5" />
      </button>
    </div>
  );
}

export default HeaderWithCloseButton;
