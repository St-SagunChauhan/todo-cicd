import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import hiringListService from "../../services/hiringListRequest";
import {
  deptSelector,
  isLoadingSelector as isLoadingDept,
} from "../../Selectors/departmentSelector";
import {
  hiringListSelector,
  isLoadingSelector as hiringListLoading,
} from "../../Selectors/hiringListSelector";
import { setLoading } from "../../Action/AppAction";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Row,
  Table,
  UploadProps,
  message,
} from "antd";
import {
  DownloadOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import UploadComponent from "../../Components/UploadComponent";
import Dragger from "antd/es/upload/Dragger";
import SkeletonTable from "../../Layout/SkeletonTable";
import { SkeletonTableColumnsType } from "../../Layout/SkeletonTable/SkeletonTable";

interface DataType {
  key: string;
  name: string;
  sourceofCV: string;
  contactDetails: string;
  departmentId: string;
  designation: string;
  email: string;
  interviewScheduled: string;
  totalExperience: string;
  currentSalary: string;
  expectedSalary: string;
  pfAccount: string;
  currentEmployer: string;
  noticePeriod: string;
  result: string;
  remarks: string;
  round: string;
  conductedBy: string;
}

export default function HiringList() {
  const dispatch = useDispatch();
  const refFile = useRef<any>();
  const [selectedDept, setSelectedDept] = useState<any>("");
  const [selectedContractType, setContractType] = useState<any>("");
  const [fileList, setFileList] = useState<FileList | null>(null);
  const hiringlist = useSelector(hiringListSelector);
  const loading: boolean = useSelector(hiringListLoading);
  const [isOpenUp, setIsOpenUp] = useState(false);

  useEffect(() => {
    dispatch<any>(hiringListService.fetchHiringListReports());
  }, [dispatch]);

  useEffect(() => {
    setSelectedDept(null);
    setContractType(null);
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Source Of CV",
      dataIndex: "sourceofCV",
      key: "sourceofCV",
    },
    {
      title: "Contact Details",
      dataIndex: "contactDetails",
      key: "contactDetails",
    },
    {
      title: "Source Of CV",
      dataIndex: "sourceofCV",
      key: "sourceofCV",
    },
    {
      title: "Department Name",
      dataIndex: "departmentId",
      key: "departmentId",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Interview Scheduled",
      dataIndex: "interviewScheduled",
      key: "interviewScheduled",
    },
    {
      title: "Total Experience",
      dataIndex: "totalExperience",
      key: "totalExperience",
    },
    {
      title: "Current Salary",
      dataIndex: "currentSalary",
      key: "currentSalary",
    },
    {
      title: "Expected Salary",
      dataIndex: "expectedSalary",
      key: "expectedSalary",
    },
    {
      title: "PF Account",
      dataIndex: "pfAccount",
      key: "pfAccount",
    },
    {
      title: "Current Employer",
      dataIndex: "currentEmployer",
      key: "currentEmployer",
    },
    {
      title: "notice Period",
      dataIndex: "noticePeriod",
      key: "noticePeriod",
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Round",
      dataIndex: "round",
      key: "round",
    },
    {
      title: "Conducted By",
      dataIndex: "conductedBy",
      key: "conductedBy",
    },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
    setLoading(true);

    const response = await hiringListService.ImportHiringList(e.target.files);
    // if (response.status === 400) {
    //   message.error({
    //     icon: "error",
    //     // title: response.data.message,
    //   });
    // } else {
    //   Swal.fire({
    //     customClass: "alertBottomRight",
    //     position: "center",
    //     icon: "success",
    //     // title: response.data.message,
    //     showConfirmButton: false,
    //     timer: 5000,
    //   });
    // }

    dispatch<any>(hiringListService.fetchHiringListReports());
    setLoading(false);
    e.target.value = "";

    // const handelDownload = async () => {
    //   try {
    //     await hiringListService.downloadProjectSampleExcel();
    //   } catch (error) {
    //     throw Error();
    //   }
    // };
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info: any) {
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
    onDrop(e: any) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handelUpClose = () => {
    setIsOpenUp(false);
  };
  const handelUploadFile = () => {
    console.log("Ok");
  };

  const data: DataType[] =
    hiringlist &&
    hiringlist.length >= 0 &&
    hiringlist.map((data: any, id: number) => {
      return {
        key: data.hiringListId,
        name: data.name,
        sourceofCV: data.sourceofCV,
        contactDetails: data.contactDetails,
        departmentId: data.departmentId,
        designation: data.designation,
        email: data.email,
        interviewScheduled: data.interviewScheduled,
        totalExperience: data.totalExperience,
        currentSalary: data.currentSalary,
        expectedSalary: data.expectedSalary,
        pfAccount: data.pfAccount,
        currentEmployer: data.currentEmployer,
        noticePeriod: data.noticePeriod,
        result: data.result,
        remarks: data.remarks,
        round: data.round,
        conductedBy: data.conductedBy,
      };
    });

  return (
    <>
      <Row gutter={[16, 4]}>
        <Col span={12} style={{ display: "flex", justifyContent: "start" }}>
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
              <Dragger {...props}>
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
            title={`Hiring List`}
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
