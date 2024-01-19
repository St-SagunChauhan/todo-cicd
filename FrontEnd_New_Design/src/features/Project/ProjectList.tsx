import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { projectSelector } from "../../Selectors/projectSelector";
import {
  Col,
  Row,
  Table,
  Card,
  Space,
  Modal,
  Button,
  Tooltip,
  message,
  DatePicker,
  MenuProps,
  Select,
  Divider,
} from "antd";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";
import { useLocation } from "react-router-dom";
import marketplace from "../../services/marketPlaceAccountRequest";
import employeeService from "../../services/empRequest";
import { empSelector } from "../../Selectors/employeeSelector";
import { marketPlaceAccountSelector } from "../../Selectors/marketPlaceAccountSelector";
import { clientSelector } from "../../Selectors/clientSelector";
import {
  EditOutlined,
  PlusOutlined,
  HistoryOutlined,
  CheckCircleTwoTone,
  WarningOutlined,
  ExclamationCircleOutlined,
  LikeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import authService from "../../services/authServices";
import EditProject from "./EditProject";
import {
  ContractStatus,
  ContractType,
} from "../../Enums/LeadsConnect/BillingStatus";
import { countries } from "../../Helper/countries";
import AddProject from "./AddProject";
import clientService from "../../services/clientRequest";
import projectService from "../../services/projectRequest";
import { DeptEnum } from "../../Enums/DeptEnum/DeptEnum";
import ProjectHistory from "./ProjectHistory";
import { RoleEnum } from "../Employee/EmployeeModel";
import moment from "moment";
import { handleCopyToClipboard } from "../../Helper/CopyToClipBoard";
import { pageLocation } from "../../Helper/GetLocation";
import deptService from "../../services/deptRequest";
import { deptSelector } from "../../Selectors/departmentSelector";

interface DataType {
  id: String;
  contractName: String;
  assignedTo: String;
  upWorkId: String;
  startDate: String;
  projectUrl: String;
  projectHealthRate: String;
  billingHours: String;
  billingStatus: String;
  clientId: String;
  country: String;
  contractType: String;
  selectedDeptName: String;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const ProjectList = (props: Props) => {
  // Main Pages ===========
  const { loading } = props;
  const location = useLocation();
  const dispatch = useDispatch();
  const userInfo: any = JSON.parse(authService.getUser());
  const projectData = useSelector(projectSelector);
  const marketPlaceAccounts = useSelector(marketPlaceAccountSelector);
  const empData = useSelector(empSelector);
  const clientData = useSelector(clientSelector);
  const deptData = useSelector(deptSelector);

  // Other UseStates ===================
  const [isOpen, setIsOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [deptFilter, setDeptFilter] = useState<any>();
  const [pathName, setPathName] = useState<any>();
  const [copiedRowIndex, setCopiedRowIndex] = useState<number | null>(null);
  const [assignToOption, setAssignToOption] = useState<any>();
  const [deptList, setDeptList] = useState<any>();
  const [projectStatus, setProjectStatus] = useState<any>();
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [filters, setFilters] = useState({
    dateRange: [],
    dept: "",
    assignTo: "",
    health: "",
    status: "",
  });

  // Option Menus ======================
  const healthMenu = [
    {
      label: (
        <>
          <LikeOutlined style={{ fontSize: "20px", color: " green" }} /> Good
        </>
      ),
      value: "1",
    },
    {
      label: (
        <>
          <WarningOutlined style={{ fontSize: "20px", color: "yellow" }} /> Avg
        </>
      ),
      value: "2",
    },
    {
      label: (
        <>
          <ExclamationCircleOutlined
            style={{ fontSize: "20px", color: "red" }}
          />{" "}
          Danger
        </>
      ),
      value: "3",
    },
  ];

  // UseEffects ========================
  // Department get by Filter

  useEffect(() => {
    if (location) {
      const pathnames = pageLocation(location.pathname);
      setPathName(pathnames?.pathName);
      setDeptFilter(pathnames?.deptFilter);
    }
  }, [location]);

  // Initial values for

  useEffect(() => {
    if (!deptData) {
      console.log({ pathName });

      if (
        userInfo?.role === RoleEnum.BDM.name ||
        userInfo?.role === RoleEnum.BD.name ||
        userInfo?.role === RoleEnum.Admin.name
      ) {
        dispatch<any>(deptService.fetchDepartmentList());
      }
    }
  }, [dispatch, deptData]);

  useEffect(() => {
    if (!deptFilter) return;
    dispatch<any>(projectService.fetchProjectList(deptFilter));
  }, [dispatch, deptFilter]);

  useEffect(() => {
    if (!marketPlaceAccounts) {
      dispatch<any>(marketplace.fetchMarketPlaceAccountList());
    }
  }, [dispatch, marketPlaceAccounts]);

  useEffect(() => {
    if (!empData) {
      dispatch<any>(employeeService.fetchEmpList());
    }
  }, [dispatch, empData]);

  useEffect(() => {
    if (!clientData) {
      dispatch<any>(clientService.fetchClientList());
    }
  }, [dispatch, clientData]);

  useEffect(() => {
    if (
      projectData !== null &&
      marketPlaceAccounts !== null &&
      empData !== null &&
      clientData !== null
    ) {
      loading(100, false);
      const rows = projectData.map((project: any, index: number) => ({
        key: index,
        id: project.id,
        contractName: project.contractName,
        upworkId: project.upworkId,
        projectUrl: project.projectUrl,
        clientId: project.clientId,
        country: project.country,
        contractType: project.contractType,
        hoursPerWeek: project.hoursPerWeek,
        departmentId: project.departmentId,
        employeeId: project.employeeId,
        employees: project.employees,
        upworkName: project.upworkName ?? project.hiredProfile,
        hiredId: project.hiredId,
        hiredProfile: project.hiredProfile,
        communicationId: project.communicationId,
        communicationName: project.communicationName,
        communicationMode: project.communicationMode,
        billingStatus: project.billingStatus,
        startDate: project.startDate,
        projectHealthRate: project.projectHealthRate,
      }));
      setRowData(rows);
    }
  }, [dispatch, projectData, clientData, empData, marketPlaceAccounts]);

  useEffect(() => {
    if (!empData) return;
    const assignToData = empData.map((item: any) => {
      return {
        label: `${item.firstName} ${item.lastName}`,
        value: item.employeeId,
      };
    });
    setAssignToOption(assignToData);
  }, [empData]);

  useEffect(() => {
    if (!deptData) return;
    const dept = deptData.map((item: any) => {
      return { label: item.departmentName, value: item.departmentId };
    });
    setDeptList(dept);
  }, [deptData]);

  useEffect(() => {
    const ContractStatusEnum = Object.values(ContractStatus).map(
      (item: any) => {
        return { label: item.name, value: item.value };
      }
    );
    setProjectStatus(ContractStatusEnum);
  }, []);

  // Other Workings

  function renderCommaSeparatedCell(params: any) {
    // Assuming the 'values' field is an array
    if (Array.isArray(params)) {
      return (
        <span>
          <Tooltip placement="topLeft" title={params.join(", ")}>
            <span>
              {params.join(", ").substring(0, 15)}
              {params.join() !== "" ? "..." : null}
            </span>
          </Tooltip>
        </span>
      );
    }
    return null;
  }

  const onClickEditProject = async (projectId: any) => {
    loading(10, false);
    setEditRow(null);
    const response = await projectService.getProjectById(projectId);

    if (response.error) {
      message.error("Something Went Wrong");
      loading(100, false);
    } else {
      const projectContractType =
        Object.values(ContractType).find(
          (rate: any) =>
            rate.value.toString() === response?.project.contractType
        )?.name || null;

      setIsOpenEditModal(true);
      setEditRow({
        ...response?.project,
        contractType: projectContractType,
      });
      message.success("Done!");
      loading(100, false);
    }
  };

  const showHistoryModal = async (projectId: any) => {
    setEditRow(null);
    const response = await projectService.getProjectHIstory(projectId);

    setIsHistoryModalVisible(true);
    setEditRow(response);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleCloseEditModal = () => {
    setIsOpenEditModal(false);
  };
  const handleCloseProjectHistory = () => {
    setIsHistoryModalVisible(false);
  };

  const getEnumNameFromValue = (
    value: number | string,
    enumObject: Record<string, any>
  ) => {
    const numericValue =
      typeof value === "string" ? parseInt(value, 10) : value;

    const match = Object.values(enumObject).find(
      (item) => item.value === numericValue
    );

    return match ? match.name : undefined;
  };

  const columns = [
    {
      title: "Health Rate",
      dataIndex: "projectHealthRate",
      key: "projectHealthRate",
      width: 10,
      render: (e: any, param: any) => {
        if (param.projectHealthRate == "1") {
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
        if (param.projectHealthRate == "2") {
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
        if (param.projectHealthRate == "3") {
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
      title: "Name",
      dataIndex: "contractName",
      key: "contractName",
      width: 50,
    },
    {
      title: "Assigned To",
      dataIndex: "employees",
      key: "employees",
      width: 50,
      render: (e: any, param: any) => renderCommaSeparatedCell(param.employees),
    },
    {
      title: "Upwork Hired Id",
      dataIndex: "upworkName",
      key: "upworkName",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: moment.MomentInput) => moment(date).format("DD MMMM YYYY"),
    },
    {
      title: "Website Url",
      dataIndex: "projectUrl",
      key: "projectUrl",
      render: (projectUrl: string, record: any, rowIndex: number) => (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            const copied = handleCopyToClipboard(projectUrl, rowIndex);
            setCopiedRowIndex(copied);
            setTimeout(() => {
              setCopiedRowIndex(null);
            }, 2000);
          }}
        >
          <Tooltip
            placement="topLeft"
            title={copiedRowIndex === rowIndex ? "Copied!" : projectUrl}
          >
            <span>
              {projectUrl.substring(0, 40)}{" "}
              {copiedRowIndex === rowIndex && (
                <CheckCircleTwoTone twoToneColor="#52c41a" />
              )}
            </span>
          </Tooltip>
        </span>
      ),
    },
    // {
    //   title: "Department Name",
    //   dataIndex: "departmentName",
    //   key: "departmentName",
    //   render: (e: any, param: any) =>
    //     renderCommaSeparatedCell(param.departmentName),
    // },
    // {
    //   title: "Client Name",
    //   dataIndex: "clientName",
    //   key: "clientName",
    // },
    // {
    //   title: "Communication Mode",
    //   dataIndex: "communicationMode",
    //   key: "communicationMode",
    // },
    // {
    //   title: "Country",
    //   dataIndex: "country",
    //   key: "country",
    //   render: (e: any, item: any) => {
    //     const countryData = countries.find(
    //       (country: any) => country.code === item.country
    //     );
    //     return countryData ? countryData.label : e;
    //   },
    // },
    // {
    //   title: "Contract Type",
    //   dataIndex: "contractType",
    //   key: "contractType",
    //   render: (e: any, param: any) => {
    //     if (param.contractType === "1") {
    //       param.contractType = ContractType.Hourly.name;
    //       return param.contractType;
    //     } else {
    //       param.contractType = ContractType.Fixed.name;
    //       return param.contractType;
    //     }
    //   },
    // },
    {
      title: "Billing Hours",
      dataIndex: "hoursPerWeek",
      key: "hoursPerWeek",
      render: (value: string) => value.replaceAll(".", ":"),
    },
    {
      title: "Project Status",
      dataIndex: "billingStatus",
      key: "billingStatus",
      render: (value: number | string) =>
        getEnumNameFromValue(value, ContractStatus),
    },
    {
      title: userInfo?.role !== RoleEnum.Employee.name ? "Actions" : undefined,
      dataIndex: "action",
      key: "action",
      description: "Edit Project",
      render: (e: any, rowData: any) =>
        userInfo?.role !== RoleEnum.Employee.name ? (
          <Space>
            <Tooltip title="Edit Project">
              <Button
                type="link"
                onClick={() => onClickEditProject(rowData.id)}
              >
                <EditOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="Project History">
              <Button type="link" onClick={() => showHistoryModal(rowData.id)}>
                <HistoryOutlined style={{ color: "red" }} />
              </Button>
            </Tooltip>
            <Tooltip title="Information">
              <Button
                type="link"
                onClick={() =>
                  handleExpand(!expandedRowKeys.includes(rowData.key), rowData)
                }
              >
                <InfoCircleOutlined style={{ color: "green" }} />
              </Button>
            </Tooltip>
          </Space>
        ) : null,
    },
  ];

  const filterTableData = (type: any, data: any) => {
    switch (type) {
      case "dept":
        setFilters({
          ...filters,
          dept: data?.value,
        });
        break;
      case "dateRange":
        setFilters({
          ...filters,
          dateRange: data.filter(Boolean),
        });
        break;
      case "assignTo":
        setFilters({
          ...filters,
          assignTo: data?.value,
        });
        break;
      case "healthMenu":
        setFilters({
          ...filters,
          health: data?.value,
        });
        break;
      case "Status":
        setFilters({
          ...filters,
          status: data?.value,
        });
        break;
    }
  };

  const filteredData = rowData.filter((row: any) => {
    // Check each filter condition
    const dateRangeCondition =
      filters.dateRange.length === 0 ||
      (row.startDate >= filters.dateRange[0] &&
        row.startDate <= filters.dateRange[1]);

    const deptCondition =
      !filters.dept || row.departmentId.includes(filters.dept);

    const assignToCondition =
      !filters.assignTo || row.employeeId.includes(filters.assignTo);

    const healthCondition =
      !filters.health || row.projectHealthRate === filters.health;

    const statusCondition =
      !filters.status || row.billingStatus == filters.status;

    // Return true if all conditions are met
    return (
      dateRangeCondition &&
      deptCondition &&
      assignToCondition &&
      healthCondition &&
      statusCondition
    );
  });

  const handleExpand = (expanded: boolean, record: any) => {
    const keys = [...expandedRowKeys];
    if (expanded) {
      keys.push(record.key);
    } else {
      const index = keys.indexOf(record.key);
      if (index !== -1) {
        keys.splice(index, 1);
      }
    }
    setExpandedRowKeys(keys);
  };

  const expendableRows = (record: any) => {
    const deptName = deptList
      .filter((item: any) => {
        return record.departmentId.includes(item.value);
      })
      .map((item: any) => item.label);

    const countryName = countries
      .filter((item: any) => {
        return item.code === record.country;
      })
      .map((item: any) => item.label);

    return (
      <Row style={{ padding: 20 }} gutter={[16, 16]}>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={16}>Department Name: {deptName.join(", ")}</Col>
            <Col span={8}>Communication Mode: {record.communicationMode}</Col>
            <Col span={8}>Assigned To: {record.employees}</Col>
          </Row>
          <Divider />
          <Row gutter={[16, 16]}>
            <Col span={16}>Website URL: {record.projectUrl}</Col>
            <Col span={6}>Country: {countryName}</Col>
          </Row>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col span={24}>
          {(userInfo?.role === RoleEnum.BDM.name ||
            userInfo?.role === RoleEnum.BD.name ||
            userInfo?.role === RoleEnum.Admin.name) &&
            pathName === DeptEnum.business_Developement.name && (
              <>
                <Row
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Col span={20}>
                    <Row
                      gutter={[16, 16]}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <Col span={5}>
                        <DatePicker.RangePicker
                          style={{ width: "100%", maxWidth: "400px" }}
                          size="large"
                          allowClear
                          onChange={(_, value) =>
                            filterTableData("dateRange", value)
                          }
                        />
                      </Col>
                      <Col>
                        <Select
                          style={{ width: 150 }}
                          placeholder="Department"
                          size="large"
                          allowClear
                          options={deptList}
                          onChange={(_, value) =>
                            filterTableData("dept", value)
                          }
                        />
                      </Col>
                      <Col>
                        <Select
                          style={{ width: 150 }}
                          placeholder="Assign to"
                          size="large"
                          allowClear
                          options={assignToOption}
                          onChange={(_, value) =>
                            filterTableData("assignTo", value)
                          }
                        />
                      </Col>
                      <Col>
                        <Select
                          style={{ width: 120 }}
                          placeholder="Health"
                          size="large"
                          allowClear
                          options={healthMenu}
                          onChange={(_, value) =>
                            filterTableData("healthMenu", value)
                          }
                        />
                      </Col>
                      <Col>
                        <Select
                          style={{ width: 120 }}
                          placeholder="Status"
                          size="large"
                          allowClear
                          options={projectStatus}
                          onChange={(_, value) =>
                            filterTableData("Status", value)
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Button
                      icon={<PlusOutlined />}
                      type="primary"
                      size="large"
                      onClick={handleOpenModal}
                    >
                      Add Project
                    </Button>
                  </Col>
                </Row>
              </>
            )}
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Project List`}
          >
            <div className="table-responsive">
              <SkeletonTable
                columns={columns as SkeletonTableColumnsType[]}
                active
              >
                <Table
                  showHeader
                  columns={columns}
                  dataSource={filteredData}
                  size="small"
                  expandable={{
                    showExpandColumn: false,
                    expandedRowRender: (record) => expendableRows(record),
                    expandedRowKeys,
                    onExpand: handleExpand,
                  }}
                />
              </SkeletonTable>
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        style={{ textAlign: "center", paddingBottom: "30px" }}
        width={800}
        open={isOpenEditModal}
        destroyOnClose
        title="Edit Project"
        onCancel={handleCloseEditModal}
        footer={null}
      >
        <EditProject
          {...props}
          handleCloseDialog={handleCloseEditModal}
          isOpen={isOpenEditModal}
          row={editRow}
        />
      </Modal>
      <Modal
        open={isHistoryModalVisible}
        title="Project History"
        onCancel={handleCloseProjectHistory}
        footer={null}
        width={"100%"}
        style={{ maxWidth: 1200 }}
      >
        <ProjectHistory
          handleCloseDialog={handleCloseProjectHistory}
          isOpen={isHistoryModalVisible}
          projectData={editRow}
        />
      </Modal>
      <Modal
        width={800}
        open={isOpen}
        destroyOnClose
        title="Create Project"
        style={{ textAlign: "center", paddingBottom: "30px" }}
        onCancel={handleCloseModal}
        footer={null}
      >
        <AddProject {...props} handleCloseDialog={handleCloseModal} />
      </Modal>
    </>
  );
};

export default ProjectList;
