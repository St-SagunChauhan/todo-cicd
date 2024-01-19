import React, { useState, startTransition, useEffect } from "react";
import {
  Avatar,
  Button,
  Menu,
  Row,
  type MenuProps,
  Col,
  Divider,
  Dropdown,
} from "antd";
import { BellOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { userProfileSeletore } from "../../Selectors/userSelector";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { logout } from "../../Action/AuthAction";
import { useNavigate } from "react-router-dom";
import { PATH_NAME } from "../../Config";
import authService from "../../services/authServices";

const TopBar: React.FC = () => {
  const profilePicture = useSelector(userProfileSeletore);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState("");

  const handleLogout = () => {
    dispatch<any>(logout());
    startTransition(() => {
      navigate(PATH_NAME.LOGIN);
    });
  };

  useEffect(() => {
    setProfile(profilePicture.profilePicture);
  }, [profilePicture]);

  const profileItem: MenuProps["items"] = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: (e) => {
        startTransition(() => navigate(PATH_NAME.PROFILE));
      },
    },
    {
      key: "2",
      icon: <LogoutOutlined />,
      danger: true,
      label: "Log Out",
      onClick: handleLogout,
    },
  ];

  const notifications: MenuProps["items"] = [
    {
      key: "1",
      label: "Demo",
    },
  ];

  
 

  return (
    <>
      <Row className="user-login">
        <Col style={{ display: "flex", alignItems: "center" }}>
          <Dropdown menu={{ items: notifications }} trigger={["click"]}>
            <Button
              type="text"
              style={{ height: 30, width: 30, translate: "0px 0px" }}
              shape="circle"
            >
              <BellOutlined
                style={{
                  color: "#000",
                  height: "50px",
                  width: "50px",
                  translate: "-8px 6px",
                }}
              />
            </Button>
          </Dropdown>
          <Divider
            type="vertical"
            style={{ backgroundColor: "#000", margin: "0px 10px" }}
          />
        </Col>

        <Col>
          <Dropdown menu={{ items: profileItem }} trigger={["click"]}>
            <Button
              style={{ height: 40, width: 40, marginRight: "5px" }}
              type="primary"
              shape="circle"
            >
              <Avatar
                style={{ translate: "0px 0px", lineHeight: "38px"}}
                size={40}
                src={
                  profile ? (
                    `data:image/png;base64,${profile}`
                  ) : (
                    <UserOutlined style={{ translate: "2px 0px" }} />
                  )
                }
              />
            </Button>
          </Dropdown>
        </Col>
      </Row>
    </>
  );
};

export default TopBar;
