import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    assetCategorySelector,
  isLoadingSelector,
} from "../../../Selectors/assetCategorySelector";
import {
  Col,
  Row,
  Table,
  Card,
  message,
  Button,
  Modal,
  Select,
  Avatar,
  Space,
  Popconfirm,
} from "antd";
import assetCategory from "../../../services/assetCategoryService";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import SkeletonTable from "../../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../../Layout/SkeletonTable/SkeletonTable";
import AddAssetCategories from "./AddAssetCategories";
import { useNavigate } from "react-router-dom";
import EditAssetCategories from "./EditAssetCategories";

interface DataType {
  key: string;
  categoryId: string;
  categoryName: string;
  isActive: string;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const AssetCategoriesList = (props: Props) => {
  const { loading } = props;
  const navigate = useNavigate();
  const assetCategoryData = useSelector(assetCategorySelector);
  const dispatch = useDispatch();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editRow, setEditRow] = useState({});
  const [isOpen, setIsOpen] = useState(false);

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
    dispatch<any>(assetCategory.fetchAssetCategoriesList());
    loading(100, false);
  }, []);

  const onClickEditAsset = async (categoryId: any, categoryName: string) => {
    setEditRow({id: categoryId, name: categoryName})

    const response = await assetCategory.fetchAssetCategoryById(categoryId);

    setIsOpenEditModal(true);
    // setEditRow(response?.data.assetResult);
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
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      description: "Edit and Remove Asset",
      render: (e: any, rowData: any) => (
        <Space>
          <a href="#" onClick={() => {onClickEditAsset(rowData.categoryId, rowData.categoryName);
          }}>
            <EditOutlined />
          </a>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={async () => {
              const expenseCategoryId = rowData.expenseCategoryId;
              const response =
                await assetCategory.deleteAssetCategory(
                  expenseCategoryId
                );
              if (response.status === 200) {
                message.success(response.data.message);
                dispatch<any>(
                  assetCategory.fetchAssetCategoriesList()
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
    assetCategoryData &&
    assetCategoryData.length >= 0 &&
    assetCategoryData.map((data: any, id: number) => {
      return {
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        isActive: data.isActive,
      };
    });

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col
          span={24}
          style={{ display: "flex", justifyContent: "end" }}
        >
            <Button
              icon={<PlusOutlined />}
              type="primary"
              size="large"
              onClick={handleOpenModal}
            >
              Add Asset Categorie
            </Button>
            <Modal
              open={isOpen}
              title="Add Asset Categories"
              onCancel={handleCloseModal}
              footer={null}
            >
              <AddAssetCategories
                handleCloseDialog={handleCloseModal}
                isOpen={isOpen}
                assetCategoryData={assetCategoryData}
              />
            </Modal>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Asset Categories`}
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
        title="Edit Asset Categorie"
        onCancel={handleCloseEditModal}
        footer={null}
      >
        <EditAssetCategories
          handleCloseDialog={handleCloseEditModal}
          isOpen={isOpenEditModal}
          assetCategoryData={editRow}
        />
      </Modal>
    </>
  );
};

export default AssetCategoriesList;
