import { useRouter } from 'next/navigation';

import {
  Modal,
  ModalHeader,
  ModalFooter,
  TGButton,
  ModalDescription,
} from '@org/components';

const SuccessModal = () => {
  const router = useRouter();

  return (
    <Modal isOpen>
      <ModalHeader>Password Reset Successful</ModalHeader>
      <ModalDescription>
        Please re-enter your new password to log in
      </ModalDescription>
      <ModalFooter>
        <TGButton size="lg" variant="primary" onClick={() => router.push('/sign-in')}>
          OK
        </TGButton>
      </ModalFooter>
    </Modal>
  );
};

export default SuccessModal;
