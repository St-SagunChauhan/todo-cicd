import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  assetSelector,
  isLoadingSelector,
} from "../../../Selectors/assetSelector";
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
import assetsService from "../../../services/assetsService";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import SkeletonTable from "../../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../../Layout/SkeletonTable/SkeletonTable";
import AddAsset from "./AddAsset";
import { useNavigate } from "react-router-dom";
import EditAsset from "./EditAsset";

interface DataType {
  key: string;
  assetId: string;
  assetName: string;
  quantity: number | null;
  purchasedDate: string;
  modelNumber: string;
  remarks: string;
  manufacturerName: string;
  isActive: string;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const AssetList = (props: Props) => {
  const { loading } = props;
  const navigate = useNavigate();
  const assetData = useSelector(assetSelector);
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
    dispatch<any>(assetsService.fetchAssetsList());
    loading(100, false);
  }, []);

  const onClickEditAsset = async (
    assetId: any,
    assetName: string,
    quantity: number,
    manufacturerName: string,
    purchasedDate: string,
    modelNumber: string,
    remarks: string
  ) => {
    setEditRow({
      id: assetId,
      name: assetName,
      quantity: quantity,
      manufacturerName: manufacturerName,
      purchasedDate: purchasedDate,
      modelNumber: modelNumber,
      remarks: remarks,
    });

    const response = await assetsService.getAssetById(assetId);

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
      title: "Manufacturer Name",
      dataIndex: "manufacturerName",
      key: "manufacturerName",
    },
    {
      title: "Serial/Model Number",
      dataIndex: "modelNumber",
      key: "modelNumber",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
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
                rowData.assetId,
                rowData.assetName,
                rowData.quantity,
                rowData.manufacturerName,
                rowData.purchasedDate,
                rowData.modelNumber,
                rowData.remarks
              );
            }}
          >
            <EditOutlined />
          </a>
        </Space>
      ),
    },
  ];

  const data: DataType[] =
    assetData &&
    assetData.length >= 0 &&
    assetData.map((data: any, id: number) => {
      return {
        assetId: data.assetId,
        assetName: data.assetName,
        quantity: data.quantity,
        modelNumber: data.modelNumber,
        manufacturerName: data.manufacturerName,
        remarks: data.remarks,
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
            Add Asset
          </Button>
          <Modal
            style={{ textAlign: "center" }}
            open={isOpen}
            title="Add Asset"
            onCancel={handleCloseModal}
            footer={null}
          >
            <AddAsset
              handleCloseDialog={handleCloseModal}
              isOpen={isOpen}
              assetData={assetData}
            />
          </Modal>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Asset List`}
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
        title="Edit Asset Details"
        onCancel={handleCloseEditModal}
        footer={null}
      >
        <EditAsset
          handleCloseDialog={handleCloseEditModal}
          isOpen={isOpenEditModal}
          assetData={editRow}
        />
      </Modal>
    </>
  );
};

export default AssetList;
