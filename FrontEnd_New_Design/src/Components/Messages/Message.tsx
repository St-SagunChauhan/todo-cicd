import React from "react";
import { message } from "antd";

const Message = () => {
  const [messageApi, contextHolder] = message.useMessage();
  return <>{contextHolder}</>;
};

export default Message;
