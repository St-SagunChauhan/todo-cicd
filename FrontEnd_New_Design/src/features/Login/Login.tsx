import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  InfoCircleOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Tooltip,
  message,
} from "antd";
import LogInLogo from "../../assets/images/supreme_logo.svg";
import HalfBack from "../../assets/images/halfBack.png";
import { LoginPro } from "../../Action/AuthAction";

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const Login = (props: Props) => {
  const { loading } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    message.loading("Loading");
    loading(100, true);
    const loginDispatch = await dispatch<any>(LoginPro(values));
    if (!loginDispatch.status) {
      message.error(loginDispatch.msg);
      loading(100, false);
    } else if (loginDispatch.status) {
      message.success(loginDispatch.msg);
      loading(100, false);
      navigate(loginDispatch.pathName);
    }
  };

  useEffect(() => {
    loading(0, false);
  }, []);

  return (
    <>
      <Row style={{ height: "100vh" }}>
        <Col span={12}>
          <div
            className="loginPage Box"
            style={{
              backgroundImage: `url(${HalfBack})`,
              backgroundSize: "100% 100%",
            }}
          ></div>
        </Col>
        <Col span={12}>
          <div
            className="loginPage Box"
            // style={{ backgroundImage: `url(${BackgroundImg})` }}
          >
            <div className="borderBox">
              <div>
                <img src={LogInLogo} alt="Supreme Logo" />
              </div>
              <div className="loginForm">
                <Form
                  style={{ width: "500px" }}
                  name="normal_login"
                  className="login-form"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        pattern: new RegExp(
                          "^[A-Za-z0-9._%+-]+@supremetechnologiesindia.com$"
                        ),
                        message: "Please input your User Email Id!",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      suffix={
                        <Tooltip
                          className="Tooltip"
                          title="Please Enter your Supreme Email Id (Ex: example@supremetechnologiesindia.com)"
                        >
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      }
                      placeholder="User Email"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Password!",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox style={{ color: "#000" }}>Remember me</Checkbox>
                    </Form.Item>

                    {/* <a className="login-form-forgot" href="">
                  Forgot password
                </a> */}
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                    >
                      Log in
                    </Button>
                    {/* Or <a href="">register now!</a> */}
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Login;
