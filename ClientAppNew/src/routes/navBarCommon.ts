// material icon
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import ViewListIcon from '@material-ui/icons/ViewList';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssessmentIcon from '@material-ui/icons/Assessment';
import PregnantWomanIcon from '@material-ui/icons/PregnantWoman';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import BusinessIcon from '@material-ui/icons/Business';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LaptopIcon from '@material-ui/icons/Laptop';
import HealingIcon from '@material-ui/icons/Healing';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { MdOutlineManageAccounts, MdOutlineWebAsset, MdOutlineCategory, MdTrackChanges, MdReduceCapacity } from 'react-icons/md';
import { FaPhp, FaConnectdevelop } from 'react-icons/fa';
import { SiDotnet, SiMinds } from 'react-icons/si';
import { PiEqualizerLight } from 'react-icons/pi';
import { SlCalender } from 'react-icons/sl';
import { IoPricetagOutline } from 'react-icons/io5';
import { RxDashboard } from 'react-icons/rx';
import { RiUserSearchLine } from 'react-icons/ri';
import { LiaBusinessTimeSolid, LiaCalendarWeekSolid } from 'react-icons/lia';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { TbBrandJavascript, TbReportSearch } from 'react-icons/tb';
import { AiOutlineUsergroupAdd, AiOutlineControl, AiOutlineFundProjectionScreen } from 'react-icons/ai';

// configs
import { PATH_NAME, DRAWER_MENU_LABEL, USER_ROLE } from 'configs';
import { EMPLOYEE_MENU_LABEL, EMPLOYEE_PATH_NAME } from 'configs/employeeMenuLabel';
import { OperationMenuLabel, OPERATIONS_PATH_NAME } from 'configs/operationMenuLabel';
import { REPORTS_MENU_LABEL, REPORTS_PATH_NAME } from 'configs/reportsMenuLabel';
import authService from 'services/authService';
import { ASSETS_MENU_LABEL, ASSETS_PATH_NAME } from 'configs/assetsMenuLabel';

let loggedInUser = [];

if (authService.getUser()) {
  loggedInUser = JSON.parse(authService.getUser());
}

let navBar = [];

