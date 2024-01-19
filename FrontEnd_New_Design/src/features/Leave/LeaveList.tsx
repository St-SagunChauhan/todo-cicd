import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import leaveService from "../../services/leaveRequest";
import {
  leaveSelector,
  isLoadingSelector,
} from "../../Selectors/leaveSelector";
import { IEmployee } from "../Employee/EmployeeModel";
import {
  Col,
  Row,
  Table,
  Card,
  message,
  Button,
  DatePicker,
  Select,
  Space,
  Popconfirm,
  Modal,
} from "antd";
import { ILeave } from "./LeaveModel";
import { empSelector } from "../../Selectors/employeeSelector";
import { roleSelector } from "../../Selectors/authSelector";
import { deptSelector } from "../../Selectors/departmentSelector";
import { USER_ROLE } from "../../Config";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";
import moment from "moment";
import CustomSelect from "../../Components/CustomComponents/CustomSelect/CustomSelect";
import empService from "../../services/empRequest";
import { IDept } from "../Department/DeptModel";
import AddLeave from "./AddLeave";
import EditLeave from "./EditLeave";

interface DataType {
  key: string;
  employeeId: string;
  leaveType: string;
  status: string;
  startDate?: string;
  reason: string;
  endDate?: string;
  isActive: boolean;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const LeaveList = (props: Props) => {
  const leaveList = useSelector(leaveSelector);
  // const loading: any = useSelector(isLoadingSelector);
  const { loading } = props;
  const dispatch = useDispatch();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [leave, setLeave] = useState<ILeave>();
  const empData = useSelector(empSelector);
  const role = useSelector(roleSelector);
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedEmp, setSelectedEmp] = useState("all");
  const deptData = useSelector(deptSelector);
  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.HR;
  const { RangePicker } = DatePicker;
  const [startDates, setStartDate] = useState("");
  const [endDates, setEndDate] = useState("");
  const [emp, setEmp] = useState<any[]>([]);
  const [dept, setDept] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editRow, setEditRow] = useState({});

  useEffect(() => {
    // dispatch(empService.fetchEmpList(null));
    const empList =
      empData && empData?.length > 0
        ? empData.map((emp: IEmployee) => ({
            label: `${emp.firstName} ${emp.lastName}`,
            value: emp.employeeId,
          }))
        : [{ label: "No Employee Found", value: null }];
    setEmp(empList);
  }, [empData]);

  useEffect(() => {
    if (deptData !== null) {
      const deptList =
        deptData && deptData?.length > 0
          ? deptData.map((dept: any) => ({
              label: dept.departmentName,
              value: dept.departmentId,
            }))
          : [{ label: "No Department Found", value: null }];
      setDept(deptList);
    }
  }, [deptData]);

  useEffect(() => {
    loading(100, false);
    dispatch<any>(leaveService.fetchLeaveList());
    loading(100, false);
  }, []);

  const data: DataType[] =
    leaveList &&
    leaveList.length >= 0 &&
    leaveList.map((data: any, id: number) => {
      return {
        id: data.id,
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
        leaveType: data.leaveType,
        status: data.status,
        startDate: data.startDate,
        reason: data.reason,
        endDate: data.endDate,
      };
    });

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (e: any, param: any) => {
        return `${param.firstName} ${param.lastName}`;
      },
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      key: "leaveType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (e: any, param: any) => {
        const date = param.startDate.split("T");
        return date[0];
      },
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (e: any, param: any) => {
        if (param?.endDate) {
          const date = param.endDate.split("T");
          return date[0];
        }
        return "";
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      description: "Edit and Remove Expense Category",
      render: (e: any, rowData: any) => (
        <Space>
          <a
            href="#"
            onClick={() => {
              onClickEditLeave(
                rowData.id,
                rowData.employeeId,
                rowData.leaveType,
                rowData.status,
                rowData.startDate,
                rowData.reason,
                rowData.endDate
              );
            }}
          >
            <EditOutlined />
          </a>
          <Popconfirm
            title="Are you sure you want to delete Leave?"
            onConfirm={async () => {
              const response = await leaveService.deleteLeave(rowData.id);
              if (response.status === 200) {
                message.success(response.data.message);
                dispatch<any>(leaveService.fetchLeaveList());
              } else {
                message.error(response.data.message);
              }
            }}
            okText="Yes"
            cancelText="No"
          >
            <a href="#" style={{ color: "red" }}>
              <DeleteOutlined />
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onClickEditLeave = async (
    id: string,
    employeeId: string,
    leaveType: string,
    status: string,
    startDate: string,
    reason: string,
    endDate: string
  ) => {
    setEditRow({
      id: id,
      employeeId: employeeId,
      leaveType: leaveType,
      status: status,
      startDate: startDate,
      reason: reason,
      endDate: endDate,
    });

    const response = await leaveService.fetchLeaveById(id);

    setIsOpenEdit(true);
  };

  const onChangeDate = (data: any) => {
    const empFilter = selectedEmp === "all" ? null : selectedEmp;
    const selectedDepts = selectedDept === "all" ? null : selectedDept;
    dispatch<any>(
      leaveService.fetchLeaveList(
        data?.endDate,
        data?.startDate,
        selectedDepts,
        empFilter
      )
    );
  };
  const onChangeDept = (e: any) => {
    const selectDept = e.target.value;

    if (selectDept === null) {
      const empList =
        empData && empData?.length > 0
          ? empData.map((emp: IEmployee) => ({
              label: `${emp.firstName} ${emp.lastName}`,
              value: emp.employeeId,
            }))
          : [{ label: "No Employee Found", value: null }];
      setEmp(empList);
    } else {
      setSelectedDept(selectDept);
      const deptFilter = selectDept === "all" ? null : selectDept;
      setSelectedEmp(selectDept);
      const emp1 = selectedEmp === "all" ? null : selectedEmp;
      const SDate = startDates || null;
      const Edate = endDates || null;
      localStorage.setItem("salaryDept", selectDept);

      dispatch<any>(
        leaveService.fetchLeaveList(Edate, SDate, deptFilter, emp1)
      );

      const empLi = empData.filter(
        (item: any) => item.departmentId === deptFilter
      );
      const empList = empLi.map((data: any) => ({
        label: `${data.firstName} ${data.lastName}`,
        value: data.employeeId,
      }));
      setEmp(empList);
    }
  };

  const onChangeEmp = (e: any) => {
    const employee = e.target.value;
    setSelectedEmp(employee);
    const SDate = startDates || null;
    const Edate = endDates || null;
    const empFilter = employee === "all" ? null : employee;
    const selectedDepts = selectedDept === "all" ? null : selectedDept;
    dispatch<any>(
      leaveService.fetchLeaveList(Edate, SDate, selectedDepts, empFilter)
    );
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleCloseEditModal = () => {
    setIsOpenEdit(false);
  };

  const deptOption =
    deptData &&
    deptData.length &&
    deptData?.map((dept: IDept, key: number) => ({
      label: dept.departmentName,
      value: dept.departmentId,
    }));

  const employeeOptions =
    empData &&
    empData.length &&
    empData?.map((emp: IEmployee, key: number) => ({
      label: `${emp.firstName} ${emp.lastName}`,
      value: emp.employeeId,
    }));

  return (
    <>
      <Row 
      className="management-row"
      gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col span={3}>
          <Select
            style={{ width: "100%", maxWidth: "200px" }}
            placeholder="Select Department"
            onChange={onChangeDept}
            options={deptOption}
            value={selectedDept}
          />
        </Col>
        <Col span={3}>
          <Select
            style={{ width: "100%", maxWidth: "200px" }}
            placeholder="Select Department"
            onChange={onChangeEmp}
            options={employeeOptions}
            value={selectedEmp}
          />
        </Col>
        <Col span={4}>
          <RangePicker size="large" picker="date" onChange={onChangeDate} />
        </Col>
        <Col span={12} style={{ display: "flex", justifyContent: "start" }}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            size="large"
            onClick={handleOpenModal}
          >
            Add Leave
          </Button>
          <Modal
            open={isOpen}
            title="Add Leave"
            onCancel={handleCloseModal}
            footer={null}
          >
            <AddLeave
              handleCloseDialog={handleCloseModal}
              isOpen={isOpen}
              leaveData={leaveList}
            />
          </Modal>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Leave List`}
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
      <Modal
        open={isOpenEdit}
        title="Edit Leave"
        onCancel={handleCloseEditModal}
        footer={null}
      >
        <EditLeave
          handleCloseDialog={handleCloseEditModal}
          isOpen={isOpenEdit}
          leaveData={editRow}
        />
      </Modal>
    </>
  );
};

export default LeaveList;
