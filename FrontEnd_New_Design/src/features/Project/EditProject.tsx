import react, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Col, Form, Row, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import RoleInputFields from "./RoleInputFields";
import projectService from "../../services/projectRequest";

interface IProps {
  isOpen: boolean;
  handleCloseDialog: () => void;
  row: any;
  loading: (progress: number, value: boolean) => void;
  deptFilter: any;
}

type FieldType = {
  ProjectId: string;
  key: string;
  clientId: string;
  contractName: string;
  contractType: number;
  accounts: number;
  hoursPerWeek: string;
  billingType: number;
  IsActive: boolean;
  status: number;
  projectUrl: string;
  startDate: string;
  communicationMode?: string;
  country: string;
  // jobSuccessRate: string;
  billingStatus: number;
  departmentId: string;
  upworkId: string;
};

export default function EditProject({
  handleCloseDialog,
  row,
  loading,
  deptFilter,
}: IProps): JSX.Element {
  // Components Required Selectors and States
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Required UseStates
  const [valueChanged, setValueChanged] = useState(false);

  // Required UseEffects

  // Initial values

  // Other Methods

  console.log({ row });

  const onFinish = async (values: FieldType) => {
    console.log({ values });
    if (valueChanged) {
      message.loading("Updating...");
      loading(10, false);
      const weekHours = values.hoursPerWeek.replace(":", ".");
      const response = await projectService.updateProject({
        ...values,
        hoursPerWeek: weekHours,
        projectId: row.id,
      });
      if (response.status === 200) {
        loading(100, false);
        message.success("Project Details Updated Successfully");
      } else {
        loading(100, false);
        message.error(response.message);
      }
      handleCloseDialog();
      dispatch<any>(projectService.fetchProjectList(deptFilter));
    } else {
      message.info("no Changes");
    }
  };

  return (
    <>
      <Row
        gutter={[16, 16]}
        style={{ justifyContent: "center", padding: "0px 0px" }}
      >
        <Form
          className="label-text"
          form={form}
          name="editProject"
          labelCol={{ span: 20 }}
          wrapperCol={{ span: 24 }}
          layout="vertical"
          style={{ maxWidth: "700px", width: "100%", padding: "20px 0px" }}
          initialValues={{
            ...row,
            hoursPerWeek: row.hoursPerWeek.replaceAll(".", ":"),
            startDate: dayjs(row.startDate, "YYYY/MM/DD"),
          }}
          onFinish={onFinish}
          autoComplete="off"
          onValuesChange={() => setValueChanged(true)}
        >
          <RoleInputFields form={form} />

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item className="submit-btn-wrap">
                <Button
                  type="primary"
                  htmlType="submit"
                  // loading={loading}
                  style={{ marginRight: 10 }}
                >
                  Update
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCloseDialog}
                  danger
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Row>
    </>
  );
}
