import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/userContext';

function TrainingGuard({ children }) {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Verifică dacă utilizatorul este autentificat și dacă a terminat training-ul
    if (user && !user.hasCompletedTraining) {
      // Dacă nu a terminat training-ul, redirecționează către pagina de training
      navigate('/training');
    }
  }, [user, navigate]);

  // Dacă utilizatorul a terminat training-ul sau dacă nu este autentificat, permite accesul la pagină
  return user && user.hasCompletedTraining ? children : null;
}

export default TrainingGuard;
