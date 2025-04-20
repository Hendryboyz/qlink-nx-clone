import React, { ButtonHTMLAttributes } from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';

type ButtonColor = 'red' | 'beige';

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLDivElement> {
  text: string;
  buttonColor?: ButtonColor;
  isLoading?: boolean;
}


const SubmitButton: React.FC<SubmitButtonProps> = ({text, isLoading, buttonColor = 'red', ...props }) => {

  let iconColor = '#D70127';
  let arrowColor = 'white';

  if (buttonColor === 'beige') {
    arrowColor = '#D70127';
    iconColor = '#FFF0D3';
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
      <div className={`mr-5 text-xl text-[${iconColor}]`}>{text}</div>
      <div className={`rounded-full p-2 bg-[${iconColor}]`}>
        {isLoading ? (
          <div className="w-8 h-8 border-4 border-primary border-t-white rounded-full animate-spin"></div>
        ) : (
          <div className={`rounded-full text-[${arrowColor}]`}>
            <ArrowRightIcon width={30} height={30} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitButton;
