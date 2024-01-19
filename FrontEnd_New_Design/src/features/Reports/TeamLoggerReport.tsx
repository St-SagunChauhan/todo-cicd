import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import teamLoggerServices from "../../services/teamLoggerRequest";
import {
  teamLoggerSelector,
  isLoadingSelector as isLoadingTeamLoggerSelector,
} from "../../Selectors/teamLoggerSelector";
import { roleSelector } from "../../Selectors/authSelector";
import { USER_ROLE } from "../../Config";
import {
  deptSelector,
  isLoadingSelector as isLoadingDept,
} from "../../Selectors/departmentSelector";
import { IDept } from "../Department/DeptModel";
import moment from "moment";
import { Card, Col, DatePicker, Row, Select, Table } from "antd";
import CustomSelect from "../../Components/CustomComponents/CustomSelect/CustomSelect";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";

export default function TeamLoggerReport() {
  const [fileList, setFileList] = useState<FileList | null>(null);
  const dispatch = useDispatch();
  const role = useSelector(roleSelector);
  const loadingDept = useSelector(isLoadingDept);
  const [selectedDept, setSelectedDept] = useState("all");
  useSelector(isLoadingTeamLoggerSelector);
  const loading: any = useSelector(isLoadingTeamLoggerSelector);
  // const [teamLoggerData, setteamLoggerData] = useState();
  const deptData = useSelector(deptSelector);
  const teamLoggerData = useSelector(teamLoggerSelector);
  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.HR;
  const [startDates, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Timer",
      dataIndex: "timer",
      key: "timer",
    },
    {
      title: "Manual",
      dataIndex: "manual",
      key: "manual",
    },
    {
      title: "Inactive",
      dataIndex: "inactive",
      key: "inactive",
    },
    {
      title: "Start Day",
      dataIndex: "startDay",
      key: "startDay",
    },
    {
      title: "Next Day",
      dataIndex: "nextDay",
      key: "nextDay",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Record Date",
      dataIndex: "recordDate",
      key: "recordDate",
    },
  ];
  useEffect(() => {
    dispatch<any>(teamLoggerServices.fetchFiltredData());
  }, []);

  //   const handelDownload = async () => {
  //     try {
  //       await teamLoggerServices.downloadTeamloggerSampleExcel();
  //     } catch (error) {
  //       throw Error();
  //     }
  //   };

  const onChangeDept = (e: any) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    dispatch<any>(teamLoggerServices.fetchFiltredData(dept));
  };

  const onChangeStartDate = (e: any) => {
    const startDate = e.target.value;
    setStartDate(startDate);

    const dayOfWeek = 5;
    const date = new Date(startDate);
    const diff = date.getDay() - dayOfWeek;
    if (diff > 0) {
      date.setDate(date.getDate() + 6);
    } else if (diff < 0) {
      date.setDate(date.getDate() + -1 * diff);
    }
    dispatch<any>(teamLoggerServices.fetchFiltredData(null, startDate));
  };

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
            style={{ width: "100%", maxWidth: "200px", height: "40px" }}
            placeholder="Select Department"
            allowClear
            onChange={onChangeDept}
            value={selectedDept}
            options={options}
          />
        </Col>
        <Col span={3}>
          <DatePicker
            onChange={onChangeStartDate}
            style={{ width: "100%", height: "40px" }}
          />
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Team Logger Report`}
          >
            <div className="table-responsive">
              <SkeletonTable
                columns={columns as SkeletonTableColumnsType[]}
                active
              >
                <Table
                  columns={columns}
                  dataSource={teamLoggerData}
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
