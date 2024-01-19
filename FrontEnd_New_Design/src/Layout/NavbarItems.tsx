import { startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import {
  AntDesignOutlined,
  ApartmentOutlined,
  AreaChartOutlined,
  CarryOutOutlined,
  ContactsOutlined,
  ContainerOutlined,
  CrownOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  DiffOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  LaptopOutlined,
  LayoutOutlined,
  PoundOutlined,
  ProfileOutlined,
  ProjectOutlined,
  PullRequestOutlined,
  ReconciliationOutlined,
  RocketOutlined,
  ScheduleOutlined,
  SolutionOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
  WalletOutlined,
  WindowsOutlined,
} from "@ant-design/icons";
import { PATH_NAME, USER_ROLE } from "../Config";
import authService from "../services/authServices";

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const NavbarItems = (props: Props) => {
  const { loading } = props;
  const navigate = useNavigate();
  const PathName = window.location.pathname;
  const splitPath = PathName.split("/").filter(Boolean);

  const formattedPaths = [""];

  splitPath.forEach((segment) => {
    const newPath = `${formattedPaths[formattedPaths.length - 1]}/${segment}`;
    formattedPaths.push(newPath);
  });

  let loggedInUser = [];

  if (authService.getUser()) {
    loggedInUser = JSON.parse(authService.getUser());
  }

  let navBarItemsAdmin = [];
  if (loggedInUser.role === USER_ROLE.TEAMLEAD) {
    navBarItemsAdmin = [
      {
        key: PATH_NAME.DASHBOARD,
        icon: <DashboardOutlined />,
        label: "TeamLead Dashboard",
      },
      {
        key: PATH_NAME.TEAMLEAD + PATH_NAME.PROJECT,
        label: "Project",
        icon: <ReconciliationOutlined />,
      },
      {
        key: PATH_NAME.TEAMLEAD + PATH_NAME.EOD_REPORT,
        label: "EOD Reports",
        icon: <RocketOutlined />,
      },
      {
        key: PATH_NAME.TEAMLEAD + PATH_NAME.LEAVE,
        label: "Team Leaves",
        icon: <ScheduleOutlined />,
      },
    ];
  } else if (loggedInUser.role === USER_ROLE.HR) {
    navBarItemsAdmin = [
      {
        key: PATH_NAME.DASHBOARD,
        icon: <DashboardOutlined />,
        label: "HR Dashboard",
      },
      {
        key: PATH_NAME.ADMIN + PATH_NAME.EMPLOYEE,
        label: "Employee List",
        icon: <TeamOutlined />,
      },
      {
        key: PATH_NAME.MANAGEMENT + PATH_NAME.HIRING_LIST,
        label: "Hiring List",
        icon: <UsergroupAddOutlined />,
      },
      {
        key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.LEAVE,
        label: "Team Leaves",
        icon: <ScheduleOutlined />,
      },
    ];
  } else if (loggedInUser.role === USER_ROLE.BDM) {
    navBarItemsAdmin = [
      {
        key: PATH_NAME.DASHBOARD,
        icon: <DashboardOutlined />,
        label: "BDM Dashboard",
      },
      {
        key: PATH_NAME.ADMIN + PATH_NAME.ADD_JOB,
        icon: <DashboardOutlined />,
        label: "Add Job",
      },
      {
        key: PATH_NAME.OPERATIONS,
        icon: <DeploymentUnitOutlined />,
        label: "Operations",
        children: [
          {
            key: PATH_NAME.OPERATIONS + PATH_NAME.BD,
            label: "Business Development",
            icon: <AreaChartOutlined />,
            children: [
              // {
              //   key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.LEAVE,
              //   label: "Team Leaves",
              //   icon: <ScheduleOutlined />,
              // },
              {
                key:
                  PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.CLIENT_LIST,
                label: "Client List",
                icon: <SolutionOutlined />,
              },
              {
                key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.PROJECT,
                label: "Project List",
                icon: <ReconciliationOutlined />,
              },
              {
                key:
                  PATH_NAME.OPERATIONS +
                  PATH_NAME.BD +
                  PATH_NAME.MARKETPLACEACCOUNT,
                label: "Market Place Accounts",
                icon: <RocketOutlined />,
              },
              {
                key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.EOD_REPORT,
                label: "EOD Reports",
                icon: <RocketOutlined />,
              },
              {
                key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.CONNECTS,
                label: "Connects",
                icon: <PullRequestOutlined />,
              },
              {
                key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.JOB_STATUS,
                label: "Job Status",
                icon: <PullRequestOutlined />,
              },
            ],
          },
        ],
      },
      {
        key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.LEAVE,
        label: "Team Leaves",
        icon: <ScheduleOutlined />,
      },
      {
        key: PATH_NAME.REPORTS,
        icon: <FileTextOutlined />,
        label: "Reports",
        children: [
          {
            key: PATH_NAME.REPORTS + PATH_NAME.JOB_REPORTS,
            label: "Jobs Reports",
            icon: <ProjectOutlined />,
          },
          {
            key: PATH_NAME.REPORTS + PATH_NAME.CONNECTS_HISTORY_REPORTS,
            label: "Connects History Reports",
            icon: <ContainerOutlined />,
          },
        ],
      },
    ];
  } else if (loggedInUser.role === USER_ROLE.BD) {
    navBarItemsAdmin = [
      {
        key: PATH_NAME.DASHBOARD,
        icon: <DashboardOutlined />,
        label: "BD Dashboard",
      },
      {
        key: PATH_NAME.ADMIN + PATH_NAME.ADD_JOB,
        icon: <DashboardOutlined />,
        label: "Add Job",
      },
      {
        key: PATH_NAME.OPERATIONS,
        icon: <DeploymentUnitOutlined />,
        label: "Operations",
        children: [
          {
            key: PATH_NAME.OPERATIONS + PATH_NAME.BD,
            label: "Business Development",
            icon: <AreaChartOutlined />,
            children: [
              {
                key:
                  PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.CLIENT_LIST,
                label: "Client List",
                icon: <SolutionOutlined />,
              },
              {
                key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.PROJECT,
                label: "Project List",
                icon: <ReconciliationOutlined />,
              },
              {
                key:
                  PATH_NAME.OPERATIONS +
                  PATH_NAME.BD +
                  PATH_NAME.MARKETPLACEACCOUNT,
                label: "Market Place Accounts",
                icon: <RocketOutlined />,
              },
              {
                key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.EOD_REPORT,
                label: "EOD Reports",
                icon: <RocketOutlined />,
              },
              {
                key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.JOB_STATUS,
                label: "Job Status",
                icon: <PullRequestOutlined />,
              },
            ],
          },
        ],
      },
      {
        key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.LEAVE,
        label: "Team Leaves",
        icon: <ScheduleOutlined />,
      },
    ];
  } else if (loggedInUser.role === USER_ROLE.EMPLOYEE) {
    navBarItemsAdmin = [
      {
        key: PATH_NAME.DASHBOARD,
        icon: <DashboardOutlined />,
        label: "Employee Dashboard",
      },
      {
        key: PATH_NAME.EMPLOYEE + PATH_NAME.PROJECT,
        label: "Project List",
        icon: <ReconciliationOutlined />,
      },
      {
        key: PATH_NAME.EMPLOYEE + PATH_NAME.EOD_REPORT,
        label: "EOD Reports",
        icon: <RocketOutlined />,
      },
      {
        key: PATH_NAME.EMPLOYEE + PATH_NAME.LEAVE,
        label: "Team Leaves",
        icon: <ScheduleOutlined />,
      },
    ];
  } else {
    navBarItemsAdmin = [
      {
        key: PATH_NAME.DASHBOARD,
        icon: <DashboardOutlined />,
        label: "Admin Dashboard",
      },
      {
        key: PATH_NAME.ADMIN + PATH_NAME.ADD_JOB,
        icon: <DashboardOutlined />,
        label: "Add Job",
      },
      {
        key: PATH_NAME.ACCOUNT,
        icon: <FileDoneOutlined />,
        label: "Accounts",
        children: [
          {
            key: PATH_NAME.ACCOUNT + PATH_NAME.HRExpense,
            label: "Finance",
            icon: <WalletOutlined />,
          },
        ],
      },
      {
        key: PATH_NAME.ADMIN,
        icon: <CrownOutlined />,
        label: "Admin",
        children: [
          {
            key: PATH_NAME.ADMIN + PATH_NAME.DEPARTMENTLIST,
            label: "Department List",
            icon: <UnorderedListOutlined />,
          },
          {
            key: PATH_NAME.ADMIN + PATH_NAME.EMPLOYEE,
            label: "Employee List",
            icon: <TeamOutlined />,
          },
          {
            key: PATH_NAME.ADMIN + PATH_NAME.ITASSETS,
            label: "IT Assets",
            icon: <LaptopOutlined />,
            children: [
              {
                key:
                  PATH_NAME.ADMIN + PATH_NAME.ITASSETS + PATH_NAME.ASSETS_LIST,
                label: "IT Assets ",
                icon: <ProfileOutlined />,
              },
            ],
          },
        ],
      },
      {
        key: PATH_NAME.OPERATIONS,
        icon: <DeploymentUnitOutlined />,
        label: "Operations",
        children: [
          {
            key: PATH_NAME.OPERATIONS + PATH_NAME.BD,
            label: "Business Development",
            icon: <AreaChartOutlined />,
            children: [
              {
                key:
                  PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.CLIENT_LIST,
                label: "Client List",
                icon: <SolutionOutlined />,
              },
              {
                key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.PROJECT,
                label: "Project List",
                icon: <ReconciliationOutlined />,
              },
              {
                key:
                  PATH_NAME.OPERATIONS +
                  PATH_NAME.BD +
                  PATH_NAME.MARKETPLACEACCOUNT,
                label: "Market Place Accounts",
                icon: <RocketOutlined />,
              },
              {
                key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.EOD_REPORT,
                label: "EOD Reports",
                icon: <RocketOutlined />,
              },
              {
                key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.CONNECTS,
                label: "Connects",
                icon: <PullRequestOutlined />,
              },
              {
                key: PATH_NAME.OPERATIONS + PATH_NAME.BD + PATH_NAME.JOB_STATUS,
                label: "Job Status",
                icon: <PullRequestOutlined />,
              },
            ],
          },
          {
            key: PATH_NAME.OPERATIONS + PATH_NAME.DOT_NET,
            label: "Dot Net Framework Technology Department",
            icon: <WindowsOutlined />,
            children: [
              {
                key:
                  PATH_NAME.OPERATIONS + PATH_NAME.DOT_NET + PATH_NAME.PROJECT,
                label: "Project List",
                icon: <ReconciliationOutlined />,
              },
              {
                key:
                  PATH_NAME.OPERATIONS +
                  PATH_NAME.DOT_NET +
                  PATH_NAME.EOD_REPORT,
                label: "EOD Reports",
                icon: <RocketOutlined />,
              },
            ],
          },
          {
            key: PATH_NAME.OPERATIONS + PATH_NAME.PHP_TECH,
            label: "PHP Technology Department",
            icon: <h5>PHP</h5>,
            children: [
              {
                key:
                  PATH_NAME.OPERATIONS + PATH_NAME.PHP_TECH + PATH_NAME.PROJECT,
                label: "Project List",
                icon: <ReconciliationOutlined />,
              },
              {
                key:
                  PATH_NAME.OPERATIONS +
                  PATH_NAME.PHP_TECH +
                  PATH_NAME.EOD_REPORT,
                label: "EOD Reports",
                icon: <PoundOutlined />,
              },
            ],
          },
          {
            key: PATH_NAME.OPERATIONS + PATH_NAME.JS_FRAME,
            label: "Javascript Framework Technology Department",
            icon: <h5>JS</h5>,
            children: [
              {
                key:
                  PATH_NAME.OPERATIONS + PATH_NAME.JS_FRAME + PATH_NAME.PROJECT,
                label: "Project List",
                icon: <ReconciliationOutlined />,
              },
              {
                key:
                  PATH_NAME.OPERATIONS +
                  PATH_NAME.JS_FRAME +
                  PATH_NAME.EOD_REPORT,
                label: "EOD Reports",
                icon: <PoundOutlined />,
              },
            ],
          },
          {
            key: PATH_NAME.OPERATIONS + PATH_NAME.QA_DEPT,
            label: "Quality Analysis Department",
            icon: <h5>QA</h5>,
            children: [
              {
                key:
                  PATH_NAME.OPERATIONS + PATH_NAME.QA_DEPT + PATH_NAME.PROJECT,
                label: "Project List",
                icon: <ReconciliationOutlined />,
              },
              {
                key:
                  PATH_NAME.OPERATIONS +
                  PATH_NAME.QA_DEPT +
                  PATH_NAME.EOD_REPORT,
                label: "EOD Reports",
                icon: <PoundOutlined />,
              },
            ],
          },
          {
            key: PATH_NAME.OPERATIONS + PATH_NAME.DIGITAL_MARKETING,
            label: "Creative and Digital Marketing Department",
            icon: <AntDesignOutlined />,
            children: [
              {
                key:
                  PATH_NAME.OPERATIONS +
                  PATH_NAME.DIGITAL_MARKETING +
                  PATH_NAME.PROJECT,
                label: "Project List",
                icon: <ReconciliationOutlined />,
              },
              {
                key:
                  PATH_NAME.OPERATIONS +
                  PATH_NAME.DIGITAL_MARKETING +
                  PATH_NAME.EOD_REPORT,
                label: "EOD Reports",
                icon: <PoundOutlined />,
              },
            ],
          },
        ],
      },
      {
        key: PATH_NAME.MANAGEMENT,
        icon: <LayoutOutlined />,
        label: "Management",
        children: [
          {
            key: PATH_NAME.MANAGEMENT + PATH_NAME.EMPLOYEE,
            label: "Resource List",
            icon: <TeamOutlined />,
          },
          {
            key: PATH_NAME.MANAGEMENT + PATH_NAME.HIRING_LIST,
            label: "Hiring List",
            icon: <UsergroupAddOutlined />,
          },
          {
            key: PATH_NAME.MANAGEMENT + PATH_NAME.LEAVE,
            label: "Leaves",
            icon: <ContactsOutlined />,
          },
        ],
      },
      {
        key: PATH_NAME.REPORTS,
        icon: <FileTextOutlined />,
        label: "Reports",
        children: [
          {
            key: PATH_NAME.REPORTS + PATH_NAME.JOB_REPORTS,
            label: "Jobs Reports",
            icon: <ProjectOutlined />,
          },
          {
            key: PATH_NAME.REPORTS + PATH_NAME.PROJECT_REPORTS,
            label: "Projects Reports",
            icon: <ProjectOutlined />,
          },
          {
            key: PATH_NAME.REPORTS + PATH_NAME.CLIENT_REPORT,
            label: "Client Reports",
            icon: <ContainerOutlined />,
          },
          {
            key: PATH_NAME.REPORTS + PATH_NAME.CONNECTS_HISTORY_REPORTS,
            label: "Connects History Reports",
            icon: <ContainerOutlined />,
          },
          {
            key: PATH_NAME.REPORTS + PATH_NAME.EOD_REPORT,
            label: "EOD Report",
            icon: <SolutionOutlined />,
          },
          {
            key: PATH_NAME.REPORTS + PATH_NAME.TEAMLOGGER_REPORT,
            label: "Upwork Profiles Reports",
            icon: <CarryOutOutlined />,
          },
        ],
      },
    ];
  }

  return (
    <Menu
      style={{ backgroundColor: "#373737" }}
      theme="dark"
      mode="inline"
      onClick={({ key }) =>
        startTransition(() => {
          loading(10, false);
          navigate(key, { replace: false });
        })
      }
      defaultSelectedKeys={[PathName]}
      defaultOpenKeys={formattedPaths}
      items={navBarItemsAdmin}
    />
  );
};

export default NavbarItems;
