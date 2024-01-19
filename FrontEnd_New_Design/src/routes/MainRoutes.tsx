import { Fragment, lazy, Suspense } from "react";
import {
  Navigate,
  Routes,
  Route,
  BrowserRouter as Router,
} from "react-router-dom";
import RoleRoute from "./RoleRoutes";
import { IRoutes } from "../models/IRoutes";
import AuthGuard from "../Guards/AuthGuard/AuthGuard";
import GuestGuard from "../Guards/GuestGuard/GuestGuard";
import MainLayout from "../Layout";
import { PATH_NAME, USER_ROLE } from "../Config";
import ClientList from "../features/Client/ClientList";
import MarketPlaceAccount from "../features/MarketPlaceAccount/MarketPlaceAccountList";
import ProjectList from "../features/Project/ProjectList";
import ConnectLeadList from "../features/ConnectLeads/JobList";
import BidReportList from "../features/ConnectLeads/BidReport";
import EODReport from "../features/EODReport/EODReport";
import clientReport from "../features/Reports/ClientReport";
import ConnectsHistoryReport from "../features/Reports/ConnectsHistoryReport";
import ConnectList from "../features/Connects/ConnectList";

const Login = lazy(() => import("../features/Login"));
const Dashboard = lazy(() => import("../features/dashboard"));
const Profile = lazy(() => import("../features/Profile/Profile"));
const ExpenseList = lazy(
  () => import("../features/Expenses/ExpenseList/ExpenseList")
);
const HiringList = lazy(() => import("../features/HiringList/HiringList"));
const teamLoggerReport = lazy(
  () => import("../features/Reports/TeamLoggerReport")
);
const ActiveReports = lazy(() => import("../features/Reports/ActiveReports"));
const LeaveList = lazy(() => import("../features/Leave/LeaveList"));
const employeeList = lazy(() => import("../features/Employee/EmployeeList"));
const AssetList = lazy(() => import("../features/Assets/AssetList"));
const AssetCategoriesList = lazy(
  () => import("../features/Assets/AssetsCategories")
);
const HandoverAssets = lazy(() => import("../features/Assets/HandoverAssets"));
const DepartmentList = lazy(
  () => import("../features/Department/DepartmentList")
);
const Leads = lazy(() => import("../features/ConnectLeads/JobList"));
const AddBid = lazy(() => import("../features/ConnectLeads/AddJob"));
const bidderQuots = lazy(() => import("../features/ConnectLeads/BidReport"));

const Error404 = lazy(() => import("../Components/ErrorPages/Error404"));
const Error403 = lazy(() => import("../Components/ErrorPages/Error403"));

