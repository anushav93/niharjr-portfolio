import { useState } from 'react';
import Modal from './Modal';
import ContactForm from './ContactForm';
import SparkleButton from './SparkleButton';

interface ContactModalProps {
  buttonVariant?: "default" | "sideBySide" | "outline";
  buttonPosition?: "left" | "right" | "standalone";
  className?: string;
}

export default function ContactModal({ 
  buttonVariant = "outline", 
  buttonPosition = "standalone",
  className = ""
}: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <SparkleButton 
        href="#" 
        variant={buttonVariant}
        position={buttonPosition}
        className={className}
        onClick={(e) => {
          e.preventDefault();
          openModal();
        }}
      >
        Contact me
      </SparkleButton>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ContactForm onClose={closeModal} />
      </Modal>
    </>
  );
} 