import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clientSelector } from "../../Selectors/clientSelector";
import { Col, Row, Table, Card, message, Space, Modal, Tooltip } from "antd";
import clientService from "../../services/clientRequest";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";
import { EditOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import EditClient from "./EditClient";
import { AccountTypes } from "../../Enums/LeadsConnect/BillingStatus";
import { countries } from "../../Helper/countries";
import moment from "moment";
interface DataType {
  key: string;
  clientName: string;
  clientEmail?: string;
  contactNo?: string;
  bidId: string;
  departmentId: string;
  marketPlaceAccountId: string;
  communicationId: string;
  accountType: string;
  country?: string;
  amountSpent: string;
  lastFollowUpRemark?: string;
  lastFollowUpDate?: string;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const ClientList = (props: Props) => {
  const { loading } = props;
  const clientData = useSelector(clientSelector);
  const dispatch = useDispatch();
  const [rowData, setRowData] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [copiedRowIndex, setCopiedRowIndex] = useState<number | null>(null);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  useEffect(() => {
    if (clientData === null) {
      loading(100, false);
      dispatch<any>(clientService.fetchClientList());
      loading(100, false);
    } else {
      loading(100, false);
      const rows = clientData.map((client: any, index: number) => ({
        id: index,
        clientId: client.clientId,
        bidId: client.bidId,
        clientName: client.clientName,
        clientEmail: client.clientEmail,
        contactNo: client.contactNo,
        departmentId: client.departmentId,
        marketPlaceAccountId: client.marketPlaceAccountId,
        accountType: client.accountType,
        country: client.country,
        lastFollowUpRemark: client.lastFollowUpRemark,
        communicationId: client.communicationId,
        communicationName: client.communicationName,
        lastFollowUpDate: client.lastFollowUpDate,
      }));
      setRowData(rows);
      loading(100, false);
    }
  }, [dispatch, clientData]);

  const handleCopyToClipboard = (text: string, rowIndex: number) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setCopiedRowIndex(rowIndex);
    message.success("issue copied to clipboard");
    setTimeout(() => {
      setCopiedRowIndex(null);
    }, 3000); // Reset copiedRowIndex state after 3 seconds
  };

  const columns = [
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Client Email",
      dataIndex: "clientEmail",
      key: "clientEmail",
    },
    {
      title: "Mobile Number",
      dataIndex: "contactNo",
      key: "contactNo",
    },
    {
      title: "Upwork Hired profile",
      dataIndex: "marketplaceName",
      key: "marketplaceName",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (e: any, item: any) => {
        const countryData = countries.find(
          (country: any) => country.code === item.country
        );
        return countryData ? countryData.label : e;
      },
    },
    {
      title: "Remarks",
      dataIndex: "lastFollowUpRemark",
      key: "lastFollowUpRemark",
      render: (lastFollowUpRemark: string, record: any, rowIndex: number) => (
        <span
          style={{
            cursor: "pointer",
            maxHeight: "none",
            width: "100%",
            maxWidth: "240px",
          }}
          onClick={() => handleCopyToClipboard(lastFollowUpRemark, rowIndex)}
        >
          <Tooltip
            overlayStyle={{
              position: "fixed",
              overflow: "auto",
              maxHeight: "160px",
            }}
            placement="topLeft"
            title={copiedRowIndex === rowIndex ? "Copied!" : lastFollowUpRemark}
            trigger="hover"
          >
            <span>
              {lastFollowUpRemark}{" "}
              {copiedRowIndex === rowIndex && (
                <CheckCircleTwoTone twoToneColor="#52c41a" />
              )}
            </span>
          </Tooltip>
        </span>
      ),
    },
    {
      title: "Last Follow Up Date",
      dataIndex: "lastFollowUpDate",
      key: "lastFollowUpDate",
      render: (date: moment.MomentInput) => moment(date).format("DD MMMM YYYY"),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      description: "Edit Project Health",
      render: (e: any, rowData: any) => (
        <Space>
          <a href="#" onClick={() => onClickEditClient(rowData.clientId)}>
            <EditOutlined />
          </a>
        </Space>
      ),
    },
  ];
  const data: DataType[] =
    clientData &&
    clientData.length > 0 &&
    clientData.map((data: any, id: number) => {
      return {
        clientId: data.clientId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        contactNo: data.contactNo,
        departmentId: data.departmentId,
        marketplaceName: data.marketplaceName,
        marketPlaceAccountId: data.marketPlaceAccountId,
        accounts: data.accounts,
        country: data.country,
        lastFollowUpRemark: data.lastFollowUpRemark,
        communicationId: data.communicationId,
        communicationName: data.communicationName,
        lastFollowUpDate: data.lastFollowUpDate,
      };
    });
  const onClickEditClient = async (clientId: any) => {
    setEditRow(null);
    const response = await clientService.fetchClientById(clientId);

    const clientAccount =
      Object.values(AccountTypes).find(
        (rate: any) => rate.value === response?.data.client.accounts
      )?.name || null;
    setIsOpenEditModal(true);
    setEditRow({
      ...response?.data.client,
      accounts: clientAccount,
    });
  };
  const handleCloseEditModal = () => {
    setIsOpenEditModal(false);
  };
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Client List`}
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
          className="text-center"
          open={isOpenEditModal}
          title="Edit Client"
          onCancel={handleCloseEditModal}
          footer={null}
        >
          <EditClient
            handleCloseDialog={handleCloseEditModal}
            isOpen={isOpenEditModal}
            clientData={editRow}
          />
        </Modal>
      )}
    </>
  );
};

export default ClientList;
