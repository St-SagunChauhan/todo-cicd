import React, { useEffect, useState } from "react";
import backDrop from "../../assets/images/bg-profile.jpg";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  List,
  Radio,
  Row,
  Tabs,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  userProfileSeletore,
  isLoadingSelector,
} from "../../Selectors/userSelector";
import { UserOutlined } from "@ant-design/icons";
import { userSelector } from "../../Selectors/authSelector";
import TabPane from "antd/es/tabs/TabPane";
import authService from "../../services/authServices";

const Profile = () => {
  const profilePicture = useSelector(userProfileSeletore);
  const user = authService.getUser();
  const loggedInUser = JSON.parse(user);
  const isLoading = useSelector(isLoadingSelector);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState("");
  const [changeTab, setChangeTab] = useState();

  // console.log(isLoading);

  useEffect(() => {
    setProfile(profilePicture.profilePicture);
  }, [profilePicture]);

  const handeTabs = (e: any) => {
    setChangeTab(e.target.value);
  };

  const pencil = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
        className="fill-gray-7"
      ></path>
      <path
        d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
        className="fill-gray-7"
      ></path>
    </svg>,
  ];

  const data = [
    {
      title: "Sophie B.",
      avatar: "Demo",
      description: "Hi! I need more information…",
    },
    {
      title: "Anne Marie",
      avatar: "Demo",
      description: "Awesome work, can you…",
    },
    {
      title: "Ivan",
      avatar: "Demo",
      description: "About files I can…",
    },
    {
      title: "Peterson",
      avatar: "Demo",
      description: "Have a great afternoon…",
    },
    {
      title: "Nick Daniel",
      avatar: "Demo",
      description: "Hi! I need more information…",
    },
  ];

  return (
    <>
      <div
        className="profile-nav-bg"
        style={{
          marginTop: "10px",
          backgroundImage: "url(" + backDrop + ")",
          boxShadow: "0px -5px 10px #b3b3b3",
        }}
      ></div>
      <Card
        className="card-profile-head"
        bodyStyle={{ display: "none" }}
        title={
          <Row justify="space-between" align="middle" gutter={[24, 0]}>
            <Col span={24} md={12} className="col-info">
              <Avatar.Group>
                <Avatar
                  style={{ marginTop: "2px" }}
                  size={120}
                  shape="square"
                  src={
                    profile ? (
                      `data:image/png;base64,${profile}`
                    ) : (
                      <UserOutlined />
                    )
                  }
                />

                <div className="avatar-info">
                  <h4 className="font-semibold m-0">
                    {loggedInUser?.firstName + " " + loggedInUser?.lastName}
                  </h4>
                  <p>{loggedInUser?.department.departmentName}</p>
                </div>
              </Avatar.Group>
            </Col>
            <Col
              span={24}
              md={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Radio.Group defaultValue="1">
                <Radio.Button onClick={handeTabs} value="1">
                  OVERVIEW
                </Radio.Button>
                <Radio.Button onClick={handeTabs} value="2">
                  TEAMS
                </Radio.Button>
                <Radio.Button onClick={handeTabs} value="3">
                  PROJECTS
                </Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        }
      ></Card>
      <Row>
        <Tabs
          tabBarStyle={{ display: "none" }}
          style={{ width: "100vw" }}
          defaultActiveKey="1"
          activeKey={changeTab}
        >
          <TabPane key="1">
            <Row gutter={[24, 0]}>
              <Col span={24} md={8} className="mb-24">
                <Card
                  bordered={false}
                  title={
                    <h6 className="font-semibold m-0">Profile Information</h6>
                  }
                  className="header-solid h-full card-profile-information"
                  extra={<Button type="link">{pencil}</Button>}
                  bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                >
                  <p className="text-dark">
                    {" "}
                    Hi, I’m Alec Thompson, Decisions: If you can’t decide, the
                    answer is no. If two equally difficult paths, choose the one
                    more painful in the short term (pain avoidance is creating
                    an illusion of equality).{" "}
                  </p>
                  <hr className="my-25" />
                  <Descriptions title="Oliver Liam">
                    <Descriptions.Item label="Full Name" span={3}>
                      {loggedInUser?.firstName + " " + loggedInUser?.lastName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mobile" span={3}>
                      {loggedInUser.mobileNo}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email" span={3}>
                      {loggedInUser.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Location" span={3}>
                      {loggedInUser.address}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={24} md={8} className="mb-24">
                <Card
                  bordered={false}
                  title={
                    <h6 className="font-semibold m-0">Project Team Members</h6>
                  }
                  className="header-solid h-full"
                  bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={data}
                    split={false}
                    className="conversations-list"
                    renderItem={(item) => (
                      <List.Item actions={[<Button type="link">REPLY</Button>]}>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              shape="square"
                              size={48}
                              src={item.avatar}
                            />
                          }
                          title={item.title}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={24} md={8} className="mb-24">
                <Card
                  bordered={false}
                  title={
                    <h6 className="font-semibold m-0">Current Projects</h6>
                  }
                  className="header-solid h-full"
                  bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={data}
                    split={false}
                    className="conversations-list"
                    renderItem={(item) => (
                      <List.Item actions={[<Button type="link">REPLY</Button>]}>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              shape="square"
                              size={48}
                              src={item.avatar}
                            />
                          }
                          title={item.title}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane key="2">Teams</TabPane>
          <TabPane key="3">Project</TabPane>
        </Tabs>
      </Row>
    </>
  );
};

export default Profile;
