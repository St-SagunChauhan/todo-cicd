import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import assetsService from "../../../services/assetsService";
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

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  assetData: any;
};

type FieldType = {
  assetId: string;
  assetName: string;
  manufacturerName: string;
  purchasedDate: string;
  quantity: number;
  modelNumber: string;
  assetStatus: string;
  remarks: string;
};

export default function EditAsset({
  isOpen,
  handleCloseDialog,
  assetData,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: FieldType) => {
    setLoading(true);

    const response = await assetsService.updateAsset(values);
    // console.log("respnse---------", response);
    if (response.status === 200) {
      message.success(response.data.message);
    } else {
      message.error(response.data.message);
    }

    dispatch<any>(assetsService.fetchAssetsList());
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
              style={{ padding: "20px 10px" }}
              label="Asset Name"
              name="assetName"
              rules={[{ required: true, message: "Please input Asset Name!" }]}
              initialValue={assetData.name}
            >
              <Input />
            </Form.Item>
          </Col>
          {/* <Form.Item
            label="Category Name"
            name="categoryId"
            rules={[{ required: true, message: "Please Category Name!" }]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            label="Manufacturer Name"
            name="manufacturerName"
            rules={[
              { required: true, message: "Please input Manufacturer Name!" },
            ]}
            initialValue={assetData.manufacturerName}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Purchased Date"
            name="purchasedDate"
            rules={[
              { required: true, message: "Please input Purchased Date!" },
            ]}
            initialValue={assetData.purchasedDate}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please input Quantity!" }]}
            initialValue={assetData.quantity}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Model Number"
            name="modelNumber"
            rules={[{ required: true, message: "Please input Model Number!" }]}
            initialValue={assetData.modelNumber}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Remarks"
            name="remarks"
            rules={[{ required: true, message: "Please input Remarks!" }]}
            initialValue={assetData.remarks}
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
