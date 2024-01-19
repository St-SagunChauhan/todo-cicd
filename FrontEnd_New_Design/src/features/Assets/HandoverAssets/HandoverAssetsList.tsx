import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handoverAssetSelector,
  isLoadingSelector,
} from "../../../Selectors/handoverAssetSelector";
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
import handoverassetsService from "../../../services/assetHandoverService";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import SkeletonTable from "../../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../../Layout/SkeletonTable/SkeletonTable";
import AddHandoverAssets from "./AddHandoverAssets";
import { useNavigate } from "react-router-dom";
import EditHandoverAssets from "./EditHandoverAssets";

interface DataType {
  key: string;
  categoryId: string;
  assetName: string;
  quantity: string;
  assignedTo: string;
  inStockAsset: string;
  handoverStatus: string;
  assignedDate: string;
  identificationNumber: string;
  //   isActive: string;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const HandoverAssetList = (props: Props) => {
  const { loading } = props;
  const navigate = useNavigate();
  const assetHandoverData = useSelector(handoverAssetSelector);
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
    dispatch<any>(handoverassetsService.fetchAssetsHadnoverList());
    loading(100, false);
  }, []);

  const onClickEditAsset = async (
    handoverId: any,
    assetName: string,
    employeeId: string,
    assignedDate: string,
    identificationNumber: string
  ) => {
    setEditRow({
      id: handoverId,
      name: assetName,
      employeeId: employeeId,
      assignedDate: assignedDate,
      identificationNumber: identificationNumber,
    });

    const response = await handoverassetsService.getHandoverAssetById(
      handoverId
    );

    setIsOpenEditModal(true);
    // setEditRow(response?.data.assetResult);
  };
  const columns = [
    {
      title: "Asset Name",
      dataIndex: "assetName",
      key: "assetName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
    },
    {
      title: "In Stock Asset",
      dataIndex: "inStockAsset",
      key: "inStockAsset",
    },
    {
      title: "Handover Status",
      dataIndex: "handoverStatus",
      key: "handoverStatus",
    },
    {
      title: "Assigned Date",
      dataIndex: "assignedDate",
      key: "assignedDate",
    },
    {
      title: "Identification Number",
      dataIndex: "identificationNumber",
      key: "identificationNumber",
    },
    // {
    //   render: (rowData: any) => {
    //     return rowData.isActive ? "InActive" : "Active";
    //   },
    //   title: "Is Active",
    //   dataIndex: "isActive",
    //   key: "isActive",
    // },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      description: "Edit and Remove Asset",
      render: (e: any, rowData: any) => (
        <Space>
          <a
            href="#"
            onClick={() => {
              onClickEditAsset(
                rowData.handoverId,
                rowData.assetName,
                rowData.employeeId,
                rowData.assignedDate,
                rowData.identificationNumber
              );
            }}
          >
            <EditOutlined />
          </a>
          <Popconfirm
            title="Are you sure you want to delete this handover Asset?"
            onConfirm={async () => {
              const assetHandoverId = rowData.assetHandoverId;
              const response = await handoverassetsService.deleteHandoverAsset(
                assetHandoverId
              );
              if (response.status === 200) {
                message.success(response.data.message);
                dispatch<any>(handoverassetsService.fetchAssetsHadnoverList());
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
    assetHandoverData &&
    assetHandoverData.length >= 0 &&
    assetHandoverData.map((data: any, id: number) => {
      return {
        handoverId: data.handoverId,
        categoryName: data.categoryName,
        assetName: data.assetName,
        identificationNumber: data.identificationNumber,
        quantity: data.quantity,
        inStockAsset: data.inStockAsset,
        assignedTo: data.assignedTo,
        assignedDate: data.assignedDate,
        handoverStatus: data.handoverStatus,
        remarks: data.remarks,
        isActive: data.isActive,
      };
    });

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col span={24} style={{ display: "flex", justifyContent: "end" }}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            size="large"
            onClick={handleOpenModal}
          >
            Add Handover Asset
          </Button>
          <Modal
            open={isOpen}
            title="Add Handover Assets"
            onCancel={handleCloseModal}
            footer={null}
          >
            <AddHandoverAssets
              handleCloseDialog={handleCloseModal}
              isOpen={isOpen}
              assetHandoverData={assetHandoverData}
            />
          </Modal>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Handover Assets`}
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
        title="Edit Handover Assets"
        onCancel={handleCloseEditModal}
        footer={null}
      >
        <EditHandoverAssets
          handleCloseDialog={handleCloseEditModal}
          isOpen={isOpenEditModal}
          assetHandoverData={editRow}
        />
      </Modal>
    </>
  );
};

export default HandoverAssetList;
