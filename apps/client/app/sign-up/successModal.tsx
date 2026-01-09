import { FC } from 'react';

import {
  Modal,
  ModalHeader,
  ModalFooter,
  TGButton,
} from '@org/components';

const SuccessModal: FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <Modal isOpen>
      <ModalHeader>Account create successful</ModalHeader>
      <ModalFooter>
        <TGButton size="lg" variant="primary" onClick={() => onClose()}>
          Let’s Ride
        </TGButton>
      </ModalFooter>
    </Modal>
  );
};

export default SuccessModal;
