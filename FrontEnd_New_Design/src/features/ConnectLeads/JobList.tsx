import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IDept } from "../Department/DeptModel";
import { deptSelector } from "../../Selectors/departmentSelector";
import { Col, Row, Table, Card, Modal, Select, Space, DatePicker } from "antd";
import bidService from "../../services/leadsConnectService";
import { roleSelector } from "../../Selectors/authSelector";
import { USER_ROLE } from "../../Config";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";
import authService from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import deptService from "../../services/deptRequest";
import { leadsConnectSelector } from "../../Selectors/leadsConnectSelector";
import { StatusEnum } from "../../Enums/LeadsConnect/BillingStatus";
import { marketPlaceAccountSelector } from "../../Selectors/marketPlaceAccountSelector";
import marketPlaceAccountService from "../../services/marketPlaceAccountRequest";
import { it } from "node:test";
import EditBid from "./EditJob";
import DetailViewModal from "./ViewJobDetail";
import { empSelector } from "../../Selectors/employeeSelector";
import empService from "../../services/empRequest";
import { IEmployee } from "../Employee/EmployeeModel";
import { DeptEnum } from "../../Enums/DeptEnum/DeptEnum";
import Title from "antd/es/typography/Title";

interface DataType {
  projectName?: string;
  upworkId?: string;
  accountTypes?: string;
  jobUrl?: string;
  jobdescription?: string;
  connects?: string;
  projectUrl?: string;
  clientName?: string;
  countryName?: string;
  hiredProfile?: string;
  email?: string;
  mobile?: string;
  communicationProfile?: string;
  departmentName?: string;
  contracType?: string;
  weeklyHours?: string;
  status?: string;
  startDate?: string;
  isActive?: string;
  billingStatus?: string;
  billingType?: string;
  communicationMode: string;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const JobList = (props: Props) => {
  const { loading } = props;
  const mountRef = useRef(false);
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState("All");
  const dispatch = useDispatch();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [bidRow, setBidRow] = useState(null);
  const deptData = useSelector(deptSelector);
  const accountData = useSelector(marketPlaceAccountSelector);
  const btnRole = authService.getRole();
  const bidsData = useSelector(leadsConnectSelector);
  const role = useSelector(roleSelector);
  const empdata = useSelector(empSelector);
  const { RangePicker } = DatePicker;
  const [selectedEmployee, setSelectedEmployee] = useState("All");

  const [selectedBid, setSelectedBid] = useState<DataType | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<[any, any]>([null, null]);

  const onClickEyeIcon = (bidId: any) => {
    const selectedBid = bidsData.find((bid: any) => bid.bidId === bidId);
    setSelectedBid(selectedBid);
    setIsDetailViewOpen(true);
  };

  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.BD;

  // Function to get a specific field from account data based on upworkId
  const getFieldFromAccount = (Id: any, field: string) => {
    const account =
      accountData &&
      accountData.find((accountItem: any) => accountItem.id === Id);
    return account ? account[field] : null;
  };

  const getFieldFromEmployee = (Id: any, fields: string[]) => {
    const emp = empdata && empdata.find((emp: any) => emp.employeeId === Id);
    if (emp) {
      const values: { [key: string]: any } = {};
      fields.forEach((field) => {
        values[field] = emp[field];
      });
      return values;
    } else {
      return null;
    }
  };

  const handleCloseEditModal = () => {
    setIsOpenEditModal(false);
  };

  useEffect(() => {
    if (bidsData === null && !mountRef.current) {
      dispatch<any>(bidService.fetchbidsList());
      loading(100, false);
      dispatch<any>(deptService.fetchDepartmentList());
      loading(100, false);
      dispatch<any>(marketPlaceAccountService.fetchMarketPlaceAccountList());
      loading(100, false);
      mountRef.current = true;
    }
  }, [bidsData]);

  useEffect(() => {
    if (empdata === null) {
      dispatch<any>(empService.fetchEmpList());
    }
  }, [empdata]);

  const onClickEditbid = async (bidId: any) => {
    setBidRow(null);
    const response = await bidService.fetchBidById(bidId);

    setIsOpenEditModal(true);
    setBidRow(response?.data.bids);
  };

  const onChangeDept = async (dept: any) => {
    if (dept === "All") {
      dispatch<any>(
        bidService.fetchbidsList(
          selectedDates[0],
          selectedDates[1],
          null,
          selectedEmployee === "All" ? null : selectedEmployee
        )
      );
      setSelectedDept("All");
    } else {
      dispatch<any>(
        bidService.fetchbidsList(
          selectedDates[0],
          selectedDates[1],
          dept,
          selectedEmployee === "All" ? null : selectedEmployee
        )
      );
      setSelectedDept(dept);
    }
  };

  const onSelectEmployee = async (emp: any) => {
    if (emp === "All") {
      dispatch<any>(
        bidService.fetchbidsList(
          selectedDates[0],
          selectedDates[1],
          selectedDept === "All" ? null : selectedDept,
          null
        )
      );
    } else {
      dispatch<any>(
        bidService.fetchbidsList(
          selectedDates[0],
          selectedDates[1],
          selectedDept === "All" ? null : selectedDept,
          emp
        )
      );
    }
  };

  const deptOption = [
    { label: "All", value: "All" },
    ...(deptData
      ? deptData.map((dept: IDept, key: number) => ({
          label: dept.departmentName,
          value: dept.departmentId,
        }))
      : []),
  ];

  const filteredEmpData = empdata
    ? empdata.filter(
        (emp: IEmployee) =>
          emp.departmentId === DeptEnum.business_Developement.value
      )
    : [];

  const emploOption = [
    { label: "All", value: "All" },
    ...filteredEmpData.map((emp: IEmployee) => ({
      label: emp.firstName + " " + emp.lastName,
      value: emp.employeeId,
    })),

    // Add other options if needed
  ];

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

  const getFieldFromDepartment = (Id: any, field: string) => {
    const deptName =
      deptData && deptData.find((dept: any) => dept.departmentId === Id);
    return deptName ? deptName[field] : null;
  };

  const onChangeDate = (dates: any, dateStrings: [any, any]) => {
    setSelectedDates(dateStrings);

    const [startDate, endDate] = dateStrings;
    if (startDate === null && endDate === null) {
      setSelectedDates([null, null]);
      dispatch<any>(
        bidService.fetchbidsList(
          null,
          null,
          selectedDept === "All" ? null : selectedDept,
          selectedEmployee === "All" ? null : selectedEmployee
        )
      );
    } else {
      dispatch<any>(
        bidService.fetchbidsList(
          startDate === "" ? null : startDate,
          endDate === "" ? null : endDate,
          selectedDept === "All" ? null : selectedDept,
          selectedEmployee === "All" ? null : selectedEmployee
        )
      );
    }
  };

  const columns = [
    {
      title: "Job Applied By",
      dataIndex: "employeeId",
      key: "employeeId",
      render: (e: any, item: any) => {
        const employeeId = item.employeeId;
        const result = getFieldFromEmployee(employeeId, [
          "firstName",
          "lastName",
        ]);

        const firstName = result?.firstName ?? null;
        const lastName = result?.lastName ?? null;

        return (
          <span>
            {firstName} {lastName}
          </span>
        );
      },
    },
    {
      title: "DepartmentName",
      dataIndex: "departmentId",
      key: "departmentId",
      render: (e: any, item: any) => {
        const Id = item.departmentId;
        const deptName = getFieldFromDepartment(Id, "departmentName");
        return deptName;
      },
    },
    {
      title: "Upwork Id",
      dataIndex: "upworkId",
      key: "upworkId",
      render: (e: any, item: any) => {
        const upworkId = item.upworkId;
        const upworkName = getFieldFromAccount(upworkId, "name");
        return upworkName;
      },
    },
    {
      title: "Job Url",
      dataIndex: "jobUrl",
      key: "jobUrl",
    },
    {
      title: "Job Description",
      dataIndex: "jobdescription",
      key: "jobdescription",
    },
    {
      title: "Connects",
      dataIndex: "connects",
      key: "connects",
    },
    {
      title: "Communication Mode",
      dataIndex: "communicationMode",
      key: "communicationMode",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: number | string) =>
        getEnumNameFromValue(value, StatusEnum),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      description: "Edit Job Details",
      render: (e: any, rowData: any) => (
        <Space>
          <a href="#" onClick={() => onClickEditbid(rowData.bidId)}>
            <EditOutlined />
          </a>
          <a href="#" onClick={() => onClickEyeIcon(rowData.bidId)}>
            <EyeOutlined />
          </a>
        </Space>
      ),
    },
  ];

