import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  steps: number[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`
            flex items-center justify-center
            w-12 h-12 rounded-sm
            ${index + 1 <= currentStep ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-300'}
            font-[GilroyMedium] text-[15px] leading-none
          `}>
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className="flex-grow h-px bg-gray-300 mx-2"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;