import { useEffect, useState } from "react";
import { Col, Row, Card, Select, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deptSelector } from "../../Selectors/departmentSelector";
import { IDept } from "../Department/DeptModel";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";
import {
  reportSelector,
  isReportLoadingSelector,
} from "../../Selectors/reportSelector";
import deptService from "../../services/deptRequest";
import reportService from "../../services/reportRequest";
import { contractStatusSelector } from "../../Selectors/contractStatusSelector";
import moment from "moment";
import { IContractStatus } from "../../models/IContractStatusState";
interface Props {
  loading: (flag: boolean) => void;
}
export default function ClientReport({ loading }: Props) {
  const dispatch = useDispatch();
  const deptData: any = useSelector(deptSelector);
  const contractStatusData: any = useSelector(contractStatusSelector);
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedContractStatus, setContractStatus] = useState("All");
  const report = useSelector(reportSelector);
  const loadingReport = useSelector(isReportLoadingSelector);
  useEffect(() => {
    dispatch<any>(deptService.fetchDepartmentList());
    dispatch<any>(reportService.fetchContractStatus());
    dispatch<any>(reportService.fetchClientReports());
  }, [dispatch]);
  useEffect(() => {
    if (!loadingReport) {
      loading(false);
    }
  }, [loadingReport, loading]);
  const onChangeDept = (dept: any) => {
    setSelectedDept(dept);

    dispatch<any>(
      reportService.fetchClientReports(
        dept === "All" ? null : dept,
        selectedContractStatus
      )
    );
  };
  const options = [
    { label: "All", value: "All" },
    ...(deptData
      ? deptData.map((dept: IDept) => ({
          label: dept.departmentName,
          value: dept.departmentId,
        }))
      : []),
  ];
  const onChangeContractType = (event: any) => {
    if (event !== undefined) {
      setContractStatus(event);

      dispatch<any>(
        reportService.fetchClientReports(selectedDept, event === "All" ? null : event)
      );
    }
  };
  const contractTypeOptions = [
    { label: "All", value: "All" },
    ...(contractStatusData && contractStatusData?.length > 0
      ? contractStatusData.map((status: IContractStatus) => ({
          label: status.contractStatusName,
          value: status.contractStatusName,
        }))
      : []),
  ];
  const columns = [
    {
      title: "Upwork ID",
      dataIndex: "upWorkId",
      key: "upWorkId",
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Contract Name",
      dataIndex: "contractName",
      key: "contractName",
    },
    {
      title: "Contract Type",
      dataIndex: "contractType",
      key: "contractType",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: moment.MomentInput) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Department Name",
      dataIndex: "departmentName",
      key: "departmentName",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
  ];

  interface ClientReports {
    upWorkId: string;
    clientName: string;
    contractName: string;
    contractType: string;
    startDate: string;
    departmentName: string;
    country: string;
  }
  interface DataType {
    key: string;
    clientReports: ClientReports[];
  }
  const data: DataType[] =
    report &&
    report.length >= 0 &&
    report.map((data: any) => {
      return {
        key: data.projectId,
        upWorkId: data.upWorkId,
        accounts: data.accounts,
        clientName: data.clientName,
        contractName: data.contractName,
        contractType: data.contractType,
        startDate: data.startDate,
        departmentName: data.departmentName,
        country: data.country,
      };
    });
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col span={3}>
          <Select
            style={{ width: "100%" }}
            placeholder="Select Department"
            allowClear
            onChange={onChangeDept}
            value={selectedDept}
            options={options}
          />
        </Col>
        {/* <Col span={3}>
          <Select
            style={{ width: "100%" }}
            placeholder="Contract Type"
            allowClear
            onChange={onChangeContractType}
            value={selectedContractStatus}
            options={contractTypeOptions}
          />
        </Col> */}
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Client Reports`}
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
}
