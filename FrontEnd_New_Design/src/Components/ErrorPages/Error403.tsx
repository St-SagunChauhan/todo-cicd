import React from "react";
import { Button, Result } from "antd";
import { PATH_NAME } from "../../Config";

const Error403: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button href={PATH_NAME.ROOT} type="primary">
        Back Home
      </Button>
    }
  />
);

export default Error403;
