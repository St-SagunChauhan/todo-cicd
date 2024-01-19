import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, DatePicker, Form, Input, Row, Select, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { AccountTypes } from "../../Enums/LeadsConnect/BillingStatus";
import connectService from "../../services/connectRequest";

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
};

type FieldType = {
  key: string;
  dateOfPurchase: string;
  numberOfConnects: string;
  accountType: string;
  amount: string;
};

export default function AddConnects({
  isOpen,
  handleCloseDialog,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values: FieldType) => {
    setLoading(true);
    connectService
      .addNewConnects({
        ...values,
      })
      .then((response: { data: { success: any; message: any } }) => {
        // Handle success
        if (response.data.success) {
          message.success(response.data.message);
          form.resetFields();
        } else {
          message.error("Something Went Wrong");
        }
        handleCloseDialog();
        dispatch<any>(connectService.fetchConnectsList());
      })
      .catch(() => {
        message.error("Failed to create Bid");
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Row
        gutter={[16, 16]}
        style={{ justifyContent: "center", padding: "20px 0px" }}
      >
        <Form
          className="label-text"
          form={form}
          name="basic"
          labelCol={{ span: 11 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: "540px", width: "100%" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Date Of Purchase"
            name="dateOfPurchase"
            rules={[
              {
                required: true,
                message: "Please input Date Of Purchase!",
              },
            ]}
          >
            <DatePicker className="custom-select" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Number Of Connects"
            name="numberOfConnects"
            rules={[
              {
                required: true,
                message: "Please input Number Of Connects!",
              },
            ]}
          >
            <Input
              type="number"
              min="0"
              placeholder="Enter Number Of Connects"
            />
          </Form.Item>
          <Form.Item
            label="Account Types"
            name="accountType"
            rules={[
              {
                required: true,
                message: "Please input AccountTypes!",
              },
            ]}
          >
            <Select
              className="custom-select"
              placeholder="Select a AccountTypes"
            >
              {Object.values(AccountTypes).map((item: any) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input Amount!",
              },
            ]}
          >
            <Input type="number" min="0" placeholder="Enter Amount" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
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
