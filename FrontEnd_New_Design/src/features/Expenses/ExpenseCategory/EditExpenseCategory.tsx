import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import expenseCategoryService from "../../../services/expenseCategoryRequest";
import { Button, Form, Input, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  expenseCategoryData: any;
};

type FieldType = {
  categoryName?: string;
};

export default function EditExpenseCategory({
  isOpen,
  handleCloseDialog,
  expenseCategoryData,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: FieldType) => {
    setLoading(true);

    const response = await expenseCategoryService.updateExpenseCategory(values);
    if (response.status === 200) {
      message.success(response.data.message);
    } else {
      message.error(response.data.message);
    }

    dispatch<any>(expenseCategoryService.fetchExpenseCategoryList());
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <div>
        <Form
          name="basic"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Expense Category Name"
            name="categoryName"
            rules={[{ required: true, message: "Please input categoryName!" }]}
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
              Update
            </Button>

            <Button icon={<CloseOutlined />} onClick={handleCloseDialog} danger>
              Close
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
