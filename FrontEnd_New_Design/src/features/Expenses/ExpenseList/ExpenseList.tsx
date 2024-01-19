import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import hRExpenseServices from "../../../services/epenseServices";
import {
  hrExpenseSelector,
  isLoadingSelector,
} from "../../../Selectors/expenseSelector";
import {
  Button,
  Col,
  Divider,
  Row,
  DatePicker,
  Table,
  Card,
  Skeleton,
  List,
  Upload,
  UploadProps,
  message,
} from "antd";
import {
  DownloadOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import UploadComponent from "../../../Components/UploadComponent";
import Dragger from "antd/es/upload/Dragger";
import SkeletonTable from "../../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../../Layout/SkeletonTable/SkeletonTable";

// const Dragger = Upload;

interface DataType {
  key: string;
  Name: string;
  Jan: number;
  Feb: number;
  Mar: number;
  Apr: number;
  May: number;
  Jun: number;
  Jul: number;
  Aug: number;
  Sep: number;
  Oct: number;
  Nov: number;
  Dec: number;
}

interface Props {
  loading: (progress: number, value: boolean) => void;
}

const ExpenseList = (props: Props) => {
  const { loading } = props;
  const expenseList = useSelector(hrExpenseSelector);
  const isLoading = useSelector(isLoadingSelector);
  const dispatch = useDispatch();
  const [isOpenUp, setIsOpenUp] = useState(false);
  const [year, setYear] = useState();
  const [currDateYear, setCurrDateYear] = useState<number>();

  useEffect(() => {
    loading(100, false);
    dispatch<any>(hRExpenseServices.fetchHRExpensesList());
    const currDate = new Date();
    setCurrDateYear(currDate.getFullYear());
    setCurrYear();
    loading(100, false);
  }, []);

  const setCurrYear = (year?: any) => {
    console.log(year);

    if (year === null) {
      setYear(expenseList[0].expenseYear);
    } else {
      setYear(year);
    }
  };
  const onChangeYear = (years: any, dateString: any) => {
    if (dateString === "") {
      dispatch<any>(hRExpenseServices.fetchHRExpensesList());
      setCurrYear();
    } else {
      dispatch<any>(hRExpenseServices.fetchHRExpensesList(dateString));
      setCurrYear(dateString);
    }
  };
  const handelUpClose = () => {
    setIsOpenUp(false);
  };

  const handelUploadFile = () => {
    console.log("Ok");
  };

  const columns = [
    {
      title: "Expense Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "January",
      dataIndex: "Jan",
      key: "Jan",
    },
    {
      title: "February",
      dataIndex: "Feb",
      key: "Feb",
    },
    {
      title: "March",
      dataIndex: "Mar",
      key: "Mar",
    },
    {
      title: "April",
      dataIndex: "Apr",
      key: "Apr",
    },
    {
      title: "May",
      dataIndex: "May",
      key: "May",
    },
    {
      title: "June",
      dataIndex: "Jun",
      key: "Jun",
    },
    {
      title: "July",
      dataIndex: "Jul",
      key: "Jul",
    },
    {
      title: "August",
      dataIndex: "Aug",
      key: "Aug",
    },
    {
      title: "September",
      dataIndex: "Sep",
      key: "Sep",
    },
    {
      title: "October",
      dataIndex: "Oct",
      key: "Oct",
    },
    {
      title: "November",
      dataIndex: "Nov",
      key: "Nov",
    },
    {
      title: "December",
      dataIndex: "Dec",
      key: "Dec",
    },
  ];

  const draggerProps: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const data: DataType[] =
    expenseList &&
    expenseList.length >= 0 &&
    expenseList.map((data: any, id: number) => {
      return {
        key: data.expenseId,
        Name: data.expenseName,
        Jan: data.january,
        Feb: data.february,
        Mar: data.march,
        Apr: data.april,
        May: data.may,
        Jun: data.june,
        Jul: data.july,
        Aug: data.august,
        Sep: data.september,
        Oct: data.october,
        Nov: data.november,
        Dec: data.december,
      };
    });
  return (
    <>
      <Row gutter={[16, 4]}>
        <Col span={12} style={{ display: "flex", justifyContent: "start" }}>
          <DatePicker style={{ width: "100%", maxWidth: "200px" }} size="large" picker="year" onChange={onChangeYear} />
        </Col>
        <Col span={12} style={{ display: "flex", justifyContent: "end" }}>
          <Button type="default" icon={<DownloadOutlined />}>
            Download Report
          </Button>
          <Divider
            type="vertical"
            style={{ height: "100%", backgroundColor: "#F1416C" }}
          />
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setIsOpenUp(true)}
          >
            Upload File
          </Button>
          <UploadComponent
            isOpen={isOpenUp}
            onClose={handelUpClose}
            content={
              <Dragger {...draggerProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibited from
                  uploading company data or other banned files.
                </p>
              </Dragger>
            }
            action={handelUploadFile}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col span={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title={`Expense Year: ${year ? year : currDateYear}`}
          >
            <div className="table-responsive">
              <SkeletonTable
                loading={isLoading}
                columns={columns as SkeletonTableColumnsType[]}
                active
              >
                <Table showHeader bordered columns={columns} dataSource={data} size="small" />
              </SkeletonTable>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ExpenseList;
