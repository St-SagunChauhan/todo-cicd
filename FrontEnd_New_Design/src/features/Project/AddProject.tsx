import React from "react";
import { useDispatch, useSelector } from "react-redux";
import projectService from "../../services/projectRequest";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  message,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { deptSelector } from "../../Selectors/departmentSelector";
import {
  AccountTypes,
  BillingTypes,
  ContractStatus,
  ContractType,
} from "../../Enums/LeadsConnect/BillingStatus";
import { marketPlaceAccountSelector } from "../../Selectors/marketPlaceAccountSelector";
import { clientSelector } from "../../Selectors/clientSelector";

type IProps = {
  handleCloseDialog: () => void;
  loading: (progress: number, value: boolean) => void;
  deptFilter: any;
};

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
  hiredId: string;
  communicationMode?: string;
  country: string;
  // jobSuccessRate: string;
  billingStatus: number;
  departmentId: string;
  upworkId: string;
};

export default function AddProject({
  handleCloseDialog,
  loading,
  deptFilter,
}: IProps): JSX.Element {
  // Components Required Selectors and States
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const marketplace = useSelector(marketPlaceAccountSelector);
  const deptData = useSelector(deptSelector);
  const clientData = useSelector(clientSelector);
 

  // Required UseStates

  // Required UseEffects

  // Selective Options

  const clientOptions = clientData.map((item: any) => {
    return { label: item.clientName, value: item.clientId };
  });

  const deptOptions = deptData.map((item: any) => {
    return { label: item.departmentName, value: item.departmentId };
  });

  const billingTypeOptions = Object.values(BillingTypes).map((item: any) => {
    return { label: item.name, value: item.value };
  });

  const contractTypeOptions = Object.values(ContractType).map((item: any) => {
    return { label: item.name, value: item.value };
  });

  const hiredIdOptions = marketplace.map((item: any) => {
    return { label: item.name, value: item.id };
  });

  const billingStatusoptions = Object.values(ContractStatus).map(
    (item: any) => {
      return { label: item.name, value: item.value };
    }
  );

  const accountTypeOptions = Object.values(AccountTypes).map((item: any) => {
    return { label: item.name, value: item.value };
  });

  // Other Code
  const onFinish = async (values: FieldType) => {
    message.loading("Creating new Project");
    loading(10, false);
    const weekHours = values.hoursPerWeek.replace(":", ".");

    projectService
      .addNewProject({
        ...values,
        hoursPerWeek: weekHours,
      })
      .then((response) => {
        if (response.data.success) {
          message.success("Project Created Successfully");
          form.resetFields();
          loading(100, false);
        } else {
          message.error("Something Went Wrong");
          loading(100, false);
        }
        handleCloseDialog();
        dispatch<any>(projectService.fetchProjectList(deptFilter));
      })
      .catch((error) => {
        message.error("Failed to create Bid");
        loading(100, false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleHoursInputChange = (e: any) => {
    const inputValue = e.target.value;
    if (inputValue.length === 3 && inputValue[2] === ":") {
      const forValue = inputValue[0];
      form.setFieldValue("hoursPerWeek", forValue);
    } else if (inputValue.length === 2) {
      const formattedValue = inputValue.replace(/(\d{2})(\d{0,2})/, "$1:$2");
      form.setFieldValue("hoursPerWeek", formattedValue);
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
          layout="vertical"
          name="addProject"
          labelCol={{ span: 20 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: "700px", width: "100%", padding: "20px 0px" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
        >
          <Row gutter={[24, 24]} style={{ justifyContent: "space-between" }}>
            <Col span={12}>
              <Form.Item
                rules={[
                  { required: true, message: "Please Enter Contract Name" },
                  {
                    pattern: new RegExp("^[A-Z a-z]{1,29}$"),
                    message: "Please Enter Proper Name in String Format",
                  },
                ]}
                label="Contract Name"
                name="contractName"
              >
                <Input placeholder="Enter the Contract Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Client Name"
                name="clientId"
                rules={[{ required: true, message: "Please Select a Client" }]}
              >
                <Select
                  showSearch
                  className="custom-select"
                  placeholder="Select Client Name"
                  options={clientOptions}
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ justifyContent: "space-between" }}>
            <Col span={12}>
              <Form.Item
                rules={[
                  { required: true, message: "Please Enter Week Hours" },
                  {
                    pattern: new RegExp("^[0-9][0-9][:][0-9][0-9]"),
                    message:
                      "Please Type Proper Values in Hours and Minutes(HH:MM)",
                  },
                ]}
                label="Hours Per Week"
                name="hoursPerWeek"
              >
                <Input
                  placeholder="HH:MM"
                  type="text"
                  maxLength={5}
                  onChange={handleHoursInputChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  { required: true, message: "Please Select Department" },
                ]}
                label="Department"
                name="departmentId"
              >
                <Select
                  showSearch
                  maxTagCount="responsive"
                  className="custom-select"
                  placeholder="Select Departments"
                  mode="multiple"
                  options={deptOptions}
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ justifyContent: "space-between" }}>
            <Col span={12}>
              <Form.Item
                rules={[
                  { required: true, message: "Please Select Billing Type" },
                ]}
                label="Billing Type"
                name="billingType"
              >
                <Select
                  className="custom-select"
                  placeholder="Select a BillingType"
                  options={billingTypeOptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  { required: true, message: "Please Select Contract Type" },
                ]}
                label="Contract Type"
                name="contractType"
              >
                <Select
                  className="custom-select"
                  placeholder="Select a ContractType"
                  options={contractTypeOptions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ justifyContent: "space-between" }}>
            <Col span={12}>
              <Form.Item label="Project Url" name="projectUrl">
                <Input placeholder="Enter the project URL" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  { required: true, message: "Please Select Start Date" },
                ]}
                label="Start Date"
                name="startDate"
              >
                <DatePicker
                  className="custom-select"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ justifyContent: "space-between" }}>
            <Col span={12}>
              <Form.Item
                rules={[
                  { required: true, message: "Please Select a Hired ID" },
                ]}
                label="Hired Id"
                name="upworkId"
              >
                <Select
                  showSearch
                  className="custom-select"
                  placeholder="Select a Hired Id"
                  options={hiredIdOptions}
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Communication Mode" name="communicationMode">
                <Input placeholder="Enter the Communication Mode" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ justifyContent: "space-between" }}>
            <Col span={12}>
              <Form.Item
                label="Project Status"
                name="billingStatus"
                rules={[
                  { required: true, message: "Please Select Project Status " },
                ]}
              >
                <Select
                  className="custom-select"
                  placeholder="Select a Project billingStatus"
                  options={billingStatusoptions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  { required: true, message: "Please Select Account type" },
                ]}
                label="Account Types"
                name="accounts"
              >
                <Select
                  className="custom-select"
                  placeholder="Select a AccountTypes"
                  options={accountTypeOptions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Form.Item
                style={{ paddingTop: "20px" }}
                wrapperCol={{ offset: 8, span: 16 }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  //   loading={loading}
                  style={{ marginRight: 10 }}
                >
                  Create
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
