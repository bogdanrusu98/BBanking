import React from 'react';
import { useUser } from '../hooks/userContext';

function ProfileCompletionBadge() {
    const user = useUser()
  // Dacă user este undefined, nu afișăm nimic sau afișăm un mesaj de încărcare
  if (!user) {
    return null; // sau <div>Loading...</div> dacă vrei să afișezi ceva în timpul încărcării
  }

  // Definim câmpurile necesare care trebuie să fie completate
  const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth', 'address', 'city', 'postalCode', 'country'];

  // Verificăm dacă există câmpuri necompletate (undefined, null, sau string gol)
  const incompleteFields = requiredFields.filter(
    (field) => user[field] == null || String(user[field]).trim() === ''
  );

  // Dacă există câmpuri incomplete, afișăm badge-ul
  const isProfileIncomplete = incompleteFields.length > 0;

  return (
    <div className="flex items-center space-x-2">
      {isProfileIncomplete && (
        <div id="alert-border-4" className="w-full flex items-center p-4 mb-4 text-yellow-800 border-t-4 border-yellow-300 bg-yellow-50 dark:text-yellow-300 dark:bg-gray-800 dark:border-yellow-800" role="alert">
        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <div className="ms-3 text-sm font-medium">
        Complete your profile to access all features

        </div>

    </div>
      )}
    </div>
  );
}

export default ProfileCompletionBadge;
