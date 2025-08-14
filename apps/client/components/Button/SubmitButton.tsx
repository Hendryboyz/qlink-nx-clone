import React, { ButtonHTMLAttributes } from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';

type ButtonColor = 'red' | 'beige';

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLDivElement> {
  text: string;
  buttonColor?: ButtonColor;
  isLoading?: boolean;
}


const SubmitButton: React.FC<SubmitButtonProps> = ({text, isLoading, buttonColor = 'red', ...props }) => {

  let iconColor = {
    text: 'text-[#D70127]',
    bg: 'bg-[#D70127]',
  };
  let arrowColor = 'text-white';

  if (buttonColor === 'beige') {
    arrowColor = 'text-[#D70127]';
    iconColor = {
      text: 'text-[#FFF0D3]',
      bg: 'bg-[#FFF0D3]',
    };
  }

  return (
    <div
      onClick={props.onClick}
      className={`
     flex justify-end items-center
     ${props.className ?? ''}
     ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
    `}
    >
      <div className={`mr-2 text-xl ${iconColor.text} flex items-center`}>{text}</div>
      <div className={`rounded-full p-2 ${iconColor.bg}`}>
        {isLoading ? (
          <div className="w-8 h-8 border-4 border-primary border-t-white rounded-full animate-spin"></div>
        ) : (
          <div className={`rounded-full ${arrowColor}`}>
            <ArrowRightIcon width={24} height={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitButton;
