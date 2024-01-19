import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";
import { PATH_NAME } from "../../Config";

const BreadCrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const toUrls = [];

  const getPaths = pathnames.map((value: any, index: number) => {
    const rawTitle = value.replaceAll("-", " ");
    const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
    const to = "/" + pathnames.slice(0, index + 1).join("/");
    return {
      href: to,
      title: title,
    };
  });

  const Paths = [
    { href: PATH_NAME.ROOT, title: <HomeOutlined /> },
    ...getPaths,
  ];
  return (
    <div style={{ padding: "5px", margin: "5px" }}>
      <Breadcrumb items={Paths} />
    </div>
  );
};

export default BreadCrumb;
