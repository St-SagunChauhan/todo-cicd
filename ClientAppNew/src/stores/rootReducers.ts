import { combineReducers } from 'redux';

// reducers
import assetHandovered from 'reducers/assetHandover.reducer';
import assetCategories from 'reducers/assetsCategory.reducer';
import hiringlist from 'reducers/hiringList.reducer';
import assets from 'reducers/assets.reducer';
import app from 'reducers/app.reducer';
import auth from 'reducers/auth.reducer';
import dept from 'reducers/dept.reducer';
import project from 'reducers/project.reducer';
import projectBilling from 'reducers/projectBilling.reducer';
import projectHealth from 'reducers/projectHealth.reducer';
import client from 'reducers/client.reducer';
import empProject from 'reducers/EmpProject.reducer';
import marketPlaceAccount from 'reducers/marketPlaceAccount.reducer';
import connect from 'reducers/connect.reducer';
import emp from 'reducers/emp.reducer';
import empSalary from 'reducers/empSalary.reducer';
import report from 'reducers/report.reducer';
import projectDept from 'reducers/projectDept.reducer';
import connectHistory from 'reducers/connectHistory.reducer';
import weeklyBilling from 'reducers/WeeklyBilling.reducer';
import weeklyProject from 'reducers/WeeklyProject.reducer';
import capacity from 'reducers/capacity.reducer';
import leave from 'reducers/leave.reducer';
import masterReport from 'reducers/masterReport.reducer';
import dashBoard from 'reducers/dashBoard.reducer';
import teamLogger from 'reducers/teamLogger.reducer';
import eodReport from 'reducers/eodReport.reducer';
import purchaseConnects from 'reducers/purchaseConnects.reducer';
import hrExpense from 'reducers/hrExpense.reducer';
import expenseCategory from 'reducers/expenseCategory.reducer';

const reducers = combineReducers({
  assetHandovered,
  assetCategories,
  assets,
  hiringlist,
  app,
  auth,
  dept,
  project,
  projectBilling,
  projectHealth,
  client,
  empProject,
  marketPlaceAccount,
  connect,
  emp,
  empSalary,
  report,
  projectDept,
  connectHistory,
  weeklyBilling,
  weeklyProject,
  capacity,
  leave,
  masterReport,
  dashBoard,
  teamLogger,
  eodReport,
  purchaseConnects,
  hrExpense,
  expenseCategory,
});

export default reducers;