const routerConfig: IRoutes[] = [
  {
    path: "/",
    component: () => <Navigate to={PATH_NAME.DASHBOARD} />,
  },
  {
    path: PATH_NAME.ACCOUNT,
    component: () => <Navigate to={PATH_NAME.ACCOUNT + PATH_NAME.HRExpense} />,
  },
  {
    path: PATH_NAME.ADMIN,
    component: () => (
      <Navigate to={PATH_NAME.ADMIN + PATH_NAME.DEPARTMENTLIST} />
    ),
  },
  {
    path: PATH_NAME.ADMIN + PATH_NAME.ITASSETS,
    component: () => (
      <Navigate
        to={PATH_NAME.ADMIN + PATH_NAME.ITASSETS + PATH_NAME.ASSETS_LIST}
      />
    ),
  },
  {
    path: PATH_NAME.LOGIN,
    guard: GuestGuard,
    component: Login,
  },
  {
    path: PATH_NAME.JOB_STATUS,
    guard: AuthGuard,
    component: Leads,
  },
  {
    path: PATH_NAME.DASHBOARD,
    guard: AuthGuard,
    layout: MainLayout,
    component: Dashboard,
  },
  {
    path: PATH_NAME.PROFILE,
    guard: AuthGuard,
    layout: MainLayout,
    component: Profile,
  },
  {
    path: PATH_NAME.ACCOUNT,
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        path: PATH_NAME.HRExpense,
        component: ExpenseList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
      },
    ],
  },
  {
    path: PATH_NAME.ADMIN,
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        path: PATH_NAME.DEPARTMENTLIST,
        component: DepartmentList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
      },
      {
        path: PATH_NAME.JOB_STATUS,
        component: ConnectLeadList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
      },
      {
        path: PATH_NAME.EMPLOYEE,
        component: employeeList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
      },
      {
        path: PATH_NAME.ITASSETS,
        routes: [
          {
            path: PATH_NAME.ASSETS_LIST,
            component: AssetList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.ASSETS_CATEGORY,
            component: AssetCategoriesList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.HANDOVER_ASSETS,
            component: HandoverAssets,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
        ],
      },
      {
        path: PATH_NAME.ADD_JOB,
        component: AddBid,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BD, USER_ROLE.BDM],
      },
    ],
  },
  {
    path: PATH_NAME.MANAGEMENT,
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        path: PATH_NAME.EMPLOYEE,
        component: employeeList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
      },
      {
        path: PATH_NAME.LEAVE,
        component: LeaveList,
        requireRoles: [USER_ROLE.HR, USER_ROLE.ADMIN],
      },
      {
        path: PATH_NAME.HIRING_LIST,
        component: HiringList,
        requireRoles: [USER_ROLE.HR, USER_ROLE.ADMIN],
      },
    ],
  },
  {
    path: PATH_NAME.OPERATIONS,
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        path: PATH_NAME.BD,
        routes: [
          {
            path: PATH_NAME.TEAM_LEAVES,
            component: employeeList,
            requireRoles: [
              USER_ROLE.ADMIN,
              USER_ROLE.HR,
              USER_ROLE.BD,
              USER_ROLE.BDM,
            ],
          },
          {
            path: PATH_NAME.CLIENT_LIST,
            component: ClientList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BD, USER_ROLE.BDM],
          },
          {
            path: PATH_NAME.PROJECT,
            component: ProjectList,
            requireRoles: [
              USER_ROLE.ADMIN,
              USER_ROLE.HR,
              USER_ROLE.BD,
              USER_ROLE.BDM,
              USER_ROLE.EMPLOYEE,
            ],
          },
          {
            path: PATH_NAME.PROJECT_BILLING,
            component: employeeList,
            requireRoles: [
              USER_ROLE.ADMIN,
              USER_ROLE.HR,
              USER_ROLE.BD,
              USER_ROLE.BDM,
            ],
          },
          {
            path: PATH_NAME.MARKETPLACEACCOUNT,
            component: MarketPlaceAccount,
            requireRoles: [
              USER_ROLE.ADMIN,
              USER_ROLE.HR,
              USER_ROLE.BD,
              USER_ROLE.BDM,
            ],
          },
          {
            path: PATH_NAME.JOB_STATUS,
            component: ConnectLeadList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BD, USER_ROLE.BDM],
          },
          {
            path: PATH_NAME.ADD_JOB,
            component: AddBid,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BD, USER_ROLE.BDM],
          },
          {
            path: PATH_NAME.JOB_REPORTS,
            component: bidderQuots,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BD, USER_ROLE.BDM],
          },
          {
            path: PATH_NAME.EOD_REPORT,
            component: EODReport,
            requireRoles: [
              USER_ROLE.ADMIN,
              USER_ROLE.BD,
              USER_ROLE.BDM,
              USER_ROLE.EMPLOYEE,
            ],
          },
          {
            path: PATH_NAME.CONNECTS,
            component: ConnectList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BDM],
          },
        ],
      },
      {
        path: PATH_NAME.DOT_NET,
        routes: [
          {
            path: PATH_NAME.LEAVE,
            component: LeaveList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.CLIENT_LIST,
            component: ClientList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.PROJECT,
            component: ProjectList,
            requireRoles: [
              USER_ROLE.ADMIN,
              USER_ROLE.HR,
              USER_ROLE.TEAMLEAD,
              USER_ROLE.BD,
              USER_ROLE.BDM,
              USER_ROLE.EMPLOYEE,
            ],
          },
          {
            path: PATH_NAME.PROJECT_BILLING,
            component: employeeList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.BDM],
          },
          {
            path: PATH_NAME.MARKETPLACEACCOUNT,
            component: MarketPlaceAccount,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BDM],
          },
          {
            path: PATH_NAME.CONNECT,
            component: employeeList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BD, USER_ROLE.BDM],
          },
          {
            path: PATH_NAME.EOD_REPORT,
            component: EODReport,
            requireRoles: [
              USER_ROLE.ADMIN,
              USER_ROLE.BD,
              USER_ROLE.BDM,
              USER_ROLE.EMPLOYEE,
              USER_ROLE.TEAMLEAD,
            ],
          },
        ],
      },
      {
        path: PATH_NAME.PHP_TECH,
        routes: [
          {
            path: PATH_NAME.LEAVE,
            component: LeaveList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.CLIENT_LIST,
            component: ClientList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.PROJECT,
            component: ProjectList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.EMPLOYEE],
          },
          {
            path: PATH_NAME.PROJECT_BILLING,
            component: employeeList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.MARKETPLACEACCOUNT,
            component: MarketPlaceAccount,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.CONNECT,
            component: employeeList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.EOD_REPORT,
            component: EODReport,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.EMPLOYEE],
          },
        ],
      },
      {
        path: PATH_NAME.JS_FRAME,
        routes: [
          {
            path: PATH_NAME.LEAVE,
            component: LeaveList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.CLIENT_LIST,
            component: ClientList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.PROJECT,
            component: ProjectList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.EMPLOYEE],
          },
          {
            path: PATH_NAME.PROJECT_BILLING,
            component: employeeList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.MARKETPLACEACCOUNT,
            component: MarketPlaceAccount,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.CONNECT,
            component: employeeList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.EOD_REPORT,
            component: EODReport,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.EMPLOYEE],
          },
        ],
      },
      {
        path: PATH_NAME.QA_DEPT,
        routes: [
          {
            path: PATH_NAME.LEAVE,
            component: LeaveList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.CLIENT_LIST,
            component: ClientList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.PROJECT,
            component: ProjectList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.EMPLOYEE],
          },
          {
            path: PATH_NAME.PROJECT_BILLING,
            component: employeeList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.MARKETPLACEACCOUNT,
            component: MarketPlaceAccount,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.CONNECT,
            component: employeeList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.EOD_REPORT,
            component: EODReport,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.EMPLOYEE],
          },
        ],
      },
      {
        path: PATH_NAME.DIGITAL_MARKETING,
        routes: [
          {
            path: PATH_NAME.LEAVE,
            component: LeaveList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.CLIENT_LIST,
            component: ClientList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
          },
          {
            path: PATH_NAME.PROJECT,
            component: ProjectList,
            requireRoles: [
              USER_ROLE.ADMIN,
              USER_ROLE.HR,
              USER_ROLE.TEAMLEAD,
              USER_ROLE.BD,
              USER_ROLE.BDM,
              USER_ROLE.EMPLOYEE,
            ],
          },
          {
            path: PATH_NAME.PROJECT_BILLING,
            component: employeeList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.BDM],
          },
          {
            path: PATH_NAME.MARKETPLACEACCOUNT,
            component: MarketPlaceAccount,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BDM],
          },
          {
            path: PATH_NAME.CONNECT,
            component: employeeList,
            requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BD, USER_ROLE.BDM],
          },
          {
            path: PATH_NAME.EOD_REPORT,
            component: EODReport,
            requireRoles: [
              USER_ROLE.ADMIN,
              USER_ROLE.BD,
              USER_ROLE.BDM,
              USER_ROLE.EMPLOYEE,
            ],
          },
        ],
      },
    ],
  },
  {
    path: PATH_NAME.EMPLOYEE,
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        path: PATH_NAME.PROJECT,
        component: ProjectList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.EMPLOYEE],
      },
      {
        path: PATH_NAME.EOD_REPORT,
        component: EODReport,
        requireRoles: [USER_ROLE.HR, USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE],
      },
      {
        path: PATH_NAME.LEAVE,
        component: LeaveList,
        requireRoles: [USER_ROLE.HR, USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE],
      },
    ],
  },
  {
    path: PATH_NAME.TEAMLEAD,
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        path: PATH_NAME.PROJECT,
        component: ProjectList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.TEAMLEAD],
      },
      {
        path: PATH_NAME.EOD_REPORT,
        component: EODReport,
        requireRoles: [USER_ROLE.HR, USER_ROLE.ADMIN, USER_ROLE.TEAMLEAD],
      },
      {
        path: PATH_NAME.LEAVE,
        component: LeaveList,
        requireRoles: [USER_ROLE.HR, USER_ROLE.ADMIN, USER_ROLE.TEAMLEAD],
      },
    ],
  },
  {
    path: PATH_NAME.REPORTS,
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        path: PATH_NAME.JOB_REPORTS,
        component: BidReportList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BDM],
      },
      {
        path: PATH_NAME.PROJECT_REPORTS,
        component: ActiveReports,
        requireRoles: [USER_ROLE.HR, USER_ROLE.ADMIN],
      },
      {
        path: PATH_NAME.EOD_REPORT,
        component: EODReport,
        requireRoles: [
          USER_ROLE.ADMIN,
          USER_ROLE.BD,
          USER_ROLE.BDM,
          USER_ROLE.TEAMLEAD,
          USER_ROLE.EMPLOYEE,
        ],
      },
      {
        path: PATH_NAME.TEAMLOGGER_REPORT,
        component: teamLoggerReport,
        requireRoles: [
          USER_ROLE.ADMIN,
          USER_ROLE.BD,
          USER_ROLE.HR,
          USER_ROLE.TEAMLEAD,
          USER_ROLE.EMPLOYEE,
          USER_ROLE.BDM,
        ],
      },
      {
        path: PATH_NAME.CLIENT_REPORT,
        component: clientReport,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BD, USER_ROLE.BDM],
      },
      {
        path: PATH_NAME.CONNECTS_HISTORY_REPORTS,
        component: ConnectsHistoryReport,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BDM],
      },
      {
        path: PATH_NAME.CONNECTS,
        component: ConnectList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BDM],
      },
    ],
  },
  {
    path: PATH_NAME.ERROR404,
    component: Error404,
  },
  {
    path: PATH_NAME.ERROR403,
    component: Error403,
  },
  {
    path: "*",
    component: () => <Navigate to={PATH_NAME.ERROR404} />,
  },
];

