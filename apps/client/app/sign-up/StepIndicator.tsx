import React from 'react';
import { CheckIcon } from '@radix-ui/react-icons';

interface StepIndicatorProps {
  currentStep: number;
  steps: number[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  const componentColor = {
    active: "#DF6B00",
    inactive: "#FFCFA3",
  };
  const backgroundColor= {
    active: "#DF6B00",
    inactive: "#FFF0D3",
  };
  return (
    <div className="flex items-center">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`
            flex items-center justify-center
            w-7 h-7 rounded-full border-2 text-xs
            ${step < currentStep ? `bg-[${backgroundColor.active}]` : `bg-[${backgroundColor.inactive}]`}
            ${step <= currentStep ? `border-[${componentColor.active}] text-[${componentColor.active}]` : `text-[${componentColor.inactive}] border border-[${componentColor.inactive}]`}
            font-bold text-xl
          `}>
            {(step < currentStep) ? <CheckIcon className="text-white" /> : index + 1}
          </div>
          {step < steps.length && (
            <div className={`
              flex-grow h-1
              ${step < currentStep ? `bg-[${componentColor.active}]` : `bg-[${componentColor.inactive}]`}
            `}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
