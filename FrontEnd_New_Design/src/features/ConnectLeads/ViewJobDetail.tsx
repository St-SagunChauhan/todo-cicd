// DetailViewModal.tsx
import React from "react";
import { Modal, Table } from "antd";
import {
  AccountTypes,
  BillingTypes,
  ContractStatus,
  ContractType,
} from "../../Enums/LeadsConnect/BillingStatus";
import { countries } from "../../Helper/countries";
import { useSelector } from "react-redux";
import { marketPlaceAccountSelector } from "../../Selectors/marketPlaceAccountSelector";
import { deptSelector } from "../../Selectors/departmentSelector";

interface DetailViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any | null; // Assume DataType is imported from the parent component
}

const DetailViewModal: React.FC<DetailViewModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const accountData = useSelector(marketPlaceAccountSelector);
  const deptData = useSelector(deptSelector);

  const getFieldFromDepartment = (Id: any, field: string) => {
    const deptName =
      deptData && deptData.find((dept: any) => dept.departmentId === Id);
    return deptName ? deptName[field] : null;
  };

  const getEnumNameFromValue = (
    value: number | string,
    enumObject: Record<string, any>
  ) => {
    // Convert value to number
    const numericValue =
      typeof value === "string" ? parseInt(value, 10) : value;

    const match = Object.values(enumObject).find(
      (item) => item.value === numericValue
    );

    return match ? match.name : undefined;
  };

  const getFieldFromAccount = (Id: any, field: string) => {
    const account =
      accountData &&
      accountData.find((accountItem: any) => accountItem.id === Id);
    return account ? account[field] : null;
  };

  const columns = [
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName ",
    },
    {
      title: "Project Url",
      dataIndex: "projectUrl",
      key: "projectUrl ",
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Account Types",
      dataIndex: "accountTypes",
      key: "accountTypes",
      render: (value: number | string) =>
        getEnumNameFromValue(value, AccountTypes),
    },
    {
      title: "Country Name",
      dataIndex: "countryName",
      key: "countryName",
      render: (e: any, item: any) => {
        const countryData = countries.find(
          (country: any) => country.code === item.countryName
        );
        return countryData ? countryData.label : e;
      },
    },
    {
      title: "Hired Profile ",
      dataIndex: "hiredProfile",
      key: "hiredProfile",
      render: (e: any, item: any) => {
        const Id = item.hiredProfile;
        const hiredProfile = getFieldFromAccount(Id, "name");
        return hiredProfile;
      },
    },
    {
      title: "Communication Profile",
      dataIndex: "communicationProfile",
      key: "communicationProfile",
      render: (e: any, item: any) => {
        const Id = item.communicationProfile;
        const communicationProfile = getFieldFromAccount(Id, "name");
        return communicationProfile;
      },
    },
    {
      title: "Contract Type",
      dataIndex: "contracType",
      key: "contracType",
      render: (value: number | string) =>
        getEnumNameFromValue(value, ContractType),
    },
    {
      title: "Weekly Hours",
      dataIndex: "weeklyHours",
      key: "weeklyHours",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (e: any, item: any) =>
        item.startDate ? item.startDate.split("T")[0] : "N/A",
    },
    {
      title: "Billing Type",
      dataIndex: "billingType",
      key: "billingType",
      render: (value: number | string) =>
        getEnumNameFromValue(value, BillingTypes),
    },
    {
      title: "Project Status",
      dataIndex: "billingStatus",
      key: "billingStatus",
      render: (value: number | string) =>
        getEnumNameFromValue(value, ContractStatus),
    },
    // Add more non-required columns here
  ];

  return (
    <Modal
      open={isOpen}
      title={
        data ? (
          <span>
            Job Details of -{" "}
            <span style={{ color: "red" }}>{data.projectName}</span>
          </span>
        ) : (
          "Job Details of"
        )
      }
      onCancel={onClose}
      footer={null}
      width={2000} // Adjust the width as needed
      //style={{ width: "100%!important" }}
    >
      {data && (
        <Table columns={columns} dataSource={[data]} pagination={false} />
      )}
    </Modal>
  );
};

export default DetailViewModal;
