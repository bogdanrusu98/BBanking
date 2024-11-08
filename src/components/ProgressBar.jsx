import React from 'react';

function ProgressBar({ currentStep }) {
  const steps = ['Account', 'Recipient', 'Amount', 'Review', 'Pay'];

  return (
    <div className="w-full border-b border-gray-400 flex justify-between mb-6">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`text-center flex-1 pb-2 ${
            index === currentStep ? 'font-bold text-black' : 'text-gray-500'
          }`}
        >
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
}

export default ProgressBar;
