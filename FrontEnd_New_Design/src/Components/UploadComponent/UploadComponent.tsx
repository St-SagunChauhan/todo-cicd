import { Divider, Modal } from "antd";
import React, { ReactNode, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  content: ReactNode;
  action: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const UploadComponent: React.FC<Props> = ({
  isOpen,
  onClose,
  content,
  action,
}) => {
  return (
    <>
      <Modal
        title="Upload Excel/CSV File"
        open={isOpen}
        onOk={(e) => action(e)}
        onCancel={onClose}
      >
        <div className="uploadfile shadow-none">{content}</div>
        <Divider />
      </Modal>
    </>
  );
};

export default UploadComponent;
