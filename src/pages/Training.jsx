import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useUser } from '../hooks/userContext';
import { db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';
import sendNotification from '../hooks/sendNotification';
function Training() {
  const user = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      markTrainingAsComplete();
    }
  };

  const markTrainingAsComplete = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { hasCompletedTraining: true });
      sendNotification({
        userId: user.uid,
        message: `Congratulations! You have completed training session!`,
        href: `/`,
        isRead: 'false',
        senderId: 'BOT'
      });
      navigate('/'); // Redirecționează către pagina Home după finalizare
    } catch (error) {
      console.error('Error marking training as complete:', error);
    }
  };

  return (
    <div className="p-6 sm:ml-64">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">Welcome to Your Banking App Training</h1>
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step 1: Overview of Features</h2>
            <p className="text-gray-700 mb-4">
              In this app, you can manage your bank accounts, check your balance, view transaction history, and perform transfers between accounts.
            </p>
            <p className="text-gray-700 mb-4">
              Make sure to explore the dashboard for a quick overview of your financial status.
            </p>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step 2: Security Best Practices</h2>
            <p className="text-gray-700 mb-4">
              Keep your account secure by using a strong password and enabling two-factor authentication.
            </p>
            <p className="text-gray-700 mb-4">
              Avoid sharing your password with others and always verify the authenticity of any emails or messages you receive from us.
            </p>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step 3: Performing Transfers</h2>
            <p className="text-gray-700 mb-4">
              To perform a transfer, navigate to the "Transfers" section, enter the recipient's account details, and specify the amount.
            </p>
            <p className="text-gray-700 mb-4">
              Ensure that the details are correct before confirming the transfer to avoid any issues.
            </p>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-xl ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={currentStep === 1}
          >
            Previous
          </button>
          <button
            onClick={handleNextStep}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl"
          >
            {currentStep < totalSteps ? 'Next' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Training;
