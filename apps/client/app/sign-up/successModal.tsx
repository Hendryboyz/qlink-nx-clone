import { FC } from 'react';

import {
  Modal,
  ModalDescription,
  ModalFooter,
  TGButton,
} from '@org/components';

const SuccessModal: FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <Modal isOpen>
      <ModalDescription>Account create successful</ModalDescription>
      <ModalFooter>
        <TGButton size="lg" variant="primary" onClick={() => onClose()}>
          Let’s Ride
        </TGButton>
      </ModalFooter>
    </Modal>
  );
};

export default SuccessModal;
