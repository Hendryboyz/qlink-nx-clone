import React from 'react';
import { CheckIcon } from '@radix-ui/react-icons';

interface StepIndicatorProps {
  currentStep: number;
  steps: number[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  const componentColor = {
    active: "border-[#DF6B00] text-[#DF6B00]",
    inactive: "border-[#FFCFA3] text-[#FFCFA3]",
    progressActive: "bg-[#DF6B00]",
    progressInactive: "bg-[#FFCFA3]",
    bgActive: "bg-[#DF6B00]",
    bgInactive: "bg-[#FFF0D3]",
  };

  return (
    <div className="flex items-center">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`
            flex items-center justify-center
            w-6 h-6 rounded-full border-2 text-xs
            ${step < currentStep ? componentColor.bgActive : componentColor.bgInactive}
            ${step <= currentStep ? componentColor.active : `border ${componentColor.inactive}`}
            font-bold text-xl
          `}>
            {(step < currentStep) ? <CheckIcon className="text-white" /> : index + 1}
          </div>
          {step < steps.length && (
            <div className={`
              flex-grow h-1
              ${step < currentStep ? componentColor.progressActive : componentColor.progressInactive}
            `}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
