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
import { CloseOutlined } from "@ant-design/icons";

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  assetCategoryData: any;
};

type FieldType = {
  categoryId: string;
  categoryName: string;
};

export default function EditAssetCategories({
  isOpen,
  handleCloseDialog,
  assetCategoryData,
}: IProps): JSX.Element {
  // console.log("asst: ",assetCategoryData);
  
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [assetCatData, setAssetCatData] = useState<any>({});

  useEffect(() => {
    setAssetCatData(assetCategoryData);
  },[assetCategoryData])

  const onFinish = async (values: FieldType) => {
    setLoading(true);

    values.categoryId = assetCatData.categoryId;

    const response = await assetCategory.updateAssetCategory(values);
    if (response.status === 200) {
      message.success(response.data.message);
      dispatch<any>(assetCategory.fetchAssetCategoriesList());
      handleCloseDialog();
    } else {
      message.error(response.data.message);
    }

    // dispatch<any>(assetCategory.fetchAssetCategoriesList());
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  console.log("catData: ",assetCatData);
  

  return (
    <>
      <Row gutter={[16, 16]}>
        <Form
          name="basic"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Col>
            <Form.Item
              label="Category Name"
              name="categoryName"
              rules={[{ required: true, message: "Please input Category Name!" }]}
              initialValue={assetCategoryData.name}
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
    </>
  );
}
