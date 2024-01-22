import { DeptEnum } from "../Enums/DeptEnum/DeptEnum";
import { RoleEnum } from "../features/Employee/EmployeeModel";
import authService from "../services/authServices";

export const pageLocation = (url: String) => {
  const userInfo: any = JSON.parse(authService.getUser());
  const pathName = url.split("/").filter((x) => x);
  if (pathName && pathName.length > 0) {
    if (userInfo?.role === RoleEnum.TeamLead.name) {
      return {
        deptFilter: userInfo?.departmentId,
        pathName: pathName[1].replaceAll("-", "_"),
      }      
    } else {
      const deptFilterEnum = pathName[1].replaceAll("-", "_");

      const newFilterDept = Object.values(DeptEnum).filter((dept) => {
        return dept.name
          .toLocaleLowerCase()
          .includes(deptFilterEnum.toLocaleLowerCase());
      });
      return {
        deptFilter: newFilterDept.length > 0 ? newFilterDept[0].value : null,
        pathName: pathName[1].replaceAll("-", "_"),
      };
    }
  }
};
