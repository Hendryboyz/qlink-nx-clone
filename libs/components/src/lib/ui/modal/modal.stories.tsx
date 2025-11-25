import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalIcon,
} from './modal';
import { AlertTriangle } from 'lucide-react';
import { TGButton } from '../../tailgrids/button';

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: 'Shadcn/Modal',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const DeleteProduct: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <TGButton size="md" variant="ghost" onClick={() => setIsOpen(true)}>
          Open Delete Product Modal
        </TGButton>
        <Modal {...args} isOpen={isOpen}>
          <ModalHeader>
            <ModalIcon>
              <AlertTriangle className="size-5" />
            </ModalIcon>
            <ModalTitle>Delete product?</ModalTitle>
          </ModalHeader>
          <ModalDescription>
            Once you delete your product, your data will be deleted and cannot
            be restored.
          </ModalDescription>
          <ModalFooter>
            <TGButton
              size="md"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Continue deleting product
            </TGButton>
            <TGButton size="md" onClick={() => setIsOpen(false)}>
              Cancel
            </TGButton>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

export const CancelRegistration: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <TGButton size="md" variant="ghost" onClick={() => setIsOpen(true)}>
          Open Cancel Registration Modal
        </TGButton>
        <Modal {...args} isOpen={isOpen}>
          <ModalHeader>
            <ModalTitle className="mt-4">Cancel registration?</ModalTitle>
          </ModalHeader>
          <ModalDescription>
            Your registered data will not be restored once you leave this page
          </ModalDescription>
          <ModalFooter>
            <TGButton size="md" onClick={() => setIsOpen(false)}>
              Still cancel register
            </TGButton>
            <TGButton
              size="md"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </TGButton>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};
