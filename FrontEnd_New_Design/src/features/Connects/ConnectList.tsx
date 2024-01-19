import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Modal, Row, Table, message } from "antd";
import authService from "../../services/authServices";
import { RoleEnum } from "../Employee/EmployeeModel";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";
import { DeptEnum } from "../../Enums/DeptEnum/DeptEnum";
import { useLocation } from "react-router-dom";
import { connectsSelector } from "../../Selectors/connectsSelector";
import moment from "moment";
import AddConnects from "./AddConnects";
import connectService from "../../services/connectRequest";
import { setLoading } from "../../Action/AppAction";

interface DataType {
  key: string;
  dateOfPurchase: string;
  numberOfConnects: string;
  accountType: string;
  amount: string;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
  heading?: string;
}

const ConnectList = (props: Props) => {
  const { loading, heading = `Connect List` } = props;
  const [isOpen, setIsOpen] = useState(false);
  const connectsData = useSelector(connectsSelector);
  const dispatch = useDispatch();
  const [rowData, setRowData] = useState(null);
  const location = useLocation();
  const [pathName, setPathName] = useState<any>();
  const userInfo: any = JSON.parse(authService.getUser());
  const refFile = useRef<any>();
  const [fileList, setFileList] = useState<FileList | null>(null);

  useEffect(() => {
    if (location) {
      const pathnames = location.pathname.split("/").filter((x) => x);
      setPathName(pathnames);
    }
  }, [location]);

  useEffect(() => {
    if (connectsData === null || connectsData === undefined) {
      loading(100, false);
      dispatch<any>(connectService.fetchConnectsList());
      loading(100, false);
    } else {
      loading(100, false);
      const rows = connectsData?.map((connects: any, index: number) => ({
        id: connects.id,
        dateOfPurchase: connects.dateOfPurchase,
        numberOfConnects: connects.numberOfConnects,
        accountType: connects.accountType,
        amount: connects.amount,
      }));
      setRowData(rows);
      loading(100, false);
    }
  }, [dispatch, connectsData]);

  const columns = [
    {
      title: "Date Of Purchase",
      dataIndex: "dateOfPurchase",
      key: "dateOfPurchase",
      render: (date: moment.MomentInput) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Number Of Connects",
      dataIndex: "numberOfConnects",
      key: "numberOfConnects",
    },
    {
      title: "Account Type",
      dataIndex: "accountType",
      key: "accountType",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  const data: DataType[] =
    connectsData &&
    connectsData.length > 0 &&
    connectsData?.map((data: any) => {
      return {
        id: data.id,
        dateOfPurchase: data.dateOfPurchase,
        numberOfConnects: data.numberOfConnects,
        accountType: data.accountType,
        amount: data.amount,
      };
    });

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handelUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
    setLoading(true);

    const response = await connectService.importConnects(e.target.files);
    if (response.status === 400) {
      message.error("Something Went Wrong");
    } else {
      message.success(response.data.message);
    }

    dispatch<any>(connectService.fetchConnectsList());
    setLoading(false);
    e.target.value = "";
  };

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col span={24}>
          <div>
            {(userInfo?.role === RoleEnum.BDM.name ||
              userInfo?.role === RoleEnum.Admin.name) &&
              pathName &&
              pathName[1]
                .replaceAll("-", "_")
                ?.includes(DeptEnum.business_Developement.name) && (
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  size="large"
                  onClick={handleOpenModal}
                >
                  Add Connects
                </Button>
              )}
            <Modal
              width={700}
              open={isOpen}
              title="Create Project"
              style={{ textAlign: "center", paddingBottom: "30px" }}
              onCancel={handleCloseModal}
              footer={null}
            >
              <AddConnects
                handleCloseDialog={handleCloseModal}
                isOpen={isOpen}
              />
            </Modal>
          </div>
        </Col>
        <Col span={24}>
          <div>
            {(userInfo?.role === RoleEnum.BDM.name ||
              userInfo?.role === RoleEnum.Admin.name) &&
              pathName &&
              pathName[1]
                .replaceAll("-", "_")
                ?.includes(DeptEnum.business_Developement.name) && (
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => refFile?.current.click()}
                >
                  <input
                    ref={refFile}
                    id="file"
                    type="file"
                    hidden
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={(e) => {
                      handelUploadFile(e);
                    }}
                  />
                  Upload File
                </Button>
              )}
          </div>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={heading}
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

export default ConnectList;
