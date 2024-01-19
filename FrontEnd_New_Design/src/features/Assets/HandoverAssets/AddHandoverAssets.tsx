import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import handoverassetsService from "../../../services/assetHandoverService";
import { empSelector } from "../../../Selectors/employeeSelector";
import {
  Button,
  Col,
  Form,
  Input,
  Select,
  Row,
  message,
  DatePicker,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { IEmployee } from "../../Employee/EmployeeModel";

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  assetHandoverData: any;
};

type FieldType = {
  handoverId: string;
  assetId: string;
  employeeId: string;
  assignedDate: string;
  identificationNumber: string;
};

export default function AddHandoverAsset({
  isOpen,
  handleCloseDialog,
  assetHandoverData,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const empData = useSelector(empSelector);

  const onFinish = (value: FieldType) => {
    setLoading(true);

    handoverassetsService
      .handoverAsset(value)
      .then((response) => {
        // Handle success
        message.success("Asset Handover Created Successfully");
        setLoading(false);
        handleCloseDialog();

        dispatch<any>(handoverassetsService.fetchAssetsHadnoverList());
      })
      .catch((error) => {
        message.error("Failed to create Asset Handover");
        setLoading(false);
      });
    dispatch<any>(handoverassetsService.fetchAssetsHadnoverList());
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Row gutter={[16, 16]}>
      <Form
        name="basic"
        labelCol={{ span: 11 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 700 }}
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
          label="Asset Name"
          name="assetName"
          rules={[{ required: true, message: "Please input Asset Name!" }]}
        >
          <Input />
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
                        `${emp.firstName}
                        {emp.lastName}`
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
        <Form.Item
          label="Assigned Date"
          name="assignedDate"
          rules={[{ required: true, message: "Please input Assigned Date!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Identification Number"
          name="identificationNumber"
          rules={[
            { required: true, message: "Please input Identification Number!" },
          ]}
        >
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
  );
}
