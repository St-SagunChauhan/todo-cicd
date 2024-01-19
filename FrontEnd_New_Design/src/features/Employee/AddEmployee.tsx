import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import empService from "../../services/empRequest";
import { deptSelector } from "../../Selectors/departmentSelector";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Grid,
  Input,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import { GenderEnum, IEmployee, RoleEnum } from "./EmployeeModel";
import { IDept } from "../Department/DeptModel";
import moment from "moment";
import { empSelector } from "../../Selectors/employeeSelector";
type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  employeeData: any;
};

type FieldType = {
  employeeId: "00000000-0000-0000-0000-000000000000";
  profilePicture: string;
  employeeNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  address: string;
  departmentId: string;
  assignedTo: string;
  casualLeaves: string;
  sickLeaves: string;
  isActive: true;
  gender: string;
  role: string;
  joiningDate: string;
  resignationDate?: string;
  employeeTargetedHours: null;
};

export default function AddEmployee({
  isOpen,
  handleCloseDialog,
  employeeData,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any>([]);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<
    string | undefined
  >(undefined);
  const empData = useSelector(empSelector);
  const deptData = useSelector(deptSelector);
  const filteredEmployees = empData?.filter(
    (emp: { departmentId: string | undefined }) =>
      emp.departmentId === selectedDepartment
  );

  const onFinish = (value: FieldType) => {
    setLoading(true);

    // Convert gender and role to strings
    const stringValue = {
      ...value,
      gender: String(value.gender || ""),
      role: String(value.role || ""),
      profilePicture: images,
    };

    empService
      .createEmployee(stringValue)
      .then((response) => {
        if (response.status === 200) {
          // Handle success
          message.success("Employee Created Successfully");
          handleCloseDialog();
          dispatch<any>(empService.fetchEmpList());
        } else {
          throw new Error(`Failed to create employee. Status: ${response}`);
        }
      })
      .catch((error) => {
        message.error("Failed to create employee");
        setLoading(false);
      });
    dispatch<any>(empService.fetchEmpList());
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  let fileInput: HTMLInputElement | null = null;

  const handleImageChange = (e: any) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        setBase64Image(result);
        setImages(result.split(",")[1].trim());
      };
      reader.readAsDataURL(file);
    }
  };

  const loggedInUser = localStorage.getItem("user");

  // console.log({ loggedInUser });

  const disabledFutureDate = (current: any) => {
    return current && current < moment().endOf("day");
  };

  return (
    <Row
      gutter={[16, 16]}
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Form
        style={{ width: "100%", margin: "0px 20px" }}
        name="basic"
        labelCol={{ span: 18 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        // style={{ width: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Row>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              style={{ display: "none" }}
              ref={(input) => (fileInput = input)}
            />
            <Avatar
              size={60}
              icon={<UserOutlined />}
              src={base64Image}
              style={{ cursor: "pointer", background: "#1677ff" }}
              onClick={() => fileInput && fileInput.click()}
            />
          </Row>
        </Form.Item>

        <Row
          gutter={[30, 0]}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Col className="employee-field" span={12}>
            <Form.Item
              label="Employee Number"
              name="employeeNumber"
              rules={[
                { required: true, message: "Please input Employee Number!" },
                {
                  pattern: /^[ST0-9]+$/,
                  message:
                    "Employee Number must start with 'ST' and contain only alphanumeric characters.",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col className="employee-field" span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input Email Address!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row
          gutter={[30, 0]}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Col className="employee-field" span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Please input firstName!" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col className="employee-field" span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Please input Last Name!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={[30, 0]}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Col className="employee-field" span={12}>
            <Form.Item
              label="Mobile Number"
              name="mobileNo"
              rules={[
                {
                  required: true,
                  pattern: new RegExp("^[0-9]{10}$"),
                  message: "Please input a 10-digit Mobile Number!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col className="employee-field" span={12}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please input Address!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row
          gutter={[30, 0]}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Col className="employee-field" span={12}>
            <Form.Item
              label="Department"
              name="departmentId"
              rules={[
                { required: true, message: "Please select a Department!" },
              ]}
            >
              <Select
                className="custom-select"
                placeholder="Select a Department"
                onChange={(value) => setSelectedDepartment(value)}
              >
                {deptData &&
                  deptData.length &&
                  deptData.map(
                    (dept: {
                      departmentId: React.Key | null | undefined;
                      departmentName:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined;
                    }) => (
                      <Select.Option
                        value={dept.departmentId}
                        key={dept.departmentId}
                      >
                        {dept.departmentName}
                      </Select.Option>
                    )
                  )}
              </Select>
            </Form.Item>
          </Col>
          <Col className="employee-field" span={12}>
            <Form.Item
              label="Casual Leaves"
              name="casualLeaves"
              rules={[
                { required: true, message: "Please input Casual Leaves!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row
          gutter={[30, 0]}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Col className="employee-field" span={12}>
            <Form.Item
              label="Sick Leaves"
              name="sickLeaves"
              rules={[{ required: true, message: "Please input Sick Leaves!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col className="employee-field" span={12}>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Please select a Role!" }]}
            >
              <Select className="custom-select" placeholder="Select a Role">
                {Object.values(RoleEnum).map((item: any) => (
                  <Select.Option key={item.value} value={item.name}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={[30, 0]}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Col className="employee-field" span={12}>
            {" "}
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select a Gender!" }]}
            >
              <Select className="custom-select" placeholder="Select a Gender">
                {Object.values(GenderEnum).map((item: any) => (
                  <Select.Option key={item.value} value={item.name}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className="employee-field" span={12}>
            <Form.Item
              label="Employee Targeted Hours"
              name="employeeTargetedHours"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row
          gutter={[30, 0]}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Col className="employee-field emp-field-selected" span={12}>
            <Form.Item
              label="Joining Date"
              name="joiningDate"
              rules={[
                { required: true, message: "Please select Joining Date!" },
              ]}
            >
              <DatePicker className="custom-select" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col className="employee-field emp-field-selected" span={12}>
            <Form.Item label="Resignation Date" name="resignationDate">
              <DatePicker
                className="custom-select"
                style={{ width: "100%" }}
                disabledDate={disabledFutureDate}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={[30, 0]}
          style={{
            display: "flex",
          }}
        >
          <Col className="employee-field" span={12}>
            <Form.Item
              label="Assigned To"
              name="assignedTo"
              rules={[
                { required: false, message: "Please select an Employee!" },
              ]}
            >
              <Select
                className="custom-select"
                placeholder="Select an Employee"
              >
                {filteredEmployees &&
                  filteredEmployees.length &&
                  filteredEmployees.map(
                    (emp: {
                      employeeId: React.Key | null | undefined;
                      firstName:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined;
                      lastName:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined;
                    }) => (
                      <Select.Option
                        value={emp.employeeId}
                        key={emp.employeeId}
                      >
                        {emp.firstName} {emp.lastName}
                      </Select.Option>
                    )
                  )}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          className="employee-btn"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Button
            className="employee-btn-wrap"
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginRight: 10 }}
          >
            Submit
          </Button>

          <Button
            className="employee-btn-wrap"
            icon={<CloseOutlined />}
            onClick={handleCloseDialog}
            danger
          >
            Close
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
}
