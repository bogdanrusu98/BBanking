import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import PacmanLoader from "react-spinners/PacmanLoader";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Obține referința documentului utilizatorului din Firestore
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            // Adaugă datele din Firestore la obiectul `currentUser`
            setUser({ ...currentUser, ...userDocSnap.data() });
          } else {
            console.log('No such user document!');
            setUser(currentUser); // Setează doar datele din Authentication dacă nu există un document în Firestore
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="sweet-loading h-screen w-full flex flex-col items-center justify-center bg-transparent">
        <PacmanLoader
          color="#22c55e" // Verde Tailwind
          loading={loading}
          size={50} // Dimensiune mai realistă
          cssOverride={{ display: 'block', margin: '0 auto' }}
          aria-label="Loading Spinner"
        />
        
        {/* Opțional: Text de loading */}
        <p className="mt-4 text-green-500 font-medium">Loading...</p>
        
       
      </div>
    );
  }

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
