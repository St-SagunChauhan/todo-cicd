import { AbilityBuilder, Ability } from '@casl/ability';
import store from 'stores';

// configs
import { USER_ROLE, DRAWER_MENU_LABEL, REPORTS_MENU_LABEL } from 'configs';
import { EMPLOYEE_MENU_LABEL } from 'configs/employeeMenuLabel';
import { OPERATIONS_PATH_NAME } from 'configs/operationMenuLabel';

function defineAbilitiesFor(type: string) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  switch (type) {
    case USER_ROLE.ADMIN:
      can(['create', 'update', 'view', 'delete'], 'all');
      break;
    case USER_ROLE.HR:
      can(['create', 'update', 'view', 'delete'], 'all');
      break;
    case USER_ROLE.LEAD:
      // menu
      can('view', DRAWER_MENU_LABEL.PLAY_BACKGROUND);
      can('view', DRAWER_MENU_LABEL.DASHBOARD);

      can('view', DRAWER_MENU_LABEL.PRODUCT);
      can('view', DRAWER_MENU_LABEL.PRODUCT_LIST);

      can('view', DRAWER_MENU_LABEL.KANBAN);
      can('view', DRAWER_MENU_LABEL.USERS);

      // action
      break;
    case USER_ROLE.GUEST:
      cannot(['create', 'update', 'view', 'delete'], 'all');
      break;
    case USER_ROLE.TEAMLEAD:
      can('view', DRAWER_MENU_LABEL.DASHBOARD);
      can('view', DRAWER_MENU_LABEL.DEPARTMENT);
      can('view', DRAWER_MENU_LABEL.DEPARTMENTLIST);
      can('view', DRAWER_MENU_LABEL.CLIENT_LIST);
      can('view', DRAWER_MENU_LABEL.EMPLOYEE_LIST);
      can('view', DRAWER_MENU_LABEL.CONNECT);
      can('view', DRAWER_MENU_LABEL.PROJECT_BILLING);
      can('view', DRAWER_MENU_LABEL.PROJECT);
      can('view', DRAWER_MENU_LABEL.PROJECT_HEALTH);
      can('view', REPORTS_MENU_LABEL.ACTIVE_REPORTS);
      can('view', REPORTS_MENU_LABEL.REPORTS);
      can('view', REPORTS_MENU_LABEL.PROJECTS);
      can('view', REPORTS_MENU_LABEL.WEEKLY_BILLING_REPORT);
      can('view', DRAWER_MENU_LABEL.LEAVE);
      // can('view', REPORTS_MENU_LABEL.WEEKLY_PROJECT_REPORT);
      can('view', REPORTS_MENU_LABEL.CONNECT_HISTORY_REPORTS);
      can('view', REPORTS_MENU_LABEL.TEAMLOGGER_REPORT);
      can('view', REPORTS_MENU_LABEL.HIRING_LIST);
      break;
    case USER_ROLE.EMPLOYEE:
      can('view', DRAWER_MENU_LABEL.DASHBOARD);
      can('view', DRAWER_MENU_LABEL.LEAVE);
      can('view', EMPLOYEE_MENU_LABEL.EMPLOYEE_SALARY);
      can('view', REPORTS_MENU_LABEL.TEAMLOGGER_REPORT);
      can('view', REPORTS_MENU_LABEL.EOD_REPORT);
      break;
    case USER_ROLE.BD:
      can(['create', 'update', 'view', 'delete'], 'all');
      can('view', DRAWER_MENU_LABEL.EMPLOYEE_LIST);
      can('view', DRAWER_MENU_LABEL.DASHBOARD);
      can('view', DRAWER_MENU_LABEL.DEPARTMENT);
      can('view', DRAWER_MENU_LABEL.DEPARTMENTLIST);
      can('view', DRAWER_MENU_LABEL.CLIENT_LIST);
      can('view', DRAWER_MENU_LABEL.CONNECT);
      can('view', DRAWER_MENU_LABEL.PROJECT_BILLING);
      can('view', DRAWER_MENU_LABEL.PROJECT);
      can('view', DRAWER_MENU_LABEL.PROJECT_HEALTH);
      can('view', REPORTS_MENU_LABEL.ACTIVE_REPORTS);
      can('view', REPORTS_MENU_LABEL.REPORTS);
      can('view', REPORTS_MENU_LABEL.PROJECTS);
      can('view', REPORTS_MENU_LABEL.WEEKLY_BILLING_REPORT);
      can('view', REPORTS_MENU_LABEL.CONNECT_HISTORY_REPORTS);
      can('view', OPERATIONS_PATH_NAME.PURCHASE_CONNECTS);

      break;
  }
  return build();
}

const canAction = (action: string, resource: string) => {
  const role = store.getState().auth.role || '';
  if (!role) return false;

  const abilities = defineAbilitiesFor(role);
  return abilities.can(action, resource);
};

export default canAction;
