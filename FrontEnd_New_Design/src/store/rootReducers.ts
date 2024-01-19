import { combineReducers } from "redux";
import assetHandovered from "../Reducers/HandoverAssetReducer";
import assetCategories from "../Reducers/AssetCategoryReducer";
import assets from "../Reducers/AssetReducer";
import app from "../Reducers/AppReducer";
import Auth from "../Reducers/AuthReducer";
import dept from "../Reducers/DepartmentReducer";
import project from "../Reducers/ProjectReducer";
import projectBilling from "../Reducers/ProjectBillingReducer";
import client from "../Reducers/ClientReducer";
import empProject from "../Reducers/EmpProjectReducer";
import marketPlaceAccount from "../Reducers/MarketPlaceAccountReducer";
import connect from "../Reducers/ConnectReducer";
import emp from "../Reducers/EmployeeReducer";
import report from "../Reducers/ReportReducer";
import projectDept from "../Reducers/ProjectDeptReducer";
import connectHistory from "../Reducers/ConnectHistoryReducer";
import weeklyBilling from "../Reducers/WeeklyBillingReducer";
import weeklyProject from "../Reducers/WeeklyProjectReducer";
import capacity from "../Reducers/CapacityReducer";
import leave from "../Reducers/LeaveReducer";
import masterReport from "../Reducers/MasterReportReducer";
import dashboardLeads from "../Reducers/DashboardLeadReducer";
import teamLogger from "../Reducers/TeamLoggerReducer";
import eodReport from "../Reducers/EodReportReducer";
import purchaseConnects from "../Reducers/PurchaseConnectReducer";
import expenseCategory from "../Reducers/ExpenseCategoryReducer";
import hrExpense from "../Reducers/ExpenseReducer";
import userProfile from "../Reducers/UserReducer";
import hiringlist from "../Reducers/HiringListReducer";
import connectleads from "../Reducers/LeadsConnectsReducer";
import bidReports from "../Reducers/BidReportReducer";
import contractStatus from "../Reducers/ContractStatusReducer";
import connects from "../Reducers/ConnectsReducer";

const reducers = combineReducers({
  assetHandovered,
  assetCategories,
  assets,
  app,
  Auth,
  dept,
  project,
  projectBilling,
  client,
  empProject,
  marketPlaceAccount,
  connect,
  emp,
  report,
  projectDept,
  connectHistory,
  weeklyBilling,
  weeklyProject,
  capacity,
  leave,
  masterReport,
  dashboardLeads,
  teamLogger,
  eodReport,
  purchaseConnects,
  hrExpense,
  expenseCategory,
  userProfile,
  hiringlist,
  connectleads,
  bidReports,
  contractStatus,
  connects,
});

export default reducers;
