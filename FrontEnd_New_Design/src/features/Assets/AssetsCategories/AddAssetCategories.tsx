import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import assetCategory from "../../../services/assetCategoryService";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  message,
} from "antd";
import {
  CloseOutlined,
} from "@ant-design/icons";

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  assetCategoryData: any;
};

type FieldType = {
  categoryId: string;
  categoryName: string;
  isActive: true;
};

export default function AddAssetCategories({
  isOpen,
  handleCloseDialog,
  assetCategoryData,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any>([]);

  //   const deptData = useSelector(deptSelector);

  const onFinish = (value: FieldType) => {
    setLoading(true);

    assetCategory
      .addAssetCategory(value)
      .then((response) => {
        // Handle success
        message.success("Asset Created Successfully");
        setLoading(false);
        handleCloseDialog();

        dispatch<any>(assetCategory.fetchAssetCategoriesList());
      })
      .catch((error) => {
        message.error("Failed to create Asset");
        setLoading(false);
      });
    dispatch<any>(assetCategory.fetchAssetCategoriesList());
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Row gutter={[16, 16]}>
      <Form
        name="basic"
        labelCol={{ span: 10 }}
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
        <Col>
          <Form.Item
            label="Category Name"
            name="categoryName"
            rules={[{ required: true, message: "Please input Category Name!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
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
