import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bidReportsSelector } from "../../Selectors/bidReportSelector";
import { Col, Row, Table, Card } from "antd";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";
import authService from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import weeklyJobReportService from "../../services/bidReportsRequest";

interface DataType {
  employeeName?: string;
  totalApplied?: string;
  totalLeads?: string;
  totalHired?: string;
  totalConnectUsed?: string;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const BidReportList = (props: Props) => {
  const { loading } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [bidRow, setBidRow] = useState(null);
  const btnRole = authService.getRole();
  const [rowData, setRowData] = useState(null);

  const handleCloseEditModal = () => {
    setIsOpenEditModal(false);
  };
  const bidReportsData = useSelector(bidReportsSelector);
  const loggedInUser = JSON.parse(authService.getUser());

  useEffect(() => {
    if (bidReportsData === null) {
      loading(20, false);
      dispatch<any>(weeklyJobReportService.fetchWeeklyJobReports());
      loading(100, false);
    } else {
      loading(100, false);
      const rows = bidReportsData.map((bidreport: any, index: number) => ({
        bidId: bidreport.bidId,
        employeeName: bidreport.employeeName,
        totalApplied: bidreport.totalApplied,
        totalLeads: bidreport.totalLeads,
        totalHired: bidreport.totalHired,
        totalConnectUsed: bidreport.totalConnectUsed,
      }));
      setRowData(rows);
      loading(100, false);
    }
  }, [bidReportsData, bidReportsData]);

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Total Applied",
      dataIndex: "totalApplied",
      key: "totalApplied",
    },
    {
      title: "Total Leads",
      dataIndex: "totalLeads",
      key: "totalLeads",
    },
    {
      title: "Total Hired",
      dataIndex: "totalHired",
      key: "totalHired",
    },
    {
      title: "Total Connect Used",
      dataIndex: "totalConnectUsed",
      key: "totalConnectUsed",
    },
  ];

  const data: DataType[] =
    bidReportsData &&
    bidReportsData.length > 0 &&
    bidReportsData.map((data: any, id: number) => {
      return {
        bidId: data.bidId,
        employeeName: data.employeeName,
        totalApplied: data.totalApplied,
        totalLeads: data.totalApplied,
        totalHired: data.totalHired,
        totalConnectUsed: data.totalConnectUsed,
      };
    });

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Job Reports`}
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
    </>
  );
};

export default BidReportList;
