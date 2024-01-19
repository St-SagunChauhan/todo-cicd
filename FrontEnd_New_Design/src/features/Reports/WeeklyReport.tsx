import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import weeklyBillingService from "../../services/weeklyBillingRequest";
import {
  weeklyBillingSelector,
  isLoadingSelector,
} from "../../Selectors/weeklyBillingSelector";
import {
  deptSelector,
  isLoadingSelector as isLoadingDept,
} from "../../Selectors/departmentSelector";
import { IDept } from "../Department/DeptModel";
import { Col, Row, Table, Card, Select } from "antd";
import { deflate } from "zlib";
import deptService from "../../services/deptRequest";
import { ApexOptions } from "apexcharts";
import moment from "moment";
import CustomSelect from "../../Components/CustomComponents/CustomSelect/CustomSelect";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";

interface RowData {
  key: string;
  departmentName: string;
  billedHours: number;
  totalHoursBilled: number;
  weeklyBillingHours: number;
  totalTragetedHours: number;
  totalWeeklyCapacity: number;
  billingSubReports: BillingSubReport[];
  startDate: string;
  endDate: string;
  targetedHours: number;
}

interface BillingSubReport {
  billingId: string;
  projectDepartmentId: string;
  projectName: number;
  clientName: string;
  billingType: string;
  accounts: string;
  upworkId: string;
  week: string;
  startDate: string;
  endDate: string;
  billableHours: number;
  hourBilled: number;
}

export default function WeeklyBillingReport() {
  const dispatch = useDispatch();
  const dateRef = useRef(false);
  const [show, setShow] = useState(false);
  const [startDates, setStartDate] = useState("");
  const [endDates, setEndDate] = useState("");
  const loading: boolean = useSelector(isLoadingSelector);
  const loadingDept = useSelector(isLoadingDept);
  const loadingBilling = useSelector(isLoadingSelector);
  const [selectedDept, setSelectedDept] = useState("all");
  const [billedHours, setBilledHours] = useState("");
  const [tarHours, setTarHours] = useState(0);
  const [totalCap, setTotalCap] = useState("");

  React.useEffect(() => {
    dispatch<any>(weeklyBillingService.fetchWeeklyBillingReports());
    dispatch<any>(deptService.fetchDepartmentList());
  }, []);
  const deptData: any = useSelector(deptSelector);
  const weeklyData: RowData[] = useSelector(weeklyBillingSelector);

  useEffect(() => {
    if (weeklyData?.length > 0 && !dateRef.current) {
      dateRef.current = true;
      setStartDate(moment(weeklyData[0]?.startDate).format("YYYY-MM-DD"));
      setEndDate(moment(weeklyData[0]?.endDate).format("YYYY-MM-DD"));
      setBilledHours(weeklyData[0]?.billedHours.toPrecision(4));
      setTarHours(weeklyData[0]?.targetedHours);
      setTotalCap(weeklyData[0]?.totalWeeklyCapacity.toPrecision(4));
    } else if (weeklyData?.length > 0) {
      setBilledHours(weeklyData[0]?.billedHours.toPrecision(4));
      setTarHours(weeklyData[0]?.targetedHours);
      setTotalCap(weeklyData[0]?.totalWeeklyCapacity.toPrecision(4));
    } else {
      setBilledHours("0");
      setTarHours(0);
      setTotalCap("0");
    }
  }, [weeklyData, dateRef.current, billedHours, tarHours, totalCap]);

  const handleGraphClose = () => {
    setShow(false);
  };

  const onChangeDate = (value: Record<string, string>) => {
    dispatch<any>(
      weeklyBillingService.fetchWeeklyBillingReports(
        "",
        null,
        value?.endDate,
        value?.startDate,
        null
      )
    );
  };

  const chartOptions: ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: weeklyData?.map((row) => row.departmentName),
  };
  const series = weeklyData?.map((row) => row.totalWeeklyCapacity);

  const onChangeDept = (e: any) => {
    const dept = e.target.value;
    if (dept === "all") {
      dispatch<any>(weeklyBillingService.fetchWeeklyBillingReports());
    } else {
      setSelectedDept(dept);
      const deptFilter = dept === "all" ? null : dept;
      dispatch<any>(
        weeklyBillingService.fetchWeeklyBillingReports(
          null,
          deptFilter,
          null,
          null,
          null
        )
      );
      if (weeklyData === null) {
        setBilledHours("0");
        setTarHours(0);
        setTotalCap("0");
      } else {
        setBilledHours(weeklyData[0].billedHours.toPrecision(4));
        setTarHours(weeklyData[0].targetedHours);
        setTotalCap(weeklyData[0].totalWeeklyCapacity.toPrecision(4));
      }
    }
  };

  const columns = [
    {
      title: "Department Name",
      dataIndex: "departmentName",
      key: "departmentName",
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Weekly-Hours",
      dataIndex: "weeklyBillingHours",
      key: "weeklyBillingHours",
    },
    {
      title: "Billing Type",
      dataIndex: "billingType",
      key: "billingType",
    },
    {
      title: "Billed Hours",
      dataIndex: "totalHoursBilled",
      key: "totalHoursBilled",
    },
    {
      title: "Billed Minutes",
      dataIndex: "totalMinutesBilled",
      key: "totalMinutesBilled",
    },
    {
      title: "Upwork Id",
      dataIndex: "upworkId",
      key: "upworkId",
    },
    {
      title: "Account",
      dataIndex: "account",
      key: "account",
    },
  ];

  const options =
    deptData && deptData?.length > 0
      ? deptData.map((dep: IDept) => ({
          label: dep.departmentName,
          value: dep.departmentId,
        }))
      : [];

  const rows = weeklyData?.map((item, i) => ({ ...item, id: i + 1 })) || [];

  // const data: RowData[] =
  //   weeklyData &&
  //   weeklyData.length >= 0 &&
  //   weeklyData.map((data: any, id: number) => {
  //     return {
  //       key: data.billingId,
  //     };
  //   });

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col span={3}>
          <Select
            style={{ width: 200 }}
            placeholder="Select Department"
            onChange={onChangeDept}
            options={options}
            value={selectedDept}
          />
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Weekly Billing Report`}
          >
            <div className="table-responsive">
              <SkeletonTable
                columns={columns as SkeletonTableColumnsType[]}
                active
              >
                <Table columns={columns} dataSource={weeklyData} size="large" />
              </SkeletonTable>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
