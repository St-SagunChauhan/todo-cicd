import React, { FC, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { isLoadingSelector } from "../Selectors/appSelector";
import { useSelector } from "react-redux";

const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

interface Props {
  isLoading: boolean;
}

const Loading: FC<Props> = (props: Props) => {
  const { isLoading } = props;
  return (
    <>
      {isLoading ? (
        <div className="Loader">
          <Spin indicator={antIcon} />
        </div>
      ) : null}
    </>
  );
};

export default Loading;
