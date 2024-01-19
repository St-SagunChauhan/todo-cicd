import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import deptService from "../../services/deptRequest";
import moment from "moment";
import {
  deptSelector,
  isLoadingSelector as isLoadingDept,
} from "../../Selectors/departmentSelector";
import connectHistoryReportService from "../../services/connectHistoryRequest";
import {
  connectHistorySelector,
  isLoadingSelector,
} from "../../Selectors/connectHistorySelector";
import { IDept } from "../Department/DeptModel";
import { Card, Col, Row, Select, Table } from "antd";
import CustomSelect from "../../Components/CustomComponents/CustomSelect/CustomSelect";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";

interface RowData {
  key: string;
  departmentName: string;
  startDate: string;
  endDate: string;
  connectSubReports: ConnectSubReportResponse[];
}

interface ConnectSubReportResponse {
  employeeName: string;
  departmentName: string;
  jobUrl: string;
  connectUsed: string;
  status: string;
  upWorkId: string;
  Connect_Date: string;
  departmentId: string;
  connectId: string;
  marketingQualifiedLeads: number;
  salesQualifiedLeads: number;
  technology: string;
  dealsWon: number;
}

export default function ConnectHistoryReport() {
  const dispatch = useDispatch();
  const currentURL = window.location.href;
  const dateRef = useRef(false);
  const [startDates, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [endDates, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const loading: boolean = useSelector(isLoadingSelector);
  const loadingConnectHistory = useSelector(isLoadingSelector);
  const [show, setShow] = useState(false);
  const [selectedDept, setSelectedDept] = useState("all");

  useEffect(() => {
    dispatch<any>(connectHistoryReportService.fetchConnectHistoryReports());
    dispatch<any>(deptService.fetchDepartmentList());
  }, [dispatch]);

  const deptData = useSelector(deptSelector);
  const HistoryReport: RowData[] = useSelector(connectHistorySelector);
  const loadingDept = useSelector(isLoadingDept);

  useEffect(() => {
    if (HistoryReport?.length > 0 && !dateRef.current) {
      dateRef.current = true;
      setStartDate(moment(HistoryReport[0]?.startDate).format("YYYY-MM-DD"));
      setEndDate(moment(HistoryReport[0]?.endDate).format("YYYY-MM-DD"));
    }
  }, [HistoryReport, dateRef.current]);

  const onChangeDate = (e: any) => {
    const endDate = e.target.value;
    setEndDate(endDate);
    dispatch<any>(
      connectHistoryReportService.fetchConnectHistoryReports(
        "",
        null,
        endDate,
        startDates
      )
    );
  };

  //   const exportConnectHistoryReport = async () => {
  //     try {
  //       await connectHistoryReportService.exportConnectHistoryReport();
  //     } catch (error) {
  //       throw Error();
  //     }
  //   };

  const onChangeDept = (e: any) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    const deptFilter = dept === "all" ? null : dept;
    dispatch<any>(
      connectHistoryReportService.fetchConnectHistoryReports(
        null,
        deptFilter,
        null,
        null
      )
    );
  };

  const columns = [
    {
      title: "Profile Name",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Department Name",
      dataIndex: "departmentName",
      key: "departmentName",
    },
    {
      title: "UpWork Id",
      dataIndex: "upWorkId",
      key: "upWorkId",
    },
    {
      title: "Job-Url",
      dataIndex: "jobUrl",
      key: "jobUrl",
    },
    {
      title: "Connect Used",
      dataIndex: "connectUsed",
      key: "connectUsed",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Connect Date",
      dataIndex: "connect_Date",
      key: "connect_Date",
      renderCell: (param: any) => {
        return moment(param?.row.connect_Date).format("YYYY-MM-DD");
      },
    },
    {
      title: "Marketing Qualified Leads",
      dataIndex: "marketingQualifiedLeads",
      key: "marketingQualifiedLeads",
    },
    {
      title: "Sales Qualified Leads",
      dataIndex: "salesQualifiedLeads",
      key: "salesQualifiedLeads",
    },
    {
      title: "Deals Won",
      dataIndex: "dealsWon",
      key: "dealsWon",
    },
    {
      title: "Technology Used",
      dataIndex: "technology",
      key: "technology",
    },
  ];

  const options =
    deptData && deptData?.length > 0
      ? deptData.map((dep: IDept) => ({
          label: dep.departmentName,
          value: dep.departmentId,
        }))
      : [];

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col span={3}>
          <Select
            style={{ width: 200 }}
            placeholder="Select Department"
            allowClear
            onChange={onChangeDept}
            value={selectedDept}
            options={options}
          />
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Connect History Report`}
          >
            <div className="table-responsive">
              <SkeletonTable
                columns={columns as SkeletonTableColumnsType[]}
                active
              >
                <Table
                  columns={columns}
                  dataSource={HistoryReport}
                  size="large"
                />
              </SkeletonTable>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
