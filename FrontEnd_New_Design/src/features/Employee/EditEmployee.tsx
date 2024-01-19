import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import empService from "../../services/empRequest";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import { IDept } from "../Department/DeptModel";
import { GenderEnum, IEmployee, RoleEnum } from "./EmployeeModel";
import dayjs from "dayjs";
import { empSelector } from "../../Selectors/employeeSelector";
import { deptSelector } from "../../Selectors/departmentSelector";

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  empData: any;
};

export default function EditEmployee({
  isOpen,
  handleCloseDialog,
  empData,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const [form] = Form.useForm();

  const deptData = useSelector(deptSelector);
  let employeeData = useSelector(empSelector);

  const [selectedDepartment, setSelectedDepartment] = useState(
    empData?.departmentId
  );

  let filteredEmployeeData = employeeData?.filter(
    (employee: { departmentId: any }) =>
      employee.departmentId === selectedDepartment
  );

  const [formData, setFormData] = useState({
    employeeId: empData.employeeId,
    employeeNumber: empData.employeeNumber,
    firstName: empData.firstName,
    lastName: empData.lastName,
    email: empData.email,
    isActive: true,
    departmentId: empData.departmentId,
    joiningDate: empData.joiningDate,
    mobileNo: empData.mobileNo,
    employeeTargetedHours: empData.employeeTargetedHours,
    casualLeaves: empData.casualLeaves,
    sickLeaves: empData.sickLeaves,
    assignedTo: empData.assignedTo,
    gender: empData.gender,
    role: empData.role,
    address: empData.address,
    resignationDate: empData.resignationDate,
    profilePicture: empData.profilePicture,
  });

  const [errorshow, seterrorshow] = useState({
    employeeNumber: "",
    email: "",
    firstName: "",
    lastName: "",
    mobileNo: "",
    address: "",
    casualLeaves: "",
    sickLeaves: "",
    employeeTargetedHours: "",
  });

  const validateForm = () => {
    let errors = {
      employeeNumber: "",
      email: "",
      firstName: "",
      lastName: "",
      mobileNo: "",
      address: "",
      casualLeaves: "",
      sickLeaves: "",
      employeeTargetedHours: "",
    };
    if (formData?.employeeNumber.trim() === "") {
      errors.employeeNumber = "EmployeeNumber is required";
    }
    if (!formData?.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Invalid email format";
      }
    }
    if (formData?.firstName.trim() === "") {
      errors.firstName = "FirstName is required";
    }

    if (formData?.lastName.trim() === "") {
      errors.lastName = "LastName is required";
    }
    if (!formData?.mobileNo.trim()) {
      errors.mobileNo = "Mobile number is required";
    } else {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(formData.mobileNo)) {
        errors.mobileNo = "Invalid mobile number";
      }
    }
    if (formData?.address.trim() === "") {
      errors.address = "Address is required";
    }
    if (formData?.casualLeaves === "") {
      errors.casualLeaves = "Casual Leaves is required";
    }
    if (formData?.sickLeaves === "") {
      errors.sickLeaves = "Sick Leaves is required";
    }
    if (formData?.employeeTargetedHours === "") {
      errors.employeeTargetedHours = "employeeTargetedHours is required";
    }
    seterrorshow(errors);

    return Object.values(errors).every((error) => error === "");
  };

  const [formChanged, setFormChanged] = useState(false);

  const onValuesChange = () => {
    // Set formChanged to true when any field is changed
    setFormChanged(true);
  };

  const onFinish = async () => {
    if (!validateForm() || !formChanged) {
      return;
    }
    setLoading(true);

    formData.gender = formData.gender.toString();
    formData.role = formData.role.toString();
    const response = await empService.updateEmployee(formData);
    if (response.status === 200) {
      message.success(response.data.message);
      setLoading(false);
    } else {
      message.error(response.data.message);
    }

    setIsOpenEditModal(false);
    handleCloseDialog();
    dispatch<any>(empService.fetchEmpList());
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  let fileInput: HTMLInputElement | null = null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        setBase64Image(result);
        console.log(result.split(",")[1].trim());

        // Save base64 image to profilePicture field in formData
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: result.split(",")[1].trim(),
        }));
      };

      reader.readAsDataURL(file);
    } else {
      console.log("No file selected or file input issue.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    if (field === "departmentId") setSelectedDepartment(value);
  };

  const handleSelectChange = (field: string, value: string) => {
    handleInputChange(field, value);
  };

  return (
    <>
      <Row
        gutter={[16, 16]}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Form
          style={{ width: "100%", margin: "0px 20px" }}
          layout="vertical"
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          // style={{ maxWidth: 700 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
          onValuesChange={(_, values) => onValuesChange()}
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
                src={
                  base64Image ||
                  (empData.profilePicture && empData.profilePicture !== "" ? (
                    `data:image/png;base64,${empData.profilePicture}`
                  ) : (
                    <UserOutlined />
                  ))
                }
                style={{ cursor: "pointer", background: "#d7d7d7" }}
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
            <Col span={12}>
              <Form.Item
                label="Employee Number"
                name="employeeNumber"
                initialValue={empData.employeeNumber}
                help={errorshow.employeeNumber}
                validateStatus={errorshow.employeeNumber ? "error" : ""}
              >
                <Input
                  onChange={(e) =>
                    handleInputChange("employeeNumber", e.target.value)
                  }
                  disabled
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                initialValue={empData.email}
                help={errorshow.email}
                validateStatus={errorshow.email ? "error" : ""}
              >
                <Input
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
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
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                initialValue={empData.firstName}
                help={errorshow.firstName}
                validateStatus={errorshow.firstName ? "error" : ""}
              >
                <Input
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                initialValue={empData.lastName}
                help={errorshow.lastName}
                validateStatus={errorshow.lastName ? "error" : ""}
              >
                <Input
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
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
            <Col span={12}>
              <Form.Item
                label="Mobile Number"
                name="mobileNo"
                initialValue={empData.mobileNo}
                help={errorshow.mobileNo}
                validateStatus={errorshow.mobileNo ? "error" : ""}
                rules={[
                  {
                    required: true,
                    pattern: new RegExp("^[0-9]{10}$"),
                    message: "Please input a 10-digit Mobile Number!",
                  },
                ]}
              >
                <Input
                  onChange={(e) =>
                    handleInputChange("mobileNo", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Address"
                name="address"
                initialValue={empData.address}
                help={errorshow.address}
                validateStatus={errorshow.address ? "error" : ""}
              >
                <Input
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
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
            <Col span={12}>
              <Form.Item
                label="Casual Leaves"
                name="casualLeaves"
                initialValue={empData.casualLeaves}
                help={errorshow.casualLeaves}
                validateStatus={errorshow.casualLeaves ? "error" : ""}
              >
                <Input
                  onChange={(e) =>
                    handleInputChange("casualLeaves", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Sick Leaves"
                name="sickLeaves"
                initialValue={empData.sickLeaves}
                help={errorshow.sickLeaves}
                validateStatus={errorshow.sickLeaves ? "error" : ""}
              >
                <Input
                  onChange={(e) =>
                    handleInputChange("sickLeaves", e.target.value)
                  }
                />
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
            <Col span={12}>
              <Form.Item label="Department" name="departmentId">
                <Select
                  className="custom-select"
                  placeholder="Select a Department"
                  defaultValue={formData.departmentId}
                  onChange={(value) =>
                    handleSelectChange("departmentId", value)
                  }
                >
                  {/* Map through your list of departments and render an Option for each one */}
                  {deptData &&
                    deptData.length &&
                    deptData.map((dept: IDept, key: number) => {
                      return (
                        <Select.Option
                          value={dept.departmentId || undefined}
                          key={key}
                        >
                          {dept.departmentName}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Gender"
                name="gender"
                initialValue={empData.gender}
              >
                <Select
                  className="custom-select"
                  placeholder="Select a Gender"
                  onChange={(value) => handleSelectChange("gender", value)}
                >
                  {Object.values(GenderEnum).map((item: any) => (
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
            <Col span={12}>
              <Form.Item label="Role" name="role" initialValue={empData.role}>
                <Select
                  className="custom-select"
                  style={{ width: "100%" }}
                  placeholder="Select a Role"
                  onChange={(value) => handleSelectChange("role", value)}
                >
                  {Object.values(RoleEnum).map((item: any) => (
                    <Select.Option key={item.value} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* <Form.Item
            label="Joining Date"
            name="joiningDate"
            initialValue={empData.joiningDate}
          >
            <DatePicker style={{ width: "295px" }} />
          </Form.Item> */}
            </Col>

            <Col span={12}>
              <Form.Item
                label="Employee Targeted Hours"
                name="employeeTargetedHours"
                initialValue={empData.employeeTargetedHours}
                help={errorshow.employeeTargetedHours}
                validateStatus={errorshow.employeeTargetedHours ? "error" : ""}
              >
                <Input
                  onChange={(e) =>
                    handleInputChange("employeeTargetedHours", e.target.value)
                  }
                />
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
                initialValue={dayjs(empData.joiningDate)}
              >
                <DatePicker
                  className="custom-select"
                  style={{ width: "100%" }}
                  onChange={(e: any) => {
                    handleInputChange("joiningDate", e);
                  }}
                />
              </Form.Item>
            </Col>
            <Col className="employee-field emp-field-selected" span={12}>
              <Form.Item
                label="Resignation Date"
                name="resignationDate"
                initialValue={empData.resignationDate}
              >
                <DatePicker
                  className="custom-select"
                  style={{ width: "100%" }}
                  onChange={(e: any) => {
                    handleInputChange("resignationDate", e);
                  }}
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
            <Col style={{ width: "50%" }}>
              <Form.Item
                label="Assigned To"
                name="assignedTo"
                style={{ flex: "none" }}
              >
                <Select
                  placeholder="Select Employee Name"
                  defaultValue={empData.assignedTo}
                  onChange={(value) => handleSelectChange("assignedTo", value)}
                >
                  {filteredEmployeeData &&
                    filteredEmployeeData.length > 0 &&
                    filteredEmployeeData.map((emp: IEmployee, key: number) => (
                      <Select.Option
                        value={emp.employeeId || undefined}
                        key={key}
                      >
                        {emp.firstName} {emp.lastName}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ marginRight: 10 }}
              disabled={!formChanged}
            >
              Submit
            </Button>

            <Button icon={<CloseOutlined />} onClick={handleCloseDialog} danger>
              Close
            </Button>
          </Form.Item>
        </Form>
      </Row>
    </>
  );
}
