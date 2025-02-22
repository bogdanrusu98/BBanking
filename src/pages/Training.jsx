import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useUser } from '../hooks/userContext';
import { db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';
import sendNotification from '../hooks/sendNotification';
import { trainingSteps } from '../hooks/trainingData'; // Importă datele de training

function Training() {
  const user = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = trainingSteps.length;

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
        message: `Congratulations! You have completed the training session!`,
        href: `/`,
        isRead: 'false',
        senderId: 'BOT',
      });
      navigate('/'); // Redirecționează către pagina Home după finalizare
    } catch (error) {
      console.error('Error marking training as complete:', error);
    }
  };

  const currentStepData = trainingSteps.find((step) => step.step === currentStep);

  return (
    <div className="p-6 sm:ml-64">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">Welcome to Your Banking App Training</h1>

        {/* Indicator de progres */}
        <div className="flex justify-center mb-6">
          {trainingSteps.map((step) => (
            <div
              key={step.step}
              className={`w-4 h-4 mx-1 rounded-full ${
                currentStep >= step.step ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Conținutul pasului curent */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">{currentStepData.title}</h2>
          <img
            src={currentStepData.image}
            alt={`Step ${currentStep}`}
            className="mx-auto mb-4 rounded-lg"
          />
          {currentStepData.content.map((paragraph, index) => (
            <p key={index} className="text-gray-700 mb-4">
              {paragraph}
            </p>
          ))}
          {currentStepData.tips && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">💡 Tips:</h3>
              <ul className="text-left list-disc list-inside">
                {currentStepData.tips.map((tip, index) => (
                  <li key={index} className="text-gray-700 mb-2">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Butoane de navigare */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-xl ${
              currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
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