if (loggedInUser.role === USER_ROLE.TEAMLEAD) {
  navBar = [
    {
      subheader: 'Application',
      items: [
        {
          title: 'Report',
          href: PATH_NAME.DASHBOARD,
          icon: DashboardIcon,
          label: DRAWER_MENU_LABEL.DASHBOARD,
        },
      ],
    },
    {
      subheader: 'Dashboard',
      items: [
        {
          title: 'Accounts',
          icon: MdOutlineManageAccounts,
          label: EMPLOYEE_MENU_LABEL.ACCOUNTS,
          items: [
            {
              title: 'Employee',
              icon: PeopleOutlineIcon,
              href: EMPLOYEE_PATH_NAME.EMPLOYEE,
              label: EMPLOYEE_MENU_LABEL.EMPLOYEE_LIST,
            },
          ],
        },
        {
          title: 'Operations',
          icon: AiOutlineControl,
          label: OperationMenuLabel.OPERATIONS,
          items: [
            {
              title: 'List Departments',
              icon: ViewListIcon,
              href: OPERATIONS_PATH_NAME.DEPARTMENTLIST,
              label: OperationMenuLabel.DEPARTMENT_LIST,
            },
            {
              title: 'Client List',
              icon: PregnantWomanIcon,
              href: OPERATIONS_PATH_NAME.CLIENT_LIST,
              label: OperationMenuLabel.CLIENT_LIST,
            },
            {
              title: 'Project',
              href: OPERATIONS_PATH_NAME.PROJECT,
              icon: AssignmentIcon,
              label: OperationMenuLabel.PROJECT,
            },
            {
              title: 'Project Billing',
              href: OPERATIONS_PATH_NAME.PROJECT_BILLING,
              icon: AccountBalanceWalletIcon,
              label: OperationMenuLabel.PROJECT_BILLING,
            },
            {
              title: 'Project Health',
              href: OPERATIONS_PATH_NAME.PROJECT_HEALTH,
              icon: HealingIcon,
              label: OperationMenuLabel.PROJECT_HEALTH,
            },
            {
              title: 'Account Type',
              href: OPERATIONS_PATH_NAME.MARKETPLACEACCOUNT,
              icon: RecentActorsIcon,
              label: OperationMenuLabel.MARKETPLACEACCOUNT,
            },
          ],
        },
        {
          title: 'Leave',
          icon: HomeWorkIcon,
          label: DRAWER_MENU_LABEL.EMPLOYEE_LIST,
          items: [
            {
              title: 'Leaves',
              icon: LocalLibraryIcon,
              href: PATH_NAME.LEAVE,
              label: DRAWER_MENU_LABEL.LEAVE,
            },
          ],
        },
        {
          title: 'TeamLoggerReport',
          icon: AssessmentIcon,
          label: REPORTS_MENU_LABEL.REPORTS,
          items: [
            {
              title: 'TeamLoggerReport',
              icon: BusinessIcon,
              href: REPORTS_PATH_NAME.TEAMLOGGER_REPORT,
              label: REPORTS_MENU_LABEL.TEAMLOGGER_REPORT,
            },
          ],
        },
        {
          title: 'Hiring List',
          icon: AssessmentIcon,
          label: 'Hiring List',
          items: [
            {
              title: 'Hiring List',
              icon: RiUserSearchLine,
              href: REPORTS_PATH_NAME.HIRING_LIST_DEPARTMENT,
              label: REPORTS_MENU_LABEL.HIRING_LIST,
            },
          ],
        },
      ],
    },
  ];
} else if (loggedInUser.role === USER_ROLE.EMPLOYEE) {
  navBar = [
    {
      subheader: 'Employee',
      items: [
        {
          title: 'Leaves',
          icon: LocalLibraryIcon,
          href: PATH_NAME.LEAVE,
          label: DRAWER_MENU_LABEL.LEAVE,
        },
        {
          title: 'Employee Salary',
          icon: AttachMoneyIcon,
          href: EMPLOYEE_PATH_NAME.EMPLOYEE_SALARY,
          label: EMPLOYEE_MENU_LABEL.EMPLOYEE_SALARY,
        },
        {
          title: 'TeamLoggerReport',
          icon: AssessmentIcon,
          label: REPORTS_MENU_LABEL.REPORTS,
          items: [
            {
              title: 'TeamLoggerReport',
              icon: BusinessIcon,
              href: REPORTS_PATH_NAME.TEAMLOGGER_REPORT,
              label: REPORTS_MENU_LABEL.TEAMLOGGER_REPORT,
            },
          ],
        },

        {
          title: 'Reports',
          icon: AssessmentIcon,
          label: REPORTS_MENU_LABEL.REPORTS,
          items: [
            {
              title: 'EOD Report',
              icon: BusinessIcon,
              href: REPORTS_PATH_NAME.EOD_REPORT,
              label: REPORTS_MENU_LABEL.EOD_REPORT,
            },
          ],
        },
      ],
    },
  ];
} else if (loggedInUser.role === USER_ROLE.HR)
  navBar = [
    {
      subheader: 'HR Dashboar',
      items: [
        {
          title: 'HR',
          icon: HomeWorkIcon,
          label: DRAWER_MENU_LABEL.EMPLOYEE_LIST,
          items: [
            {
              title: 'Employee List',
              icon: PeopleAltIcon,
              href: EMPLOYEE_PATH_NAME.EMPLOYEE,
              label: EMPLOYEE_MENU_LABEL.EMPLOYEE_LIST,
            },
            {
              title: 'Leaves',
              icon: LocalLibraryIcon,
              href: PATH_NAME.LEAVE,
              label: DRAWER_MENU_LABEL.LEAVE,
            },
            {
              title: 'Hiring List',
              icon: RiUserSearchLine,
              href: REPORTS_PATH_NAME.HIRING_LIST,
              label: 'Hiring List',
            },
            // {
            //   title: 'Employee Salary',
            //   icon: AttachMoneyIcon,
            //   href: EMPLOYEE_PATH_NAME.EMPLOYEE_SALARY,
            //   label: EMPLOYEE_MENU_LABEL.EMPLOYEE_SALARY,
            // },
            // {
            //   title: 'HR Expense',
            //   icon: AttachMoneyIcon,
            //   href: EMPLOYEE_PATH_NAME.HREXPENSE,
            //   label: EMPLOYEE_MENU_LABEL.HREXPENSE,
            // },
          ],
        },
        {
          title: 'TeamLoggerReport',
          icon: AssessmentIcon,
          label: REPORTS_MENU_LABEL.REPORTS,
          items: [
            {
              title: 'TeamLoggerReport',
              icon: BusinessIcon,
              href: REPORTS_PATH_NAME.TEAMLOGGER_REPORT,
              label: REPORTS_MENU_LABEL.TEAMLOGGER_REPORT,
            },
          ],
        },
        // {
        //   title: 'Hiring List',
        //   icon: AssessmentIcon,
        //   label: REPORTS_MENU_LABEL.REPORTS,
        //   items: [
        //     {
        //       title: 'Hiring List',
        //       icon: RiUserSearchLine,
        //       href: REPORTS_PATH_NAME.HIRING_LIST,
        //       label: 'Hiring List',
        //     },
        //   ],
        // },
      ],
    },
  ];
