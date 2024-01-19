import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import hRExpenseServices from "../../../services/epenseServices";
import {
  hrExpenseSelector,
  isLoadingSelector,
} from "../../../Selectors/expenseSelector";
import UploadComponent from "../../../Components/UploadComponent/UploadComponent";
import {
  Button,
  Col,
  Divider,
  Row,
  DatePicker,
  Table,
  Card,
  Skeleton,
  List,
  Upload,
  UploadProps,
  message,
  Modal,
  Popconfirm,
  Tooltip,
  Space,
} from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  InboxOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import expenseCategoryService from "../../../services/expenseCategoryRequest";
import SkeletonTable from "../../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../../Layout/SkeletonTable/SkeletonTable";
import AddExpenseCategory from "./AddExpenseCategory";
import { expenseCategorySelector } from "../../../Selectors/expenseCategorySelector";
import EditExpenseCategory from "./EditExpenseCategory";

const Dragger = Upload;

interface DataType {
  expenseCategoryId: string;
  CategoryName: string;
  isActive: string;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const ExpenseCategory = (props: Props) => {
  const { loading } = props;
  const expenseCategory = useSelector(expenseCategorySelector);
  const isLoading = useSelector(isLoadingSelector);
  const dispatch = useDispatch();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [visible, setVisible] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsOpenEditModal(false);
  };

  useEffect(() => {
    loading(100, false);
    dispatch<any>(expenseCategoryService.fetchExpenseCategoryList());
    loading(100, false);
  }, []);

  const onClickEditExpenseCategory = async (expenseCategoryId: any) => {
    const response = await expenseCategoryService.fetchExpenseCategoryById(
      expenseCategoryId
    );

    setIsOpenEditModal(true);
    setEditRow(response?.data.expenseCategoryResult);
  };
  const columns = [
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      render: (rowData: any) => {
        return rowData.isActive ? "InActive" : "Active";
      },
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      description: "Edit and Remove Expense Category",
      render: (e: any, rowData: any) => (
        <Space>
          <a
            href="#"
            onClick={() =>
              onClickEditExpenseCategory(rowData.expenseCategoryId)
            }
          >
            <EditOutlined />
          </a>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={async () => {
              const expenseCategoryId = rowData.expenseCategoryId;
              const response =
                await expenseCategoryService.deleteExpenseCategory(
                  expenseCategoryId
                );
              if (response.status === 200) {
                message.success(response.data.message);
                dispatch<any>(
                  expenseCategoryService.fetchExpenseCategoryList()
                );
              } else {
                message.error(response.data.message);
              }
            }}
            okText="Yes"
            cancelText="No"
          >
            <a href="#" style={{ color: "red" }}>
              <DeleteOutlined />
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data: DataType[] =
    expenseCategory &&
    expenseCategory.length >= 0 &&
    expenseCategory.map((data: any, id: number) => {
      return {
        expenseCategoryId: data.expenseCategoryId,
        categoryName: data.categoryName,
        isActive: data.isActive,
      };
    });

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col style={{ display: "flex", justifyContent: "end", width: "100%" }}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            size="large"
            onClick={handleOpenModal}
          >
            Add Expense Category
          </Button>
          <Modal
            open={isOpen}
            title="Add Expense Category"
            onCancel={handleCloseModal}
            footer={null}
          >
            <AddExpenseCategory
              handleCloseDialog={handleCloseModal}
              isOpen={isOpen}
              expenseCategoryData={expenseCategory}
            />
          </Modal>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Expense Category List`}
          >
            <div className="table-responsive">
              <SkeletonTable
                columns={columns as SkeletonTableColumnsType[]}
                active
              >
                <Table columns={columns} dataSource={data} size="large" />
              </SkeletonTable>
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        open={isOpenEditModal}
        title="Edit Expense Category"
        onCancel={handleCloseEditModal}
        footer={null}
      >
        <EditExpenseCategory
          handleCloseDialog={handleCloseEditModal}
          isOpen={isOpenEditModal}
          expenseCategoryData={editRow}
        />
      </Modal>
    </>
  );
};

export default ExpenseCategory;
