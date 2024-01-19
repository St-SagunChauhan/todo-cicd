import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import deptService from "../../services/deptRequest";
import {
  deptSelector,
  isLoadingSelector,
} from "../../Selectors/departmentSelector";
import { Col, Row, Table, Card, Button, Tooltip, message } from "antd";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";
import CustomSelect from "../../Components/CustomComponents/CustomSelect/CustomSelect";
import {
  EllipsisOutlined,
  ProjectOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  WindowsOutlined,
} from "@ant-design/icons";
import cardBackDrop from "../../assets/images/card-back.jpg";

interface DataType {
  key: string;
  DepartmentName: string;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const DepartmentList = (props: Props) => {
  const { loading } = props;
  const deptData = useSelector(deptSelector);
  const isLoading = useSelector(isLoadingSelector);
  const dispatch = useDispatch();
  const [isOpenUp, setIsOpenUp] = useState(false);
  const { Meta } = Card;

  useEffect(() => {
    loading(100, false);
    // dispatch<any>(deptService.fetchDepartmentList());
    // loading(100);
    loadDeptData();
  }, []);

  const loadDeptData = async () => {
    await dispatch<any>(deptService.fetchDepartmentList());
    loading(100, false);
  };

  const columns = [
    {
      title: "Department Name",
      dataIndex: "departmentName",
      key: "departmentName",
    },
    {
      title: "Total Employee",
      dataIndex: "totaEmployees",
      key: "totaEmployees",
      align: 'center' as const,
    },
    {
      title: "View All Employee",
      dataIndex: "actions",
      key: "actions",
      align: 'center' as const,
      render: (params: any) => {
        return (
          <UnorderedListOutlined
            style={{ color: "#08c" }}
            onClick={() => {
              console.log("Clicked: ", params);
            }}
          />
        );
      },
    },
  ];

  const data: DataType[] =
    deptData &&
    deptData.length >= 0 &&
    deptData.map((data: any, id: number) => {
      return {
        departmentId: data.key,
        departmentName: data.departmentName,
        totaEmployees: data.employees.length,
        actions: data.departmentId,
      };
    });

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        {isLoading
          ? deptData &&
            deptData.map((items: any) => {
              return (
                <Col span={6}>
                  <Card
                    // style={{ width: 300 }}
                    cover={
                      <div className="overlayImgWrap">
                        <img alt="example" src={cardBackDrop} />
                        <div className="overlayImg">
                          <h3 className="secTitle">{items.departmentName}</h3>
                        </div>
                      </div>
                    }
                    actions={[
                      <>
                        <Tooltip title="Show Employees" placement="bottom">
                          <TeamOutlined key="employeList" />
                        </Tooltip>
                      </>,
                      <>
                        <Tooltip title="Show Employees" placement="bottom">
                          <ProjectOutlined key="projectList" />
                        </Tooltip>
                      </>,
                    ]}
                  >
                    <Col
                      span={24}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <Meta title="Total Employees" />
                      <Meta title={items.employees.length ? items.employees.length : "0"} />
                    </Col>
                    <Col
                      span={24}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Meta title="Total Projects" />
                      <Meta title={items.projectDepartments.length ? items.projectDepartments.length : "0"} />
                    </Col>
                  </Card>
                </Col>
              );
            })
          : null}
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24 department-list-table"
            title={`Department List`}
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
};

export default DepartmentList;
