import { Modal as AntModal, ModalProps as AntModalProps } from 'antd';
import { ReactNode } from 'react';

export interface ModalProps extends AntModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '',
  ...props 
}: ModalProps) => {
  return (
    <AntModal
      open={isOpen}
      onCancel={onClose}
      title={title}
      footer={null}
      className={className}
      centered
      {...props}
    >
      {children}
    </AntModal>
  );
};
