import * as React from 'react';
import { cn } from '../../utils';
import { ReactComponent as DefaultIcon } from './assets/default.svg';
import { ReactComponent as PressedIcon } from './assets/pressed.svg';

export interface RegisterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Custom class name for additional styling
   */
  className?: string;
}

export const RegisterButton = React.forwardRef<HTMLButtonElement, RegisterButtonProps>(
  ({ className, ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);

    return (
      <button
        ref={ref}
        className={cn('cursor-pointer transition-transform active:scale-95', className)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        {...props}
      >
        <div className="pointer-events-none">
          {isPressed ? <PressedIcon /> : <DefaultIcon />}
        </div>
      </button>
    );
  }
);

RegisterButton.displayName = 'RegisterButton';
