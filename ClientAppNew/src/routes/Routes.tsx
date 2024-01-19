import React, { Fragment, lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { REPORTS_PATH_NAME } from 'configs/reportsMenuLabel';

// configs
import { DRAWER_MENU_LABEL, PATH_NAME, USER_ROLE } from 'configs';
import { ASSETS_PATH_NAME } from 'configs/assetsMenuLabel';

// types
import { IRoutes } from 'models/IRoutes';

// layouts
import MainLayout from 'layouts/MainLayout';

// containers
import AuthGuard from 'guards/AuthGuard';
import GuestGuard from 'guards/GuestGuard';

// route
import RoleRoute from './RoleRoute';

// modules
const Error404View = lazy(() => import('features/Error404View'));
const DenyView = lazy(() => import('features/DenyView'));
const Login = lazy(() => import('features/Login'));
const DepartmentList = lazy(() => import('features/Department'));
const Project = lazy(() => import('features/Project'));
const ProjectBilling = lazy(() => import('features/ProjectBilling'));
const ProjectHealth = lazy(() => import('features/ProjectHealth'));
const MarketPlaceAccount = lazy(() => import('features/MarketPlaceAccount'));
const ClientList = lazy(() => import('features/Client/ClientList'));
const Connect = lazy(() => import('features/Connect/ConnectList'));
const EmployeeList = lazy(() => import('features/Employee/EmployeeList'));
const EmployeeSalaryList = lazy(() => import('features/EmployeeSalary/EmployeeSalaryList'));
const EodReportList = lazy(() => import('features/EodReport/EodReportList'));
const Profile = lazy(() => import('features/Profile/Profile'));
const ConnectHistoryReport = lazy(() => import('features/Reports/ConnectHistoryReport'));
const WeeklyBilling = lazy(() => import('features/Reports/WeeklyBilling'));
const Leave = lazy(() => import('features/Leave'));
const ActiveReports = lazy(() => import('features/Reports/ActiveReports'));
const MasterReports = lazy(() => import('features/Reports/MasterReportSheet'));
const Dashboard = lazy(() => import('features/Dashboard/Dashboardlist'));
const TeamLogger = lazy(() => import('features/Reports/TeamLoggerList'));
const PurchaseConnects = lazy(() => import('features/Connect/PurchaseConnectReport'));
const HRExpense = lazy(() => import('features/Reports/HrExpense'));
const expenseCategory = lazy(() => import('features/ExpenseCategory/ExpenseCategoryList'));
const AssetsCategoryList = lazy(() => import('features/Assets/AssetsCategories/AssetsCategoryList'));
const AssetsListData = lazy(() => import('features/Assets/AssetsList/AssetsListData'));
const HandoveredAssetsListData = lazy(() => import('features/Assets/HandoverAssets/HandoverAssetsList'));
const HiringList = lazy(() => import('features/HiringList/HiringList'));
const HiringListDepartment = lazy(() => import('features/HiringList/HiringListDepartment'));

const routesConfig: IRoutes[] = [
  {
    exact: true,
    path: '/',
    component: () => <Redirect to={PATH_NAME.DASHBOARD} />,
  },
  {
    exact: true,
    path: PATH_NAME.ERROR_404,
    component: Error404View,
  },
  {
    exact: true,
    guard: GuestGuard,
    path: PATH_NAME.LOGIN,
    component: Login,
  },
  {
    exact: true,
    path: PATH_NAME.ERROR_403,
    component: DenyView,
  },
  {
    path: '/',
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: PATH_NAME.DASHBOARD,
        component: Dashboard,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.TEAMLEAD, USER_ROLE.BD],
      },
      {
        exact: true,
        path: PATH_NAME.EXPENSECATEGORY,
        component: expenseCategory,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
      },
      {
        exact: true,
        path: PATH_NAME.EMPLOYEE,
        component: EmployeeList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.TEAMLEAD, USER_ROLE.BD],
      },
      {
        exact: true,
        path: DRAWER_MENU_LABEL.EMPLOYEE_LIST,
        component: EmployeeList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.TEAMLEAD],
      },
      {
        exact: true,
        path: PATH_NAME.EMPLOYEE_SALARY,
        component: EmployeeSalaryList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.TEAMLEAD, USER_ROLE.EMPLOYEE],
      },
      {
        exact: true,
        path: PATH_NAME.PROJECT_BILLING,
        component: ProjectBilling,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.TEAMLEAD, USER_ROLE.BD],
      },
      {
        exact: true,
        path: PATH_NAME.PROJECT_HEALTH,
        component: ProjectHealth,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.TEAMLEAD, USER_ROLE.BD],
      },
      {
        exact: true,
        path: PATH_NAME.DEPARTMENTLIST,
        component: DepartmentList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.TEAMLEAD],
      },
      {
        exact: true,
        path: PATH_NAME.CLIENT_LIST,
        component: ClientList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.TEAMLEAD, USER_ROLE.BD],
      },
      {
        exact: true,
        path: PATH_NAME.PROJECT,
        component: Project,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.TEAMLEAD, USER_ROLE.BD],
      },
      {
        exact: true,
        path: PATH_NAME.MARKETPLACEACCOUNT,
        component: MarketPlaceAccount,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BD],
      },
      {
        exact: true,
        path: PATH_NAME.PROFILE,
        component: Profile,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.TEAMLEAD, USER_ROLE.EMPLOYEE, USER_ROLE.BD],
      },
      {
        exact: true,
        path: PATH_NAME.LEAVE,
        component: Leave,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.TEAMLEAD, USER_ROLE.EMPLOYEE],
      },
      {
        exact: true,
        path: PATH_NAME.CONNECT,
        component: Connect,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.TEAMLEAD, USER_ROLE.BD],
      },
      // {
      //   exact: true,
      //   path: PATH_NAME.PURCHASE_CONNECTS,
      //   component: PurchaseConnects,
      //   requireRoles: [USER_ROLE.ADMIN, USER_ROLE.BD],
      // },
      {
        exact: true,
        path: PATH_NAME.HRExpense,
        component: HRExpense,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR],
      },
      {
        exact: true,
        path: REPORTS_PATH_NAME.HIRING_LIST,
        component: HiringList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.TEAMLEAD],
      },
      {
        exact: true,
        path: REPORTS_PATH_NAME.MASTER_REPORT,
        component: MasterReports,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.TEAMLEAD, USER_ROLE.BD],
      },
      {
        exact: true,
        path: REPORTS_PATH_NAME.ACTIVE_REPORTS,
        component: ActiveReports,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.TEAMLEAD, USER_ROLE.BD],
      },
      {
        exact: true,
        path: REPORTS_PATH_NAME.CONNECT_HISTORY_REPORTS,
        component: ConnectHistoryReport,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.TEAMLEAD, USER_ROLE.BD],
      },
      {
        exact: true,
        path: REPORTS_PATH_NAME.WEEKLY_BILLING_REPORT,
        component: WeeklyBilling,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.TEAMLEAD, USER_ROLE.BD],
      },
      {
        exact: true,
        path: REPORTS_PATH_NAME.EOD_REPORT,
        component: EodReportList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.TEAMLEAD, USER_ROLE.BD, USER_ROLE.EMPLOYEE],
      },
      {
        exact: true,
        path: ASSETS_PATH_NAME.ASSESTS_CATEGORIES,
        component: AssetsCategoryList,
        requireRoles: [USER_ROLE.ADMIN],
      },
      {
        exact: true,
        path: ASSETS_PATH_NAME.ASSETS_LIST,
        component: AssetsListData,
        requireRoles: [USER_ROLE.ADMIN],
      },
      {
        exact: true,
        path: ASSETS_PATH_NAME.ASSETS_HANDOVERED,
        component: HandoveredAssetsListData,
        requireRoles: [USER_ROLE.ADMIN],
      },
      {
        exact: true,
        path: REPORTS_PATH_NAME.HIRING_LIST_DEPARTMENT,
        component: HiringListDepartment,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.TEAMLEAD],
      },
      {
        exact: true,
        path: REPORTS_PATH_NAME.TEAMLOGGER_REPORT,
        component: TeamLogger,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.HR, USER_ROLE.TEAMLEAD, USER_ROLE.EMPLOYEE, USER_ROLE.BD],
      },
      {
        component: () => <Redirect to={PATH_NAME.ERROR_404} />,
      },
    ],
  },
  {
    path: '*',
    routes: [
      {
        exact: true,
        path: '/app',
        component: MainLayout,
      },
      {
        component: () => <Redirect to={PATH_NAME.ERROR_404} />,
      },
    ],
  },
];

const renderRoutes = (routes: IRoutes[]) => {
  return (
    <>
      {routes ? (
        <Suspense fallback={<div />}>
          <Switch>
            {routes.map((route: IRoutes, idx: number) => {
              const Guard = route.guard || Fragment;
              const Layout = route.layout || Fragment;
              const Component = route.component;
              const requireRoles = route.requireRoles || [];

              return (
                <Route
                  key={`routes-${idx}`}
                  path={route.path}
                  exact={route.exact}
                  render={(props: any) => (
                    <Guard>
                      <Layout>
                        {route.routes ? (
                          renderRoutes(route.routes)
                        ) : (
                          <RoleRoute requireRoles={requireRoles}>
                            <Component {...props} />
                          </RoleRoute>
                        )}
                      </Layout>
                    </Guard>
                  )}
                />
              );
            })}
          </Switch>
        </Suspense>
      ) : null}
    </>
  );
};

function Routes() {
  return renderRoutes(routesConfig);
}

export default Routes;
