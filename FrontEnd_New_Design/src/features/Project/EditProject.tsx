import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { empSelector } from "../../Selectors/employeeSelector";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  message,
} from "antd";
import {
  CloseOutlined,
  ExclamationCircleOutlined,
  LikeOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import authService from "../../services/authServices";
import { deptSelector } from "../../Selectors/departmentSelector";
import { USER_ROLE } from "../../Config";
import { clientSelector } from "../../Selectors/clientSelector";
import {
  AccountTypes,
  BillingTypes,
  ContractStatus,
  ContractType,
} from "../../Enums/LeadsConnect/BillingStatus";
import { marketPlaceAccountSelector } from "../../Selectors/marketPlaceAccountSelector";
import dayjs from "dayjs";

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  row: any;
  loading: (progress: number, value: boolean) => void;
};

export default function EditProject({
  handleCloseDialog,
  row,
  loading,
}: IProps): JSX.Element {
  // Components Required Selectors and States
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const empData = useSelector(empSelector);
  const deptData = useSelector(deptSelector);
  const clientData = useSelector(clientSelector);
  const marketplace = useSelector(marketPlaceAccountSelector);
  const loggedInUser = JSON.parse(authService.getUser());

  // Required UseStates

  // Required UseEffects

  // Initial values

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
      return { label: item.name, value: item.value.toString() };
    }
  );

  const accountTypeOptions = Object.values(AccountTypes).map((item: any) => {
    return { label: item.name, value: item.value };
  });

  const empOptions = empData.map((item: any) => {
    return {
      label: `${item.firstName} ${item.lastName}`,
      value: item.employeeId,
    };
  });

  const healthMenu = [
    {
      label: (
        <>
          <LikeOutlined style={{ fontSize: "20px", color: " green" }} /> Good
        </>
      ),
      value: 1,
    },
    {
      label: (
        <>
          <WarningOutlined style={{ fontSize: "20px", color: "yellow" }} /> Avg
        </>
      ),
      value: 2,
    },
    {
      label: (
        <>
          <ExclamationCircleOutlined
            style={{ fontSize: "20px", color: "red" }}
          />{" "}
          Danger
        </>
      ),
      value: 3,
    },
  ];

  // Other Methods

  console.log({ row });

  const onFinish = async (values: any) => {
    console.log({ values });

    // Use formData to get the updated values
    // formData.contractType = formData.contractType.toString();
    // formData.employeeIds = data.assignedTo;
    // if (isNaN(formData.projectHealthRate)){
    //   formData.projectHealthRate =
    //     ProjectHealthRateEnum[
    //       data.projectHealthRate as keyof typeof ProjectHealthRateEnum
    //     ].value;
    // }
    // const response = await projectService.updateProject(formData);
    // if (response.status === 200) {
    //   message.success("Project Details Updated Successfully");
    //   setLoading(false);
    // } else {
    //   message.error(response.message);
    // }
    // setIsOpenEditModal(false);
    // handleCloseDialog();
    // dispatch<any>(projectService.fetchProjectList(deptFilter));
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo);
  };

  const RoleInputFields: React.FC = () => {
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

    switch (loggedInUser.role) {
      case USER_ROLE.ADMIN || USER_ROLE.BDM || USER_ROLE.BD:
        return (
          <>
            <Row gutter={[24, 24]} style={{ justifyContent: "space-between" }}>
              <Col span={12}>
                <Form.Item
                  rules={[
                    { required: true, message: "Please Enter Contract Name" },
                    {
                      pattern: new RegExp("^[A-Za-z]{1,29}$"),
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
                  rules={[
                    { required: true, message: "Please Select a Client" },
                  ]}
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
                <Form.Item label="Assign To" name="employeeId">
                  <Select
                    showSearch
                    className="custom-select"
                    placeholder="Select Employee"
                    options={empOptions}
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
                <Form.Item
                  label="Project Health"
                  name="projectHealthRate"
                  rules={[
                    { required: true, message: "Please Select a Client" },
                  ]}
                >
                  <Select
                    className="custom-select"
                    placeholder="Select Project Health"
                    options={healthMenu}
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
                    {
                      required: true,
                      message: "Please Select Project Status ",
                    },
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

            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item label="Issues" name="issue">
                      <Input.TextArea rows={4} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Solution" name="solution">
                      <Input.TextArea rows={4} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Form.Item label="Remarks" name="remarks">
                      <Input.TextArea rows={4} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        );
      case USER_ROLE.TEAMLEAD:
        return (<>
          
        <Row gutter={[24, 24]} style={{ justifyContent: "space-between" }}>
              <Col span={12}>
              <Form.Item rules={[{required: true, message: "Please Select an Employee"}]} label="Assign To" name="employeeId">
                  <Select
                    showSearch
                    className="custom-select"
                    placeholder="Select Employee"
                    options={empOptions}
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
                <Form.Item
                  label="Project Health"
                  name="projectHealthRate"
                  rules={[
                    { required: true, message: "Please Select a Client" },
                  ]}
                >
                  <Select
                    className="custom-select"
                    placeholder="Select Project Health"
                    options={healthMenu}
                  />
                </Form.Item>
              </Col>
          </Row>
          
          <Row gutter={[24, 24]} style={{ justifyContent: "space-between" }}>
              <Col span={24}>
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
          
          <Divider />

          <Row gutter={[16, 16]}>
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item label="Issues" name="issue">
                      <Input.TextArea rows={4} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Solution" name="solution">
                      <Input.TextArea rows={4} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Form.Item label="Remarks" name="remarks">
                      <Input.TextArea rows={4} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
          </Row>
          
        </>);
    }

    return <>Demo</>;
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
          initialValues={{...row, hoursPerWeek: row.hoursPerWeek.replaceAll(".", ":"), startDate: dayjs(row.startDate, "YYYY/MM/DD")}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <RoleInputFields />
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
