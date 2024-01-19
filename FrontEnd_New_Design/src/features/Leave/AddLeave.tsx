import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import leaveService from "../../services/leaveRequest";
import { empSelector } from "../../Selectors/employeeSelector";
import { IEmployee } from "../Employee/EmployeeModel";
import { type } from "os";
import { LeaveTypeEnum } from "../../Enums/LeaveEnum/LeaveEnum";
import { StatusEnum } from "../../Enums/LeaveEnum/LeaveEnum";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  message,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  leaveData: any;
};
type FieldType = {
  id: string;
  employeeId: string;
  leaveType: string;
  status: string;
  startDate: string;
  reason: string;
  endDate: string;
  isActive: true;
};
export default function AddLeave({
  isOpen,
  handleCloseDialog,
  leaveData,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const empData = useSelector(empSelector);
  const onFinish = (value: FieldType) => {
    setLoading(true);
    leaveService
      .addNewLeave(value)
      .then((response) => {
        // Handle success
        message.success("Leave Applied Successfully");
        setLoading(false);
        handleCloseDialog();
        dispatch<any>(leaveService.fetchLeaveList());
      })
      .catch((error) => {
        message.error("Failed to Apply Leave");
        setLoading(false);
      });
    dispatch<any>(leaveService.fetchLeaveList());
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Row gutter={[16, 16]}>
        <Form
          name="basic"
          labelCol={{ span: 11 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 800 }}
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
            <Row></Row>
          </Form.Item>
          <Form.Item
            label="Employee Name"
            name="employeeId"
            rules={[                                                                                                                                                                                                                                                       
              { required: true, message: "Please input Employee Number!" },
            ]}
          >
            <Select placeholder="Select a Employee">
              {empData &&
                empData.length &&
                empData.map((emp: IEmployee, key: number) => {
                  return (
                    <Select.Option
                      value={emp.employeeId || undefined}
                      key={key}
                    >
                      {emp.firstName}
                      {emp.lastName}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Leave Type"
            name="leaveType"
            rules={[{ required: true, message: "Please select a leaveType!" }]}
          >
            <Select placeholder="Select Type">
              {Object.values(LeaveTypeEnum).map((leaveType: string) => (
                <Select.Option key={leaveType} value={leaveType}>
                  {leaveType}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select placeholder="Select a Leave Status">
              {Object.values(StatusEnum).map((status: string) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Reason" name="reason">
            <Input />
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: "Please Pick Start Date!" }]}
          >
            {/* <DatePicker style={{ width: "100%" }} /> */}
            <Input/>
          </Form.Item>
          <Form.Item label="endDate" name="End Date">
            {/* <DatePicker style={{ width: "100%" }} /> */}
            <Input/>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ marginRight: 10 }}
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
