import React, { useEffect, useState } from "react";
import { Card, Col, Row, Table } from "antd";
import {
  ContractStatus,
  ContractType,
} from "../../Enums/LeadsConnect/BillingStatus";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";

interface DataType {
  key: string;
  contractName: string;
  upworkId: string;
  projectUrl: string;
  clientId: string;
  contractType: string;
  billingHours: string;
  createdDate: string;
  hoursPerWeek: string;
  status: string;
  billingStatus: string;
  communicationMode: string;
  employeeId: string;
}

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  projectData: any;
};

export default function ProjectHistory({
  isOpen,
  handleCloseDialog,
  projectData,
}: IProps): JSX.Element {
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
  function renderCommaSeparatedCell(params: any) {
    // Assuming the 'values' field is an array
    const values = params.employeeId;
    if (Array.isArray(values)) {
      return <span>{values.join(", ")}</span>;
    }
    return null;
  }

  const columns = [
    {
      title: "Project Name",
      dataIndex: "contractName",
      key: "contractName",
    },
    {
      title: "Edit Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (e: any, item: any) =>
        item.createdDate ? item.createdDate.split("T")[0] : "N/A",
    },
    {
      title: "Billing Hours",
      dataIndex: "hoursPerWeek",
      key: "hoursPerWeek",
      align: "center" as const,
    },
    {
      title: "Project Status",
      dataIndex: "billingStatus",
      key: "billingStatus",
      align: "center" as const,
      render: (value: number | string) =>
        getEnumNameFromValue(value, ContractStatus),
    },
    {
      title: "Contract Type",
      dataIndex: "contractType",
      key: "contractType",
      align: "center" as const,
      render: (value: number | string) =>
        getEnumNameFromValue(value, ContractType),
    },
    {
      title: "Assigned To",
      dataIndex: "employeeId",
      key: "employeeId",
    },
    {
      title: "Communication Mode",
      dataIndex: "communicationMode",
      key: "communicationMode",
      align: "center" as const,
    },
    {
      title: "Project Url",
      dataIndex: "projectUrl",
      key: "projectUrl",
    },
  ];

  const data: DataType[] =
    projectData &&
    projectData.length > 0 &&
    projectData.map((data: any, item: number) => {
      return {
        id: data.id,
        contractName: data.contractName,
        upworkName: data.upworkName,
        hoursPerWeek: data.hoursPerWeek,
        billingStatus: data.billingStatus,
        contractType: data.contractType,
        hiredId: data.hiredId,
        createdDate: data.createdDate,
        projectUrl: data.projectUrl,
        communicationMode: data.communicationMode,
        employeeId: data.employeeId,
      };
    });

  return (
    <>
      <Row gutter={[16, 16]} style={{ display: "block", width: "100%" }}>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            // title={`Project History`}
          >
            <div className="table-responsive">
              <SkeletonTable
                columns={columns as SkeletonTableColumnsType[]}
                active
              >
                <Table columns={columns} dataSource={data} size="large" />
              </SkeletonTable>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
