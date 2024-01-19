import React from "react";
import { Button, Result } from "antd";
import { PATH_NAME } from "../../Config";

const Error404: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Button href={PATH_NAME.ROOT} type="primary">
        Back Home
      </Button>
    }
  />
);

export default Error404;
