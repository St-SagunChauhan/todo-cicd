import React, { useState } from "react";
import { useDispatch } from "react-redux";
import expenseCategoryService from "../../../services/expenseCategoryRequest";
import { Button, Form, Input, message } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  expenseCategoryData: any;
};

type FieldType = {
  categoryName?: string;
};

export default function AddExpenseCategory({
  isOpen,
  handleCloseDialog,
  expenseCategoryData,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: FieldType) => {
    setLoading(true);

    // Call your expenseCategoryService.addExpenseCategory here
    expenseCategoryService
      .addNewExpenseCategory(values)
      .then((response) => {
        // Handle success
        message.success("Expense category added successfully");
        setLoading(false);
        handleCloseDialog();

        dispatch<any>(expenseCategoryService.fetchExpenseCategoryList());
      })
      .catch((error) => {
        // Handle error
        message.error("Failed to add expense category");
        setLoading(false);
      });
    dispatch<any>(expenseCategoryService.fetchExpenseCategoryList());
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
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
          label={
            <span style={{ fontWeight: "bold" }}>Expense Category Name</span>
          }
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
            Submit
          </Button>

          <Button icon={<CloseOutlined />} onClick={handleCloseDialog} danger>
            Close
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
