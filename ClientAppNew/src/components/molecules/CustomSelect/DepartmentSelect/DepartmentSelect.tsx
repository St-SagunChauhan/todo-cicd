import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import deptService from 'services/dept.Request';
import { deptSelector, isLoadingSelector } from 'selectors/dept.selector';
import { IDept } from 'features/Department/DeptModel';
import CustomSelect from '../CustomSelect';

interface Props {
  id?: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  label?: string;
}

const DepartmentSelect = (props: Props) => {
  const dispatch = useDispatch();
  const deptData = useSelector(deptSelector);
  const isLoading = useSelector(isLoadingSelector);

  useEffect(() => {
    dispatch(deptService.fetchDepartmentList());
  }, []);

  const options =
    deptData && deptData?.length > 0
      ? deptData.map((dep: IDept) => ({ label: dep.departmentName, value: dep.departmentId }))
      : [];

  return <CustomSelect {...props} options={options} loading={isLoading} />;
};

DepartmentSelect.defaultProps = {
  label: 'Department',
  id: 'department-select',
};

export default DepartmentSelect;
