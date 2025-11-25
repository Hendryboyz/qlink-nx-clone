import type { Meta, StoryObj } from '@storybook/react';
import { TGToast, TGToastContainer } from './toast';
import { TGButton } from '../button/button';
import { useState, useEffect } from 'react';

const meta: Meta<typeof TGToast> = {
  title: 'TailGrids/Toast',
  component: TGToast,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TGToast>;

export const Success: Story = {
  args: {
    type: 'success',
    message: 'Operation completed successfully!',
  },
};

export const Failed: Story = {
  args: {
    type: 'failed',
    message: 'Operation failed. Please try again later.',
  },
};

export const Interactive: Story = {
  render: () => {
    const [show, setShow] = useState(false);
    return (
      <div>
        <div className="mb-4">
          <TGButton onClick={() => setShow(true)}>Show Toast</TGButton>
        </div>
        <TGToastContainer>
          {show && (
            <TGToast
              type="success"
              message="Operation completed successfully"
              onClose={() => setShow(false)}
              autoClose={false}
            />
          )}
        </TGToastContainer>
      </div>
    );
  },
};

export const AutoClose: Story = {
  render: () => {
    const [show, setShow] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
      if (show && countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      }
      if (countdown === 0) {
        setShow(false);
        setCountdown(5);
      }
    }, [show, countdown]);

    const handleShow = () => {
      setShow(true);
      setCountdown(5);
    };

    return (
      <div>
        <TGButton onClick={handleShow}>Show Auto-close Toast (5s)</TGButton>
        <TGToastContainer>
          {show && (
            <TGToast
              type="success"
              message={`This message will close in ${countdown} seconds`}
              onClose={() => setShow(false)}
            />
          )}
        </TGToastContainer>
      </div>
    );
  },
};

export const MultipleToasts: Story = {
  render: () => {
    const [toasts, setToasts] = useState<string[]>([]);

    const messages = {
      success: 'Operation successful!',
      failed: 'An error occurred!',
    };

    const handleAddToast = (type: keyof typeof messages) => {
      setToasts([...toasts, type]);
    };

    return (
      <div>
        <div className="flex gap-2 mb-4">
          <TGButton onClick={() => handleAddToast('success')}>
            Success
          </TGButton>
          <TGButton onClick={() => handleAddToast('failed')}>
            Failed
          </TGButton>
        </div>
        <TGToastContainer>
          {toasts.map((type, index) => (
            <TGToast
              key={index}
              type={type as 'success' | 'failed'}
              message={messages[type as keyof typeof messages]}
              onClose={() => setToasts(toasts.filter((_, i) => i !== index))}
            />
          ))}
        </TGToastContainer>
      </div>
    );
  },
};

export const Positions: Story = {
  render: () => {
    const [position, setPosition] = useState<
      'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
    >('top-right');

    return (
      <div>
        <div className="flex gap-2 mb-4 flex-wrap">
          <TGButton onClick={() => setPosition('top-right')}>Top Right</TGButton>
          <TGButton onClick={() => setPosition('top-left')}>Top Left</TGButton>
          <TGButton onClick={() => setPosition('top-center')}>Top Center</TGButton>
          <TGButton onClick={() => setPosition('bottom-right')}>Bottom Right</TGButton>
          <TGButton onClick={() => setPosition('bottom-left')}>Bottom Left</TGButton>
          <TGButton onClick={() => setPosition('bottom-center')}>Bottom Center</TGButton>
        </div>
        <TGToastContainer position={position}>
          <TGToast
            type="success"
            message={`Position: ${position}`}
            autoClose={false}
          />
        </TGToastContainer>
      </div>
    );
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <TGToast type="success" message="Operation completed successfully" />
      <TGToast type="failed" message="An error occurred, please try again later" />
    </div>
  ),
};
