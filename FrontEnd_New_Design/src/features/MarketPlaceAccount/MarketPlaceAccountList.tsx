import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { marketPlaceAccountSelector } from "../../Selectors/marketPlaceAccountSelector";
import {
  Col,
  Row,
  Table,
  Card,
  message,
  Select,
  Space,
  Button,
  Modal,
} from "antd";
import marketPlaceAccountService from "../../services/marketPlaceAccountRequest";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import AddMarketPlaceAccount from "./AddMarketPlaceAccount";
import EditMarketPlaceAccount from "./EditMarketPlaceAccount";
import { AccountTypes } from "../../Enums/LeadsConnect/BillingStatus";
import { MarketPlaceAccountEnum } from "../../Enums/MarketPlaceAccountEnum/MarketPlaceAccountEnum";

interface DataType {
  key: string;
  name: string;
  technology: string;
  status: string;
  jobSuccessrate: string;
  earning: string;
  remarks: string;
  accounts: number;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const MarketPlaceAccount = (props: Props) => {
  const { loading } = props;
  const marketPlaceAccountData = useSelector(marketPlaceAccountSelector);
  const dispatch = useDispatch();
  const [rowData, setRowData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const accountData = useSelector(marketPlaceAccountSelector);
  const [editRow, setEditRow] = useState(null);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (marketPlaceAccountData === null) {
      loading(100, false);
      dispatch<any>(marketPlaceAccountService.fetchMarketPlaceAccountList());
      loading(100, false);
    } else {
      loading(100, false);
      const rows = marketPlaceAccountData.map((item: any, index: number) => ({
        id: item.id,
        name: item.name,
        technology: item.technology,
        marketPlaceAccountsStatus: item.marketPlaceAccountsStatus,
        jobSuccessRate: item.jobSuccessRate,
        earning: item.earning,
        remarks: item.remarks,
        accounts: item.accounts,
      }));
      setRowData(rows);
      loading(100, false);
    }
  }, [dispatch, marketPlaceAccountData]);

  const getEnumNameFromValue = (
    value: number | string,
    enumObject: Record<string, any>
  ) => {
    // Convert value to number
    const numericValue =
      typeof value === "string" ? parseInt(value, 10) : value;

    const match = Object.values(enumObject).find(
      (item) => item.value === numericValue
    );

    return match ? match.name : undefined;
  };
  const onClickEditUpworkId = async (id: any) => {
    setEditRow(null);
    const response =
      await marketPlaceAccountService.fetchMarketPlaceAccountById(id);
    setIsOpenEditModal(true);
    setEditRow(response.marketPlaceAccount);
  };

  const columns = [
    {
      title: "Upwork ID Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Technology",
      dataIndex: "technology",
      key: "technology",
    },
    {
      title: "Status",
      dataIndex: "marketPlaceAccountsStatus",
      key: "marketPlaceAccountsStatus",
      render: (value: number | string) =>
        getEnumNameFromValue(value, MarketPlaceAccountEnum),
    },
    {
      title: "Job Success rate",
      dataIndex: "jobSuccessRate",
      key: "jobSuccessRate",
    },
    {
      title: "Account Types",
      dataIndex: "accounts",
      key: "accounts",
      render: (value: number | string) =>
        getEnumNameFromValue(value, AccountTypes),
    },
    {
      title: "Earning",
      dataIndex: "earning",
      key: "earning",
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
      description: "Edit Project Health",
      render: (e: any, rowData: any) => (
        <Space>
          <a href="#" onClick={() => onClickEditUpworkId(rowData.id)}>
            <EditOutlined />
          </a>
        </Space>
      ),
    },
  ];

  const handleCloseEditModal = () => {
    setIsOpenEditModal(false);
  };

  const data: DataType[] =
    marketPlaceAccountData &&
    marketPlaceAccountData.length > 0 &&
    marketPlaceAccountData.map((item: any, id: number) => {
      return {
        id: item.id,
        name: item.name,
        technology: item.technology,
        marketPlaceAccountsStatus: item.marketPlaceAccountsStatus,
        accounts: item.accounts,
        jobSuccessRate: item.jobSuccessRate,
        earning: item.earning,
        remarks: item.remarks,
      };
    });

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col span={24}>
          <div>
            <Button className="custom-btn"
              icon={<PlusOutlined />}
              type="primary"
              size="large"
              onClick={handleOpenModal}
            >
              Create Upwork Id
            </Button>
            <Modal
              style={{ textAlign: "center" }}
              open={isOpen}
              title="Create Employee"
              onCancel={handleCloseModal}
              footer={null}
            >
              <AddMarketPlaceAccount
                handleCloseDialog={handleCloseModal}
                isOpen={isOpen}
                accountData={accountData}
              />
            </Modal>
          </div>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Market Place Account List`}
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
      {editRow && (
        <Modal
         style={{ textAlign: "center" }}
          open={isOpenEditModal}
          title="Edit Upwork Id's"
          onCancel={handleCloseEditModal}
          footer={null}
        >
          <EditMarketPlaceAccount
            handleCloseDialog={handleCloseEditModal}
            isOpen={isOpenEditModal}
            accountData={editRow}
            {...props}
          />
        </Modal>
      )}
    </>
  );
};

export default MarketPlaceAccount;
