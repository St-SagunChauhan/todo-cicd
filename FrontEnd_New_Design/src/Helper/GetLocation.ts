import { DeptEnum } from "../Enums/DeptEnum/DeptEnum";

export const pageLocation = (url: String) => { 
    const pathName = url.split("/").filter((x) => x);
    if (pathName && pathName.length > 0) {
        const deptFilterEnum = pathName[1].replaceAll("-", "_");
  
        const newFilterDept = Object.values(DeptEnum).filter((dept) => {
          return dept.name
            .toLocaleLowerCase()
            .includes(deptFilterEnum.toLocaleLowerCase());
        });
        return {deptFilter: newFilterDept.length > 0 ? newFilterDept[0].value : null, pathName: pathName[1].replaceAll("-", "_")}
      }
}