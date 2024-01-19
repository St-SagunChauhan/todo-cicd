import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import marketPlaceAccountService from "../../services/marketPlaceAccountRequest";
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
import {
  CloseOutlined,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { MarketPlaceAccountEnum } from "../../Enums/MarketPlaceAccountEnum/MarketPlaceAccountEnum";
import { AccountTypes } from "../../Enums/LeadsConnect/BillingStatus";

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  accountData: any;
};

type FieldType = {
  id: "00000000-0000-0000-0000-000000000000";
  name: string;
  technology: string;
  jobSuccessrate: string;
  earning: string;
  remarks: string;
  isActive: true;
  marketPlaceAccountsStatus: number;
  account: number;
};

export default function AddMarketPlaceAccount({
  isOpen,
  handleCloseDialog,
  accountData,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);

    const { accountTypes, ...rest } = values;

    const updatedValue = {
      ...rest,
      marketPlaceAccountsStatus: rest.marketPlaceAccountsStatus,
      account: values.accountTypes,
    };
    marketPlaceAccountService
      .addNewMarketPlaceAccount(updatedValue)
      .then((response) => {
        message.success("Upwork Id Added Successfully");
        setLoading(false);
        dispatch<any>(marketPlaceAccountService.fetchMarketPlaceAccountList());
      })
      .catch((error) => {
        message.error("Failed to add Id");
        setLoading(false);
      });
    handleCloseDialog();
    dispatch<any>(marketPlaceAccountService.fetchMarketPlaceAccountList());
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Form className="label-text"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: "600px", width: "100%", padding: "20px 10px" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Upwork Id"
            name="name"
            rules={[{ required: true, message: "Please input Name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Technology" name="technology">
            <Input />
          </Form.Item>

          <Form.Item
            label="Status"
            name="marketPlaceAccountsStatus"
            rules={[{ required: true, message: "Please Select Status!" }]}
          >
            <Select 
             className="custom-select"
             placeholder="Select a Status">
              {Object.values(MarketPlaceAccountEnum).map((item: any) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Account Types"
            name="accounts"
            rules={[
              {
                required: true,
                message: "Please input AccountTypes!",
              },
            ]}
          >
            <Select 
              className="custom-select"
              placeholder="Select a AccountTypes">
              {Object.values(AccountTypes).map((item: any) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Job Success Rate" name="jobSuccessrate">
            <Input />
          </Form.Item>

          <Form.Item label="earning" name="earning">
            <Input />
          </Form.Item>
          <Form.Item label="Remarks" name="remarks">
            <Input />
          </Form.Item>
          <Form.Item className= "submit-btn-wrap" wrapperCol={{ span: 16 }}>
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