const RenderSubPrefixRoute = (
  prefixPath: any,
  Guard: any,
  Layout: any,
  routes: IRoutes[],
  props: any
) => {
  return (
    <>
      {routes.map((route: IRoutes, idx: number) => {
        const pathName = route.path;
        const Component = route.component;
        const RoleRequire = route.requireRoles || [];
        return (
          <>
            <Route
              key={`${prefixPath}-${idx}`}
              path={prefixPath + pathName}
              element={
                <Guard>
                  <Layout {...props}>
                    <RoleRoute requireRoles={RoleRequire}>
                      <Component {...props} />
                    </RoleRoute>
                  </Layout>
                </Guard>
              }
            />
          </>
        );
      })}
    </>
  );
};

const RenderPrefixRoute = (
  prefixPath: any,
  Guard: any,
  Layout: any,
  routes: IRoutes[],
  props: any
) => {
  return (
    <>
      {routes.map((route: IRoutes, idx: number) => {
        const pathName = route.path;
        const Component = route.component;
        const RoleRequire = route.requireRoles || [];
        return (
          <>
            {route.routes ? (
              RenderSubPrefixRoute(
                prefixPath + pathName,
                Guard,
                Layout,
                route.routes,
                props
              )
            ) : (
              <Route
                key={`${prefixPath}-${idx}`}
                path={prefixPath + pathName}
                element={
                  <Guard>
                    <Layout {...props}>
                      <RoleRoute requireRoles={RoleRequire}>
                        <Component {...props} />
                      </RoleRoute>
                    </Layout>
                  </Guard>
                }
              />
            )}
          </>
        );
      })}
    </>
  );
};

const RenderRoutes = (routes: IRoutes[], props: any) => {
  return (
    <>
      {routes ? (
        <Suspense fallback={<div />}>
          <Router>
            <Routes>
              {routes.map((route: IRoutes, idx: number) => {
                const Guard = route.guard || Fragment;
                const Layout = route.layout || Fragment;
                const RoleRequire = route.requireRoles || [];
                const Component = route.component;
                const pathName = route.path;
                return (
                  <>
                    {route.routes ? (
                      RenderPrefixRoute(
                        pathName,
                        Guard,
                        Layout,
                        route.routes,
                        props
                      )
                    ) : (
                      <Route
                        key={`MainRoutes-${idx}`}
                        path={route.path}
                        element={
                          <Guard>
                            <Layout {...props}>
                              <RoleRoute requireRoles={RoleRequire}>
                                <Component {...props} />
                              </RoleRoute>
                            </Layout>
                          </Guard>
                        }
                      />
                    )}
                  </>
                );
              })}
            </Routes>
          </Router>
        </Suspense>
      ) : null}
    </>
  );
};

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const MainRoutes = (props: Props) => {
  return RenderRoutes(routerConfig, props);
};
export default MainRoutes;
