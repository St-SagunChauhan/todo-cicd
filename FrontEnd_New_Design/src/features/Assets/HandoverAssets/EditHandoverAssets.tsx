import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import handoverassetsService from "../../../services/assetHandoverService";
import { empSelector } from "../../../Selectors/employeeSelector";
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
import { IEmployee } from "../../Employee/EmployeeModel";
import { CloseOutlined } from "@ant-design/icons";

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

export default function EditHandoverAsset({
  isOpen,
  handleCloseDialog,
  assetHandoverData,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const empData = useSelector(empSelector);

  const onFinish = async (values: FieldType) => {
    setLoading(true);

    values.handoverId = assetHandoverData.handoverId;

    const response = await handoverassetsService.updateAssetHandoveredRecord(
      values
    );
    if (response.status === 200) {
      message.success(response.data.message);
      dispatch<any>(handoverassetsService.fetchAssetsHadnoverList());
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
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Col>
            <Form.Item
              label="Asset Name"
              name="assetName"
              rules={[{ required: true, message: "Please input Asset Name!" }]}
              initialValue={assetHandoverData.name}
            >
              <Input />
            </Form.Item>
          </Col>
          <Form.Item
            label="Employee"
            name="employeeId"
            rules={[{ required: true, message: "Please select a Employee!" }]}
            initialValue={assetHandoverData.employeeId}
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
            initialValue={assetHandoverData.assignedDate}
          >
            {/* <DatePicker style={{ width: "100%" }} /> */}
            <Input />
          </Form.Item>
          <Form.Item
            label="Identification Number"
            name="identificationNumber"
            rules={[
              {
                required: true,
                message: "Please input Identification Number!",
              },
            ]}
            initialValue={assetHandoverData.identificationNumber}
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
    </>
  );
}
