import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import eodReportService from "../../services/eodReportRequest";
import {
  eodReportSelector,
  isLoadingSelector,
} from "../../Selectors/eodReportSelector";
import {
  deptSelector,
  isLoadingSelector as isLoadingDept,
} from "../../Selectors/departmentSelector";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { IDept } from "../Department/DeptModel";
import {
  Col,
  Row,
  Table,
  Card,
  Select,
  Button,
  Modal,
  Space,
  DatePicker,
} from "antd";
import { deflate } from "zlib";
import deptService from "../../services/deptRequest";
import { ApexOptions } from "apexcharts";
import moment from "moment";
import CustomSelect from "../../Components/CustomComponents/CustomSelect/CustomSelect";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";
import AddEODREport from "./AddEODReport";
import authService from "../../services/authServices";
import { ColumnType } from "antd/es/table";
import { USER_ROLE } from "../../Config";
import { RoleEnum } from "../Employee/EmployeeModel";
import EditEODReport from "./EditEODReport";
interface RowData {
  employeeName: string;
  contractName: string;
  billingHours: number;
  employeeDelightHours: number;
  unbilledHours: number;
  isActive: boolean;
  projectHours: any;
  eodDate: any;
  remarks: any;
  role: string;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
}

export default function EODReport(props: Props) {
  const { loading } = props;
  const dispatch = useDispatch();
  const dateRef = useRef(false);
  const [show, setShow] = useState(false);
  const [startDates, setStartDate] = useState("");
  const [endDates, setEndDate] = useState("");
  //   const loading: boolean = useSelector(isLoadingSelector);
  const loadingDept = useSelector(isLoadingDept);
  const loadingBilling = useSelector(isLoadingSelector);
  const [selectedDept, setSelectedDept] = useState("All");
  const [billedHours, setBilledHours] = useState("");
  const [tarHours, setTarHours] = useState(0);
  const [totalCap, setTotalCap] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  React.useEffect(() => {
    loading(100, false);
    dispatch<any>(eodReportService.fetchEodReportList());
    dispatch<any>(deptService.fetchDepartmentList());
    loading(100, false);
  }, []);
  const deptData: any = useSelector(deptSelector);
  const eodData: RowData[] = useSelector(eodReportSelector);

  useEffect(() => {
    if (eodData?.length > 0 && !dateRef.current) {
      dateRef.current = true;
      //   setStartDate(moment(eodData[0]?.startDate).format("YYYY-MM-DD"));
      //   setEndDate(moment(eodData[0]?.endDate).format("YYYY-MM-DD"));
      //   setBilledHours(eodData[0]?.billedHours.toPrecision(4));
      //   setTarHours(eodData[0]?.targetedHours);
      //   setTotalCap(eodData[0]?.totalWeeklyCapacity.toPrecision(4));
    } else if (eodData?.length > 0) {
      //   setBilledHours(eodData[0]?.billedHours.toPrecision(4));
      //   setTarHours(eodData[0]?.targetedHours);
      //   setTotalCap(eodData[0]?.totalWeeklyCapacity.toPrecision(4));
    } else {
      setBilledHours("0");
      setTarHours(0);
      setTotalCap("0");
    }
  }, [eodData, dateRef.current, billedHours, tarHours, totalCap]);

  //   const onChangeDate = (value: Record<string, string>) => {
  //     dispatch<any>(
  //       eodReportService.fetchEodReportList(
  //         "",
  //         null,
  //         value?.endDate,
  //     );
  //   };

  //   const series = eodData?.map((row) => row.totalWeeklyCapacity);
  //   console.log(series);

  const onChangeDept = (e: any) => {
    const dept = e.target.value;
    if (dept === "all") {
      dispatch<any>(eodReportService.fetchEodReportList());
    } else {
      setSelectedDept(dept);
      const deptFilter = dept === "all" ? null : dept;
      dispatch<any>(
        eodReportService.fetchEodReportList(null, deptFilter, null)
      );
    }
  };

  const onClickEditEOD = async (Id: any) => {
    setEditRow(null);
    const response = await eodReportService.fetchEodById(Id);

    response.data.eodReport.projectHours = JSON.parse(
      response?.data.eodReport.projectHours
    );

    setIsOpenEditModal(true);
    setEditRow(response?.data.eodReport);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      width: "20%",
    },
    {
      title: "Project Name",
      dataIndex: "projectHours",
      key: "projectHours",
      width: "30%",
      render: (projectHours: any) => (
        <>
          {projectHours.map((project: any, index: number) => (
            <span style={{ display: "block" }} key={index}>
              {project.projectName}
            </span>
          ))}
        </>
      ),
    },
    {
      title: "Project Billing",
      dataIndex: "projectHours",
      key: "projectHours",
      width: "30%",
      render: (projectHours: any) => (
        <>
          {projectHours.map((project: any, index: number) => (
            <span style={{ display: "block" }} key={index}>
              {project.billingHours}
            </span>
          ))}
        </>
      ),
    },
    {
      title: "Delight Hours",
      dataIndex: "projectHours",
      key: "projectHours",
      width: "30%",
      render: (projectHours: any) => (
        <>
          {projectHours.map((project: any, index: number) => (
            <span style={{ display: "block" }} key={index}>
              {project.employeeDelightHours}
            </span>
          ))}
        </>
      ),
    },
    {
      title: "Eod Date",
      dataIndex: "eodDate",
      key: "eodDate",
      render: (eodDate: string) =>
        eodDate ? moment(eodDate).format("YYYY-MM-DD") : "N/A",
      // render: (e: any, param: any) => {
      //   const date = param?.eodDate.split("T");
      //   return date[0];
      // },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      width: 150,
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      description: "Edit and Remove Expense Category",
      render: (e: any, rowData: any) => (
        <Space>
          {loggedInUser && loggedInUser.employeeId === rowData.employeeId && (
            <a href="#" onClick={() => onClickEditEOD(rowData.eodReportId)}>
              <EditOutlined />
            </a>
          )}
        </Space>
      ),
    },
  ];

  const options =
    deptData && deptData?.length > 0
      ? deptData.map((dep: IDept) => ({
          label: dep.departmentName,
          value: dep.departmentId,
        }))
      : [];

  const [selectedDates, setSelectedDates] = useState<[any, any]>([null, null]);

  const onChangeDate = (dates: any, dateStrings: [any, any]) => {
    setSelectedDates(dateStrings);

    const [startDate, endDate] = dateStrings;
    if (startDate === null && endDate === null) {
      setSelectedDates([null, null]);
      dispatch<any>(eodReportService.fetchEodReportList(null, null));
    } else {
      dispatch<any>(
        eodReportService.fetchEodReportList(
          startDate === "" ? null : startDate,
          endDate === "" ? null : endDate
        )
      );
    }
  };

  //const rows = eodData?.map((item, i) => ({ ...item, id: i + 1 })) || [];

  // const data: RowData[] =
  //   eodData &&
  //   eodData.length >= 0 &&
  //   eodData.map((data: any, id: number) => {
  //     return {
  //       key: data.billingId,
  //     };
  //   });

  const handleCloseEditModal = () => {
    setIsOpenEditModal(false);
  };

  let loggedInUser: Record<string, any> | null = null;
  const userJson = authService.getUser();
  if (userJson) {
    loggedInUser = JSON.parse(userJson);
  }
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col title="Date Filter">
          <DatePicker.RangePicker
            onChange={onChangeDate}
            format="YYYY-MM-DD"
            placeholder={["Start Date", "End Date"]}
          />
        </Col>
        <Col span={24} style={{ display: "flex", justifyContent: "end" }}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            size="large"
            onClick={handleOpenModal}
          >
            Add EOD
          </Button>
          <Modal
            open={isOpen}
            title="Add EOD"
            onCancel={handleCloseModal}
            footer={null}
          >
            <AddEODREport
              handleCloseDialog={handleCloseModal}
              isOpen={isOpen}
              eodData={eodData}
            />
          </Modal>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`EOD Report`}
          >
            <div>
              <SkeletonTable
                columns={columns as SkeletonTableColumnsType[]}
                active
              >
                <Table columns={columns} dataSource={eodData} size="large" />
              </SkeletonTable>
            </div>
          </Card>
        </Col>
      </Row>
      {editRow && (
        <Modal
          className="centered-text"
          centered
          width={800}
          open={isOpenEditModal}
          title="Edit EOD"
          onCancel={handleCloseEditModal}
          footer={null}
        >
          <EditEODReport
            handleCloseDialog={handleCloseEditModal}
            isOpen={isOpenEditModal}
            eodData={editRow}
          />
        </Modal>
      )}
    </>
  );
}