  const data: DataType[] =
    bidsData &&
    bidsData.length > 0 &&
    bidsData.map((data: any, id: number) => {
      return {
        bidId: data.bidId,
        projectName: data.projectName,
        upworkId: data.upworkId,
        accountTypes: data.accountTypes,
        jobUrl: data.jobUrl,
        jobdescription: data.jobdescription,
        connects: data.connects,
        projectUrl: data.projectUrl,
        clientName: data.clientName,
        countryName: data.countryName,
        hiredProfile: data.hiredProfile,
        email: data.email,
        mobile: data.mobile,
        communicationProfile: data.communicationProfile,
        departmentId: data.departmentId,
        contracType: data.contracType,
        weeklyHours: data.weeklyHours,
        status: data.status,
        startDate: data.startDate,
        isActive: data.isActive,
        billingStatus: data.billingStatus,
        billingType: data.billingType,
        amountSpent: data.amountSpent,
        employeeId: data.employeeId,
        communicationMode: data.communicationMode,
      };
    });

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
        <Col style={{ display: "flex", justifyContent: "space-between" }}>
          <Select
            style={{ width: 400 }}
            placeholder="Select Department"
            onChange={onChangeDept}
            options={deptOption}
            value={selectedDept}
          />
        </Col>
        <Col style={{ display: "flex", justifyContent: "space-between" }}>
          <Select
            style={{ width: 400 }}
            placeholder="Select Employee"
            onChange={onSelectEmployee}
            options={emploOption}
            value={selectedEmployee}
          />
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Jobs List`}
          >
            <div className="table-responsive custom-table-design">
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
      <DetailViewModal
        isOpen={isDetailViewOpen}
        onClose={() => setIsDetailViewOpen(false)}
        data={selectedBid}
      />
      {bidRow && (
        <Modal
          open={isOpenEditModal}
          title="Edit Job Details"
          onCancel={handleCloseEditModal}
          footer={null}
          width={1400}
        >
          <EditBid
            handleCloseDialog={handleCloseEditModal}
            isOpen={isOpenEditModal}
            bidData={bidRow}
            {...props}
          />
        </Modal>
      )}
    </>
  );
};

export default JobList;
