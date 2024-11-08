import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";

const PrivacyPolicyModal = forwardRef(({}, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  return (
    <Modal
      title="Privacy Policy"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}l
    >
      <div className="mt-4 p-2" style={{ fontFamily: 'Arial, sans-serif', textAlign: 'justify' }}>
        
      </div>
    </Modal>
  );
});

export default PrivacyPolicyModal;
