import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import assetsService from "../../../services/assetsService";
// import { deptSelector } from "../../Selectors/departmentSelector";
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
// import { RoleEnum } from "../../Enums/EmployeeEnum/EmployeeEnum";
// import { IDept } from "../Department/DeptModel";

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  assetData: any;
};

type FieldType = {
  categoryId: string;
  assetName: string;
  manufacturerName: string;
  purchasedDate: string;
  quantity: number;
  modelNumber: string;
  assetStatus: string;
  remarks: string;
};

export default function AddAsset({
  isOpen,
  handleCloseDialog,
  assetData,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any>([]);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const departmentEmployees: any[] = [];

  //   const deptData = useSelector(deptSelector);

  const onFinish = (value: FieldType) => {
    setLoading(true);

    assetsService
      .addAsset(value)
      .then((response) => {
        // Handle success
        message.success("Employee Created Successfully");
        setLoading(false);
        handleCloseDialog();

        dispatch<any>(assetsService.fetchAssetsList());
      })
      .catch((error) => {
        message.error("Failed to create employee");
        setLoading(false);
      });
    dispatch<any>(assetsService.fetchAssetsList());
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleImageChange = (e: any) => {
    const fileList = Array.from(e.target.files);
    fileList.forEach((file: any, i) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        // const updatedField: FieldType = {
        //   profilePicture: result.split(",")[1].trim(),
        // };
        // Now you can use the updatedField object as needed.
        setImages([reader.result]);
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Row gutter={[16, 16]}>
      <Form
        style={{ width: "100%", padding: "20px 10px" }}
        name="basic"
        labelCol={{ span: 11 }}
        wrapperCol={{ span: 24 }}
        // style={{ maxWidth: 700 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
  
        <Col
        style={{ paddingLeft: "0px", paddingRight: "0px" }}
        >
          <Form.Item
            className="label-text"
            label="Asset Name"
            name="employeeNumber"
            rules={[{ required: true, message: "Please input Asset Name!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Form.Item
          className="label-text"
          label="Category Name"
          name="categoryId"
          rules={[{ required: true, message: "Please input  Category Name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="label-text"
          label="Manufacturer Name"
          name="manufacturerName"
          rules={[
            { required: true, message: "Please input  manufacturer Name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="label-text"
          label="Purchased Date"
          name="purchasedDate"
          rules={[
            { required: true, message: "Please select a Purchased Date!" },
          ]}
        >
          <DatePicker className="custom-select" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          className="label-text"
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: "Please input Quantity!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="label-text"
          label="Model Number"
          name="modelNumber"
          rules={[{ required: true, message: "Please input Model Number!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="label-text"
          label="Remarks"
          name="remarks"
          rules={[{ required: true, message: "Please input Remarks!" }]}
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
