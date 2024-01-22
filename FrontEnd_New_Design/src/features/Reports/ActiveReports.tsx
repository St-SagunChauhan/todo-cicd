import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import reportService from "../../services/reportRequest";
import {
  reportSelector,
  isReportLoadingSelector,
} from "../../Selectors/reportSelector";
import { deptSelector } from "../../Selectors/departmentSelector";
import { IDept } from "../Department/DeptModel";
import { Col, Row, Table, Card, Select, DatePicker } from "antd";
import deptService from "../../services/deptRequest";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";
import moment from "moment";
import { contractStatusSelector } from "../../Selectors/contractStatusSelector";
import { IContractStatus } from "../../models/IContractStatusState";
import {
  ExclamationCircleOutlined,
  LikeOutlined,
  WarningOutlined,
} from "@ant-design/icons";
interface DataType {
  key: string;
  projectDepartments: ProjectReports[];
}
interface ProjectReports {
  projectDepId: string;
  departmentId: string;
  departmentName: string;
  clientId: string;
  clientName: string;
  projectHealthRate: number;
  country: string;
  projectId: string;
  accounts: string;
  contractName: string;
  contractType: string;
  hoursPerWeek: string;
  billingType: string;
  status: string;
}
interface Props {
  loading: (flag: boolean) => void;
}
export default function ActiveReports({ loading }: Props) {
  const dispatch = useDispatch();
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedDates, setSelectedDates] = useState<[any, any]>([null, null]);
  const [selectedContractType, setContractType] = useState("All");
  const report = useSelector(reportSelector);
  const loadingReport: boolean = useSelector(isReportLoadingSelector);
  const deptData = useSelector(deptSelector);
  const contractStatusData: any = useSelector(contractStatusSelector);
  useEffect(() => {
    dispatch<any>(deptService.fetchDepartmentList());
    dispatch<any>(reportService.fetchContractStatus());
    dispatch<any>(reportService.fetchReports());
  }, [dispatch]);
  useEffect(() => {
    if (!loadingReport) {
      loading(false);
    }
  }, [loadingReport, loading]);
  const onChangeDept = (dept: any) => {
    setSelectedDept(dept);
    dispatch<any>(
      reportService.fetchReports(
        dept === "All" ? null : dept,
        selectedContractType,
        selectedDates[0],
        selectedDates[1]
      )
    );
  };

  const onChangeDate = (dates: any, dateStrings: [any, any]) => {
    setSelectedDates(dateStrings);

    const [startDate, endDate] = dateStrings;
    if (startDate === null && endDate === null) {
      setSelectedDates([null, null]);
      dispatch<any>(
        reportService.fetchReports(
          selectedDept === "All" ? null : selectedDept,
          selectedContractType === "All" ? null : selectedContractType,
          null,
          null
        )
      );
    } else {
      dispatch<any>(
        reportService.fetchReports(
          selectedDept === "All" ? null : selectedDept,
          selectedContractType === "All" ? null : selectedContractType,
          startDate === "" ? null : startDate,
          endDate === "" ? null : endDate
        )
      );
    }
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
  const contractTypeOptions = [
    { label: "All", value: "All" },
    ...(contractStatusData && contractStatusData?.length > 0
      ? contractStatusData.map((status: IContractStatus) => ({
          label: status.contractStatusName,
          value: status.contractStatusName,
        }))
      : []),
  ];
  const onChangeContractType = (event: any) => {
    if (event !== undefined) {
      setContractType(event);

      dispatch<any>(
        reportService.fetchReports(
          selectedDept,
          event === "All" ? null : event,
          selectedDates[0],
          selectedDates[1]
        )
      );
    }
  };
  const columns = [
    {
      title: "Contract Name",
      dataIndex: "contractName",
      key: "contractName",
    },
    {
      title: "UpWork Id",
      dataIndex: "upWorkId",
      key: "upWorkId",
    },
    {
      title: "Accounts",
      dataIndex: "accounts",
      key: "accounts",
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Project Health",
      dataIndex: "projectHealthRate",
      key: "projectHealthRate",
      render: (e: any, param: any) => {
        if (param.projectHealthRate === 1) {
          return (
            <Card
              style={{
                backgroundColor: "#35ad58",
                width: "50px",
                height: "50px",
                textAlign: "center",
                color: "#ffffff",
                fontWeight: "bold",
                paddingTop: "15px",
                borderRadius: "50px",
              }}
            >
              <LikeOutlined
                style={{ fontSize: "26px", transform: "translate(0px, -5px)" }}
              />
            </Card>
          );
        }
        if (param.projectHealthRate === 2) {
          return (
            <Card
              style={{
                backgroundColor: "#e0d312",
                width: "50px",
                height: "50px",
                textAlign: "center",
                color: "#ffffff",
                fontWeight: "bold",
                paddingTop: "15px",
                borderRadius: "50px",
              }}
            >
              <WarningOutlined
                style={{ fontSize: "26px", transform: "translate(0px, -5px)" }}
              />
            </Card>
          );
        }
        if (param.projectHealthRate === 3) {
          return (
            <Card
              style={{
                backgroundColor: "#ec0e0e",
                width: "50px",
                height: "50px",
                textAlign: "center",
                color: "#ffffff",
                fontWeight: "bold",
                borderRadius: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ExclamationCircleOutlined
                style={{ fontSize: "30px", transform: "translate(0px, 0px)" }}
              />
            </Card>
          );
        }
      },
    },
    {
      title: "Department(s)",
      dataIndex: "departmentName",
      key: "departmentName",
    },
    {
      title: "Employee(s)",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Weekly Hours",
      dataIndex: "hoursPerWeek",
      key: "hoursPerWeek",
    },
    {
      title: "Contract Type",
      dataIndex: "contractType",
      key: "contractType",
    },
    {
      title: "Communication Mode",
      dataIndex: "communication",
      key: "communication",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: moment.MomentInput) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Billing Type",
      dataIndex: "billingType",
      key: "billingType",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
  ];
  const data: DataType[] =
    report &&
    report.length >= 0 &&
    report.map((data: any, id: number) => {
      return {
        key: data.projectId,
        accounts: data.accounts,
        upWorkId: data.upWorkId,
        contractName: data.contractName,
        clientName: data.clientName,
        projectHealthRate: data.projectHealthRate,
        departmentName: data.departmentName,
        startDate: data.startDate,
        employeeName: data.employeeName,
        hoursPerWeek: data.hoursPerWeek,
        contractType: data.contractType,
        communication: data.communication,
        billingType: data.billingType,
        country: data.country,
      };
    });
  return (
    <>
      <Row
        className="projects-reports"
        gutter={[16, 16]}
        style={{ marginTop: "10px" }}
      >
        <Col title="Date Filter">
          <DatePicker.RangePicker
            onChange={onChangeDate}
            format="YYYY-MM-DD"
            placeholder={["Start Date", "End Date"]}
          />
        </Col>
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
        <Col span={3}>
          <Select
            style={{ width: "100%" }}
            placeholder="Contract Type"
            allowClear
            onChange={onChangeContractType}
            value={selectedContractType}
            options={contractTypeOptions}
          />
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Project Reports`}
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
