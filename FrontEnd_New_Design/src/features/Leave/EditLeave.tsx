import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import leaveService from "../../services/leaveRequest";
import { empSelector } from "../../Selectors/employeeSelector";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  DatePicker,
  message,
} from "antd";
import { IEmployee } from "../Employee/EmployeeModel";
import { CloseOutlined } from "@ant-design/icons";
import { LeaveTypeEnum } from "../../Enums/LeaveEnum/LeaveEnum";
import { StatusEnum } from "../../Enums/LeaveEnum/LeaveEnum";

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
  reason: string;
  startData: string;
  endData: string;
};

export default function EditLeave({
  isOpen,
  handleCloseDialog,
  leaveData,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const empData = useSelector(empSelector);

  const onFinish = async (values: FieldType) => {
    setLoading(true);

    values.id = leaveData.id;

    const response = await leaveService.updateLeave(
      values
    );
    if (response.status === 200) {
      message.success(response.data.message);
      dispatch<any>(leaveService.fetchLeaveList());
      handleCloseDialog();
    } else {
      message.error(response.data.message);
    }

    // dispatch<any>(assetCategory.fetchAssetCategoriesList());
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
            rules={[{ required: true, message: "Please select a Employee!" }]}
            initialValue={leaveData.employeeId}
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
            initialValue={leaveData.leaveType}
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
            initialValue={leaveData.status}
          >
            <Select placeholder="Select a Leave Status">
              {Object.values(StatusEnum).map((status: string) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Reason"
            name="reason"
            initialValue={leaveData.reason}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: "Please Pick Start Date!" }]}
            initialValue={leaveData.startDate}
          >
            {/* <DatePicker style={{ width: "295px" }} /> */}
            <Input />
          </Form.Item>
          <Form.Item
            label="endDate"
            name="End Date"
            initialValue={leaveData.endDate}
          >
            {/* <DatePicker style={{ width: "295px" }} /> */}
            <Input />
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
