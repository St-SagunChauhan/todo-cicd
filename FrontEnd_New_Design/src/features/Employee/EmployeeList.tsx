import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  empSelector,
  isLoadingSelector,
} from "../../Selectors/employeeSelector";
import { deptSelector } from "../../Selectors/departmentSelector";
import {
  Col,
  Row,
  Table,
  Card,
  message,
  Button,
  Modal,
  Select,
  Avatar,
  Space,
  Popconfirm,
} from "antd";
import empService from "../../services/empRequest";
import { roleSelector } from "../../Selectors/authSelector";
import { PATH_NAME, USER_ROLE } from "../../Config";
import { GenderEnum, IEmployee, RoleEnum } from "./EmployeeModel";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";
import { IDept } from "../Department/DeptModel";
import AddEmployee from "./AddEmployee";
import authService from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import deptService from "../../services/deptRequest";
import EditEmployee from "./EditEmployee";

interface DataType {
  key: string;
  firstName: string;
  lastName: string;
  address: string;
  gender?: string;
  email: string;
  mobileNo: string;
  role?: string;
  joiningDate?: string;
  departmentId: string;
  assignedTo?: string | null;
  employeeNumber: string;
  profilePicture?: string;
  casualLeaves?: string;
  sickLeaves?: string;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const EmployeeList = (props: Props) => {
  const { loading } = props;
  const navigate = useNavigate();
  const empData = useSelector(empSelector);
  const [selectedDept, setSelectedDept] = useState("All");
  const role = useSelector(roleSelector);
  const dispatch = useDispatch();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [emp, setEmp] = useState<IEmployee>();
  const deptData = useSelector(deptSelector);
  const btnRole = authService.getRole();
  const [impersonateUser, setImpersonateUser] = useState<any>(false);
  const [selectUser, setSelectUser] = useState(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const isInRole = role === USER_ROLE.ADMIN || role === USER_ROLE.HR;

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleConfirmationClose = () => {
    setImpersonateUser(null);
    setSelectUser(null);
    setIsButtonDisabled(true);
  };
  const handleimpersonateUser = () => {
    setImpersonateUser(true);
    setSelectUser(null);
    setIsButtonDisabled(true);
  };

  const handleSelection = (e: any) => {
    setSelectUser(e);
    setIsButtonDisabled(false);
  };
  const handleCloseEditModal = () => {
    setIsOpenEditModal(false);
  };

  useEffect(() => {
    if (deptData === null) {
      dispatch<any>(deptService.fetchDepartmentList());
    }
  }, [deptData]);

  useEffect(() => {
    if (empData === null) {
      loading(100, false);
      const deptFilter = selectedDept === "All" ? null : selectedDept;
      dispatch<any>(empService.fetchEmpList(deptFilter));
      loading(100, false);
      localStorage.setItem("salaryDept", "");
      loading(100, false);
    } else {
      loading(100, false);
      const rows = empData.map((emp: any, index: number) => ({
        id: index,
        employeeId: emp.employeeId,
        employeeNumber: emp.employeeNumber,
        firstName: emp.firstName,
        lastName: emp.lastName,
        mobileNo: emp.mobileNo,
        role: emp.role,
        email: emp.email,
        address: emp.address,
        department: emp.departmentId,
        // password: emp.password,
        gender: emp.gender,
        joiningDate: `${new Date(emp.joiningDate).getDate()}-${
          new Date(emp.joiningDate).getMonth() + 1
        }-${new Date(emp.joiningDate).getFullYear()}`,
        empStatus: emp.isActive ? "Active" : "InActive",
        employeeTargetedHours: emp.employeeTargetedHours,
        casualLeaves: emp.casualLeaves,
        sickLeaves: emp.sickLeaves,
      }));
      setRowData(rows);
      loading(100, false);
    }
  }, [dispatch, empData]);

  const onClickEditEmployee = async (employeeId: any) => {
    setEditRow(null);
    const response = await empService.fetchEmpById(employeeId);

    setIsOpenEditModal(true);
    setEditRow(response?.data.employeeModel);
  };

  const showDeleteModal = (employeeId: string) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this employee?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const response = await empService.deleteEmployee(employeeId);
        if (response.status === 200) {
          message.success(response.data.message);
          dispatch<any>(empService.fetchEmpList());
        } else {
          message.error(response.data.message);
        }
      },
    });
  };

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

  const columns = [
    {
      title: "Profile",
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: (e: any, params: any) => {
        return (
          <Avatar
            style={{ translate: "0px 0px", backgroundColor: "#000" }}
            size={55}
            src={
              params.profilePicture && params.profilePicture !== "" ? (
                `data:image/png;base64,${params.profilePicture}`
              ) : (
                <UserOutlined />
              )
            }
          />
        );
      },
    },
    {
      title: "Employee Number",
      dataIndex: "employeeNumber",
      key: "employeeNumber",
      sorter: {
        compare: (a: any, b: any) => a.employeeNumber - b.employeeNumber,
        multiple: 3,
      },
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a: any, b: any) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a: any, b: any) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: (a: any, b: any) => a.address.localeCompare(b.address),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: (a: any, b: any) => a.role.localeCompare(b.role),
      // render: (value: number | string) => getEnumNameFromValue(value, RoleEnum),
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
      sorter: (a: any, b: any) => a.mobileNo - b.mobileNo,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      sorter: (a: any, b: any) => a.gender.localeCompare(b.gender),
      // render: (value: number | string) =>
      //   getEnumNameFromValue(value, GenderEnum),
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      key: "joiningDate",
      sorter: (a: any, b: any) => a.joiningDate.localeCompare(b.joiningDate),
      render: (e: any, param: any) => {
        const date = param?.joiningDate.split("T");
        return date[0];
      },
    },
    {
      title: "Employee Targeted Hours",
      dataIndex: "employeeTargetedHours",
      key: "employeeTargetedHours",
      sorter: (a: any, b: any) =>
        a.employeeTargetedHours - b.employeeTargetedHours,
    },
    {
      title: "Casual Leaves",
      dataIndex: "casualLeaves",
      key: "casualLeaves",
      sorter: (a: any, b: any) => a.casualLeaves - b.casualLeaves,
    },
    {
      title: "Sick Leaves",
      dataIndex: "sickLeaves",
      key: "sickLeaves",
      sorter: (a: any, b: any) => a.sickLeaves - b.sickLeaves,
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      description: "Edit and Remove Expense Category",
      render: (e: any, rowData: any) => (
        <Space>
          <a href="#" onClick={() => onClickEditEmployee(rowData.employeeId)}>
            <EditOutlined />
          </a>
          <a
            href="#"
            style={{ color: "red" }}
            onClick={() => showDeleteModal(rowData.employeeId)}
          >
            <DeleteOutlined />
          </a>
          {/* <Popconfirm
            title="Are you sure you want to delete Employee?"
            onConfirm={async () => {
              const response = await empService.deleteEmployee(
                rowData.employeeId
              );
              if (response.status === 200) {
                message.success(response.data.message);
                dispatch<any>(empService.fetchEmpList());
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
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  const data: DataType[] =
    empData &&
    empData.length > 0 &&
    empData.map((data: any, id: number) => {
      return {
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        gender: data.gender,
        email: data.email,
        mobileNo: data.mobileNo,
        role: data.role,
        joiningDate: data.joiningDate,
        departmentId: data.departmentId,
        assignedTo: data.assignedTo,
        employeeNumber: data.employeeNumber,
        profilePicture: data.profilePicture,
        casualLeaves: data.casualLeaves,
        sickLeaves: data.sickLeaves,
        employeeTargetedHours: data.employeeTargetedHours,
      };
    });
  const onChangeDept = (dept: any) => {
    if (dept === "All") {
      dispatch<any>(empService.fetchEmpList());
      setSelectedDept("All");
    } else {
      dispatch<any>(empService.fetchEmpList(dept));
      setSelectedDept(dept);
    }
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  const handleConfirmationProceed = async () => {
    if (!selectUser) return;
    try {
      setIsSuccessDialogOpen(false);
      const impersonator = JSON.parse(authService.getUser());
      const response = await empService.impersonateEmployee(
        selectUser,
        impersonator?.employeeId
      );
      authService.setSession("impersonator", impersonator?.employeeId);
      if (response.data.success) {
        authService.setSession("accessToken", response.data.api_token);
        authService.setSession("user", JSON.stringify(response.data.user));
        authService.setSession("role", response.data.user.role);
        authService.setSession("impersonating", "true");

        if (authService.getRole() === "TeamLead") {
          navigate(PATH_NAME.DASHBOARD);
        } else if (authService.getRole() === "Admin") {
          navigate(PATH_NAME.DASHBOARD);
        } else if (authService.getRole() === "HR") {
          navigate(PATH_NAME.DASHBOARD);
        } else if (authService.getRole() === "BD") {
          navigate(PATH_NAME.DASHBOARD);
        } else if (authService.getRole() === "BDM") {
          navigate(PATH_NAME.DASHBOARD);
        } else {
          navigate(PATH_NAME.DASHBOARD);
        }
        window.location.reload();
      } else {
        navigate(PATH_NAME.LOGIN);
        message.error("Error", response.data.message);
      }
      setEmp(response.data.employeeModel);
    } catch (error) {
      console.log(error);
    }
  };

  const employeeOptions =
    empData &&
    empData.length &&
    empData?.map((employee: IEmployee, key: number) => ({
      label: `${employee.firstName} ${employee.lastName}`,
      value: employee.employeeId,
    }));

  const deptOption = [
    { label: "All", value: "All" },
    ...(deptData
      ? deptData.map((dept: IDept, key: number) => ({
          label: dept.departmentName,
          value: dept.departmentId,
        }))
      : []),
  ];

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col
          span={24}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Select
            style={{ width: "200px", height: "40px" }}
            placeholder="Select Department"
            onChange={onChangeDept}
            options={deptOption}
            value={selectedDept}
          />
          <div>
            {btnRole === USER_ROLE.ADMIN ? (
              <Button
                onClick={() => handleimpersonateUser()}
                style={{ marginRight: "10px" }}
              >
                <span>
                  <UserSwitchOutlined />
                </span>
                Impersonate User
              </Button>
            ) : (
              ""
            )}
            <Modal
              title="Impersonate User"
              open={!!impersonateUser}
              onCancel={handleConfirmationClose}
              onOk={handleConfirmationProceed}
              okButtonProps={{ disabled: isButtonDisabled }}
              cancelButtonProps={{ onClick: handleConfirmationClose }} // Add this line to handle Cancel button click
            >
              <Select
                style={{ width: 300, marginTop: 10 }}
                showSearch
                placeholder="Select An Employee"
                onChange={handleSelection}
                onSearch={onSearch}
                filterOption={filterOption}
                options={employeeOptions || []}
                value={selectUser || undefined}
              />
            </Modal>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              size="large"
              onClick={handleOpenModal}
            >
              Create Employee
            </Button>
            <Modal
              className="centered-text"
              centered
              width={800}
              open={isOpen}
              title="Create Employee"
              onCancel={handleCloseModal}
              footer={null}
            >
              <AddEmployee
                handleCloseDialog={handleCloseModal}
                isOpen={isOpen}
                employeeData={empData}
              />
            </Modal>
          </div>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Employee List`}
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
          className="centered-text"
          centered
          width={800}
          open={isOpenEditModal}
          title="Edit Employee Details"
          onCancel={handleCloseEditModal}
          footer={null}
        >
          <EditEmployee
            handleCloseDialog={handleCloseEditModal}
            isOpen={isOpenEditModal}
            empData={editRow}
          />
        </Modal>
      )}
    </>
  );
};

export default EmployeeList;