else if (loggedInUser.role === USER_ROLE.BD) {
  navBar = [
    {
      subheader: 'Dashboard',
      items: [
        {
          title: 'Accounts',
          icon: AssessmentIcon,
          label: EMPLOYEE_MENU_LABEL.ACCOUNTS,
          items: [
            {
              title: 'Employee',
              icon: PeopleOutlineIcon,
              href: EMPLOYEE_PATH_NAME.EMPLOYEE,
              label: EMPLOYEE_MENU_LABEL.EMPLOYEE_LIST,
            },
          ],
        },
        {
          title: 'Operations',
          icon: DeveloperModeIcon,
          label: OperationMenuLabel.OPERATIONS,
          items: [
            {
              title: 'Team-Leaves',
              icon: LocalLibraryIcon,
              href: PATH_NAME.LEAVE,
              label: DRAWER_MENU_LABEL.LEAVE,
            },
            {
              title: 'Client List',
              icon: PregnantWomanIcon,
              href: OPERATIONS_PATH_NAME.CLIENT_LIST,
              label: OperationMenuLabel.CLIENT_LIST,
            },
            {
              title: 'Project List',
              href: OPERATIONS_PATH_NAME.PROJECT,
              icon: AssignmentIcon,
              label: OperationMenuLabel.PROJECT,
            },
            {
              title: 'Project Billing',
              href: OPERATIONS_PATH_NAME.PROJECT_BILLING,
              icon: AccountBalanceWalletIcon,
              label: OperationMenuLabel.PROJECT_BILLING,
            },
            {
              title: 'Project Health',
              href: OPERATIONS_PATH_NAME.PROJECT_HEALTH,
              icon: HealingIcon,
              label: OperationMenuLabel.PROJECT_HEALTH,
            },
            {
              title: 'MarketPlaceAccount',
              href: OPERATIONS_PATH_NAME.MARKETPLACEACCOUNT,
              icon: RecentActorsIcon,
              label: OperationMenuLabel.MARKETPLACEACCOUNT,
            },
            // {
            //   title: 'Connects',
            //   href: OPERATIONS_PATH_NAME.CONNECT,
            //   icon: LaptopIcon,
            //   label: OperationMenuLabel.CONNECT,
            //   items: [
            {
              title: 'Leads',
              href: OPERATIONS_PATH_NAME.CONNECT,
              icon: RecentActorsIcon,
              label: OperationMenuLabel.CONNECT,
            },
            // {
            //   title: 'Purchase Connects History',
            //   href: OPERATIONS_PATH_NAME.PURCHASE_CONNECTS,
            //   icon: RecentActorsIcon,
            //   label: OperationMenuLabel.PURCHASE_CONNECTS,
            // },
            //   ],
            // },
          ],
        },
        {
          title: 'Reports',
          icon: AssessmentIcon,
          label: REPORTS_MENU_LABEL.REPORTS,
          items: [
            {
              title: 'Master Sheet',
              icon: BusinessIcon,
              href: REPORTS_PATH_NAME.MASTER_REPORT,
              label: REPORTS_MENU_LABEL.MASTER_REPORT,
            },
            {
              title: 'Projects Report',
              icon: BusinessIcon,
              href: REPORTS_PATH_NAME.ACTIVE_REPORTS,
              label: REPORTS_MENU_LABEL.ACTIVE_REPORTS,
            },
            {
              title: 'Weekly Billing Sheet',
              icon: BusinessIcon,
              href: REPORTS_PATH_NAME.WEEKLY_BILLING_REPORT,
              label: REPORTS_MENU_LABEL.WEEKLY_BILLING_REPORT,
            },
            {
              title: 'Connect History Report',
              icon: BusinessIcon,
              href: REPORTS_PATH_NAME.CONNECT_HISTORY_REPORTS,
              label: REPORTS_MENU_LABEL.CONNECT_HISTORY_REPORTS,
            },
            {
              title: 'EOD Report',
              icon: BusinessIcon,
              href: REPORTS_PATH_NAME.EOD_REPORT,
              label: REPORTS_MENU_LABEL.EOD_REPORT,
            },
          ],
        },
        {
          title: 'TeamLoggerReport',
          icon: AssessmentIcon,
          label: REPORTS_MENU_LABEL.REPORTS,
          items: [
            {
              title: 'TeamLoggerReport',
              icon: BusinessIcon,
              href: REPORTS_PATH_NAME.TEAMLOGGER_REPORT,
              label: REPORTS_MENU_LABEL.TEAMLOGGER_REPORT,
            },
          ],
        },
      ],
    },
  ];
} else {
  navBar = [
    // {
    //   subheader: 'Application',
    //   items: [
    //     {
    //       title: 'Report',
    //       href: PATH_NAME.DASHBOARD,
    //       icon: DashboardIcon,
    //       label: DRAWER_MENU_LABEL.DASHBOARD,
    //     },
    //     {
    //       title: 'ADMIN',
    //       icon: AirlineSeatReclineExtraIcon,
    //       label: DRAWER_MENU_LABEL.EMPLOYEE_LIST,
    //       items: [
    //         {
    //           title: 'Employee',
    //           icon: AddIcon,
    //           href: PATH_NAME.EMPLOYEE,
    //           label: DRAWER_MENU_LABEL.EMPLOYEE_LIST,
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      // subheader: 'Dashboard',

      items: [
        {
          title: 'Dashboard',
          icon: RxDashboard,
          href: PATH_NAME.MASTER_REPORT,
          label: EMPLOYEE_MENU_LABEL.ACCOUNTS,
        },
        {
          title: 'Accounts',
          icon: MdOutlineManageAccounts,
          label: EMPLOYEE_MENU_LABEL.ACCOUNTS,
          items: [
            {
              title: 'Finance',
              icon: AttachMoneyIcon,
              href: EMPLOYEE_PATH_NAME.HREXPENSE,
              label: EMPLOYEE_MENU_LABEL.HREXPENSE,
            },
          ],
        },
        {
          title: 'Admin',
          icon: MdOutlineManageAccounts,
          label: EMPLOYEE_MENU_LABEL.ACCOUNTS,
          items: [
            {
              title: 'Department List',
              icon: ViewListIcon,
              href: OPERATIONS_PATH_NAME.DEPARTMENTLIST,
              label: OperationMenuLabel.DEPARTMENT_LIST,
            },
            // {
            //   title: 'Expense Category',
            //   icon: IoPricetagOutline,
            //   href: EMPLOYEE_PATH_NAME.EXPENSECATEGORY,
            //   label: EMPLOYEE_MENU_LABEL.EXPENSECATEGORY,
            // },
            {
              title: 'Employee List',
              icon: PeopleAltIcon,
              href: EMPLOYEE_PATH_NAME.EMPLOYEE,
              label: EMPLOYEE_MENU_LABEL.EMPLOYEE_LIST,
            },
            {
              title: 'IT Assets',
              icon: MdOutlineCategory,
              label: ASSETS_MENU_LABEL.ASSETS_LIST,
              items: [
                {
                  title: 'IT Asset',
                  icon: MdOutlineCategory,
                  href: ASSETS_PATH_NAME.ASSETS_LIST,
                  label: ASSETS_MENU_LABEL.ASSETS_LIST,
                },
                // {
                //   title: 'Assets Category ',
                //   icon: MdOutlineCategory,
                //   href: ASSETS_PATH_NAME.ASSESTS_CATEGORIES,
                //   label: ASSETS_MENU_LABEL.ASSETS_CATEGORY,
                // },
              ],
            },
          ],
        },
        {
          title: 'Operations',
          icon: AiOutlineControl,
          label: OperationMenuLabel.OPERATIONS,
          items: [
            {
              title: 'BD',
              icon: LiaBusinessTimeSolid,
              label: EMPLOYEE_MENU_LABEL.ACCOUNTS,
              items: [
                // {
                //   title: 'Team-Leaves',
                //   icon: LocalLibraryIcon,
                //   href: PATH_NAME.LEAVE,
                //   label: DRAWER_MENU_LABEL.LEAVE,
                // },
                {
                  title: 'Client List',
                  icon: PregnantWomanIcon,
                  href: OPERATIONS_PATH_NAME.CLIENT_LIST,
                  label: OperationMenuLabel.CLIENT_LIST,
                },
                {
                  title: 'Project List',
                  href: OPERATIONS_PATH_NAME.PROJECT,
                  icon: AssignmentIcon,
                  label: OperationMenuLabel.PROJECT,
                },
                // {
                //   title: 'Upload Connenct Report',
                //   href: OPERATIONS_PATH_NAME.CONNECT,
                //   icon: AssignmentIcon,
                //   label: OperationMenuLabel.CONNECT,
                // },
                // {
                //   title: 'List Departments',
                //   icon: ViewListIcon,
                //   href: OPERATIONS_PATH_NAME.DEPARTMENTLIST,
                //   label: OperationMenuLabel.DEPARTMENT_LIST,
                // },
                {
                  title: 'Project Health',
                  href: OPERATIONS_PATH_NAME.PROJECT_HEALTH,
                  icon: HealingIcon,
                  label: OperationMenuLabel.PROJECT_HEALTH,
                },
                // {
                //   title: 'Upwork Account',
                //   href: OPERATIONS_PATH_NAME.PROJECT_HEALTH,
                //   icon: HealingIcon,
                //   label: OperationMenuLabel.PROJECT_HEALTH,
                // },
                {
                  title: 'Project Billing',
                  href: OPERATIONS_PATH_NAME.PROJECT_BILLING,
                  icon: HealingIcon,
                  label: OperationMenuLabel.PROJECT_BILLING,
                },
                {
                  title: 'MarketPlaceAccount',
                  href: OPERATIONS_PATH_NAME.MARKETPLACEACCOUNT,
                  icon: RecentActorsIcon,
                  label: OperationMenuLabel.MARKETPLACEACCOUNT,
                },
                // {
                //   title: 'Connects',
                //   href: OPERATIONS_PATH_NAME.CONNECT,
                //   icon: LaptopIcon,
                //   label: OperationMenuLabel.CONNECT,
                //   items: [
                {
                  title: 'Leads',
                  href: OPERATIONS_PATH_NAME.CONNECT,
                  icon: RecentActorsIcon,
                  label: OperationMenuLabel.CONNECT,
                },
                //     {
                //       title: 'Purchase Connects History',
                //       href: OPERATIONS_PATH_NAME.PURCHASE_CONNECTS,
                //       icon: RecentActorsIcon,
                //       label: OperationMenuLabel.PURCHASE_CONNECTS,
                //     },
                //   ],
                // },
              ],
            },
            {
              title: 'DotNet',
              icon: SiDotnet,
              label: EMPLOYEE_MENU_LABEL.ACCOUNTS,
              items: [
                // {
                //   title: 'Team-Leaves',
                //   icon: LocalLibraryIcon,
                //   href: PATH_NAME.LEAVE,
                //   label: DRAWER_MENU_LABEL.LEAVE,
                // },
                // {
                //   title: 'Client List',
                //   icon: PregnantWomanIcon,
                //   href: OPERATIONS_PATH_NAME.CLIENT_LIST,
                //   label: OperationMenuLabel.CLIENT_LIST,
                // },
                {
                  title: 'Project List',
                  href: OPERATIONS_PATH_NAME.PROJECT,
                  icon: AssignmentIcon,
                  label: OperationMenuLabel.PROJECT,
                },
                {
                  title: 'EOD Report',
                  icon: BusinessIcon,
                  href: REPORTS_PATH_NAME.EOD_REPORT,
                  label: REPORTS_PATH_NAME.EOD_REPORT,
                },
                {
                  title: 'Project Health',
                  href: OPERATIONS_PATH_NAME.PROJECT_HEALTH,
                  icon: HealingIcon,
                  label: OperationMenuLabel.PROJECT_HEALTH,
                },
              ],
            },
            {
              title: 'PHP',
              icon: FaPhp,
              label: EMPLOYEE_MENU_LABEL.ACCOUNTS,
              items: [
                // {
                //   title: 'Team-Leaves',
                //   icon: LocalLibraryIcon,
                //   href: PATH_NAME.LEAVE,
                //   label: DRAWER_MENU_LABEL.LEAVE,
                // },
                // {
                //   title: 'Client List',
                //   icon: PregnantWomanIcon,
                //   href: OPERATIONS_PATH_NAME.CLIENT_LIST,
                //   label: OperationMenuLabel.CLIENT_LIST,
                // },
                {
                  title: 'Project List',
                  href: OPERATIONS_PATH_NAME.PROJECT,
                  icon: AssignmentIcon,
                  label: OperationMenuLabel.PROJECT,
                },
                {
                  title: 'EOD Report',
                  icon: BusinessIcon,
                  href: REPORTS_PATH_NAME.EOD_REPORT,
                  label: REPORTS_PATH_NAME.EOD_REPORT,
                },
                {
                  title: 'Project Health',
                  href: OPERATIONS_PATH_NAME.PROJECT_HEALTH,
                  icon: HealingIcon,
                  label: OperationMenuLabel.PROJECT_HEALTH,
                },
              ],
            },
            {
              title: 'Creative',
              icon: SiMinds,
              label: EMPLOYEE_MENU_LABEL.ACCOUNTS,
              items: [
                // {
                //   title: 'Team-Leaves',
                //   icon: LocalLibraryIcon,
                //   href: PATH_NAME.LEAVE,
                //   label: DRAWER_MENU_LABEL.LEAVE,
                // },
                // {
                //   title: 'Client List',
                //   icon: PregnantWomanIcon,
                //   href: OPERATIONS_PATH_NAME.CLIENT_LIST,
                //   label: OperationMenuLabel.CLIENT_LIST,
                // },
                {
                  title: 'Project List',
                  href: OPERATIONS_PATH_NAME.PROJECT,
                  icon: AssignmentIcon,
                  label: OperationMenuLabel.PROJECT,
                },
                {
                  title: 'EOD Report',
                  icon: BusinessIcon,
                  href: REPORTS_PATH_NAME.EOD_REPORT,
                  label: REPORTS_PATH_NAME.EOD_REPORT,
                },
                {
                  title: 'Project Health',
                  href: OPERATIONS_PATH_NAME.PROJECT_HEALTH,
                  icon: HealingIcon,
                  label: OperationMenuLabel.PROJECT_HEALTH,
                },
              ],
            },
            {
              title: 'QA',
              icon: PiEqualizerLight,
              label: EMPLOYEE_MENU_LABEL.ACCOUNTS,
              items: [
                // {
                //   title: 'Team-Leaves',
                //   icon: LocalLibraryIcon,
                //   href: PATH_NAME.LEAVE,
                //   label: DRAWER_MENU_LABEL.LEAVE,
                // },
                // {
                //   title: 'Client List',
                //   icon: PregnantWomanIcon,
                //   href: OPERATIONS_PATH_NAME.CLIENT_LIST,
                //   label: OperationMenuLabel.CLIENT_LIST,
                // },
                {
                  title: 'Project List',
                  href: OPERATIONS_PATH_NAME.PROJECT,
                  icon: AssignmentIcon,
                  label: OperationMenuLabel.PROJECT,
                },
                {
                  title: 'EOD Report',
                  icon: BusinessIcon,
                  href: REPORTS_PATH_NAME.EOD_REPORT,
                  label: REPORTS_PATH_NAME.EOD_REPORT,
                },
                {
                  title: 'Project Health',
                  href: OPERATIONS_PATH_NAME.PROJECT_HEALTH,
                  icon: HealingIcon,
                  label: OperationMenuLabel.PROJECT_HEALTH,
                },
              ],
            },
            {
              title: 'Javascript',
              icon: TbBrandJavascript,
              label: EMPLOYEE_MENU_LABEL.ACCOUNTS,
              items: [
                // {
                //   title: 'Team-Leaves',
                //   icon: LocalLibraryIcon,
                //   href: PATH_NAME.LEAVE,
                //   label: DRAWER_MENU_LABEL.LEAVE,
                // },
                // {
                //   title: 'Client List',
                //   icon: PregnantWomanIcon,
                //   href: OPERATIONS_PATH_NAME.CLIENT_LIST,
                //   label: OperationMenuLabel.CLIENT_LIST,
                // },
                {
                  title: 'Project List',
                  href: OPERATIONS_PATH_NAME.PROJECT,
                  icon: AssignmentIcon,
                  label: OperationMenuLabel.PROJECT,
                },
                {
                  title: 'EOD Report',
                  icon: BusinessIcon,
                  href: REPORTS_PATH_NAME.EOD_REPORT,
                  label: REPORTS_PATH_NAME.EOD_REPORT,
                },
                {
                  title: 'Project Health',
                  href: OPERATIONS_PATH_NAME.PROJECT_HEALTH,
                  icon: HealingIcon,
                  label: OperationMenuLabel.PROJECT_HEALTH,
                },
              ],
            },
          ],
        },
        {
          title: 'HR',
          icon: AiOutlineUsergroupAdd,
          label: DRAWER_MENU_LABEL.EMPLOYEE_LIST,
          items: [
            {
              title: 'Resource List',
              icon: PeopleAltIcon,
              href: EMPLOYEE_PATH_NAME.EMPLOYEE,
              label: EMPLOYEE_MENU_LABEL.EMPLOYEE_LIST,
            },
            {
              title: 'Hiring List',
              icon: PeopleAltIcon,
              href: EMPLOYEE_PATH_NAME.EMPLOYEE,
              label: EMPLOYEE_MENU_LABEL.EMPLOYEE_LIST,
            },
            {
              title: 'Leaves',
              icon: SlCalender,
              href: PATH_NAME.LEAVE,
              label: DRAWER_MENU_LABEL.LEAVE,
            },
            // {
            //   title: 'Hiring List',
            //   icon: RiUserSearchLine,
            //   href: REPORTS_PATH_NAME.HIRING_LIST,
            //   label: DRAWER_MENU_LABEL.HIRING_LIST,
            // },
          ],
        },
        {
          title: 'Reports',
          icon: HiOutlineDocumentReport,
          label: REPORTS_MENU_LABEL.REPORTS,
          items: [
            // {
            //   title: 'Master Sheet',
            //   icon: BusinessIcon,
            //   href: REPORTS_PATH_NAME.MASTER_REPORT,
            //   label: REPORTS_MENU_LABEL.MASTER_REPORT,
            // },
            {
              title: 'Bid Report',
              icon: AiOutlineFundProjectionScreen,
              href: REPORTS_PATH_NAME.ACTIVE_REPORTS,
              label: REPORTS_MENU_LABEL.ACTIVE_REPORTS,
            },
            {
              title: 'Projects Report',
              icon: AiOutlineFundProjectionScreen,
              href: REPORTS_PATH_NAME.ACTIVE_REPORTS,
              label: REPORTS_MENU_LABEL.ACTIVE_REPORTS,
            },
            {
              title: 'Client Report',
              icon: AiOutlineFundProjectionScreen,
              href: REPORTS_PATH_NAME.ACTIVE_REPORTS,
              label: REPORTS_MENU_LABEL.ACTIVE_REPORTS,
            },
            {
              title: 'Project Health Report',
              icon: AiOutlineFundProjectionScreen,
              href: REPORTS_PATH_NAME.ACTIVE_REPORTS,
              label: REPORTS_MENU_LABEL.ACTIVE_REPORTS,
            },
            // {
            //   title: 'Weekly Billing Sheet',
            //   icon: LiaCalendarWeekSolid,
            //   href: REPORTS_PATH_NAME.WEEKLY_BILLING_REPORT,
            //   label: REPORTS_MENU_LABEL.WEEKLY_BILLING_REPORT,
            // },
            // {
            // title: 'Weekly Project Report',
            // icon: BusinessIcon,
            // href: REPORTS_PATH_NAME.WEEKLY_PROJECT_REPORT,
            // label: REPORTS_MENU_LABEL.WEEKLY_PROJECT_REPORT,
            // },
            {
              title: 'Weekly Bid connects Reports',
              icon: FaConnectdevelop,
              href: REPORTS_PATH_NAME.CONNECT_HISTORY_REPORTS,
              label: REPORTS_PATH_NAME.CONNECT_HISTORY_REPORTS,
            },
            // {
            //   title: 'EOD Report',
            //   icon: TbReportSearch,
            //   href: REPORTS_PATH_NAME.EOD_REPORT,
            //   label: REPORTS_PATH_NAME.EOD_REPORT,
            // },
            // {
            //   title: 'Capacity Report',
            //   icon: MdReduceCapacity,
            //   href: REPORTS_PATH_NAME.CAPACITY_REPORT,
            //   label: REPORTS_PATH_NAME.CAPACITY_REPORT,
            // },
            // {
            //   title: 'Team Logger Report',
            //   icon: MdTrackChanges,
            //   href: REPORTS_PATH_NAME.TEAMLOGGER_REPORT,
            //   label: REPORTS_MENU_LABEL.TEAMLOGGER_REPORT,
            // },
          ],
        },
      ],
    },
  ];
}

export const navBarCommon = navBar;
