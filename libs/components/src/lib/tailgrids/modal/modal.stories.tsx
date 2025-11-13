import type { Meta, StoryObj } from '@storybook/react';
import { TGModal } from './modal';
import { TGButton } from '../button/button';
import { useState } from 'react';

const meta: Meta<typeof TGModal> = {
  title: 'TailGrids/Modal',
  component: TGModal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TGModal>;

export const Warning: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <TGButton onClick={() => setOpen(true)}>Open Warning Modal</TGButton>
        <TGModal
          open={open}
          onClose={() => setOpen(false)}
          title="Are you sure you want to delete?"
          description="This action cannot be undone. Please confirm to continue."
          onConfirm={() => console.log('Confirmed')}
          type="warning"
        />
      </div>
    );
  },
};

export const Danger: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <TGButton onClick={() => setOpen(true)}>
          Open Danger Modal
        </TGButton>
        <TGModal
          open={open}
          onClose={() => setOpen(false)}
          title="Delete Account"
          description="This will permanently delete your account and all data. This action cannot be undone."
          confirmText="Delete"
          cancelText="Keep"
          type="danger"
          onConfirm={() => console.log('Account deleted')}
        />
      </div>
    );
  },
};

export const Info: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <TGButton onClick={() => setOpen(true)}>
          Open Info Modal
        </TGButton>
        <TGModal
          open={open}
          onClose={() => setOpen(false)}
          title="Update Available"
          description="A new version is available. Update now for the best experience."
          confirmText="Update Now"
          cancelText="Remind Later"
          type="info"
        />
      </div>
    );
  },
};

export const Success: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <TGButton onClick={() => setOpen(true)}>
          Open Success Modal
        </TGButton>
        <TGModal
          open={open}
          onClose={() => setOpen(false)}
          title="Operation Successful"
          description="Your data has been saved successfully."
          confirmText="OK"
          cancelText="Close"
          type="success"
        />
      </div>
    );
  },
};

export const CustomContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <TGButton onClick={() => setOpen(true)}>Custom Content</TGButton>
        <TGModal
          open={open}
          onClose={() => setOpen(false)}
          title="Subscription Terms"
          confirmText="Agree and Subscribe"
          cancelText="Cancel"
        >
          <p>After subscribing, your account will be charged:</p>
          <ul>
            <li>$29.99 per month</li>
            <li>Cancel anytime</li>
            <li>Access to all premium features</li>
          </ul>
        </TGModal>
      </div>
    );
  },
};

export const NoCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <TGButton onClick={() => setOpen(true)}>No Close Button</TGButton>
        <TGModal
          open={open}
          onClose={() => setOpen(false)}
          title="Please Confirm Operation"
          description="You must select confirm or cancel to close."
          showCloseButton={false}
        />
      </div>
    );
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <TGModal
        open={true}
        onClose={() => {}}
        title="Warning Message"
        description="This is a warning message example."
        type="warning"
      />
      <TGModal
        open={true}
        onClose={() => {}}
        title="Danger Operation"
        description="This is a danger operation example."
        type="danger"
      />
      <TGModal
        open={true}
        onClose={() => {}}
        title="Information"
        description="This is an information example."
        type="info"
      />
      <TGModal
        open={true}
        onClose={() => {}}
        title="Success Message"
        description="This is a success message example."
        type="success"
      />
    </div>
  ),
};
