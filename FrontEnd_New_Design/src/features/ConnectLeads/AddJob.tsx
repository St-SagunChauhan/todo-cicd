import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import leadService from "../../services/leadsConnectService";
import { deptSelector } from "../../Selectors/departmentSelector";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Grid,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import { IDept } from "../Department/DeptModel";
import {
  AccountTypes,
  BillingTypes,
  ContractStatus,
  ContractType,
  StatusEnum,
} from "../../Enums/LeadsConnect/BillingStatus";
import { marketPlaceAccountSelector } from "../../Selectors/marketPlaceAccountSelector";
import deptService from "../../services/deptRequest";
import marketPlaceService from "../../services/marketPlaceAccountRequest";
import { IMarketPlaceAccount } from "../MarketPlaceAccount/MarketPlaceAccountModel";
// import "../ConnectLeads/Connect.css";
import { useNavigate } from "react-router";
import { CountryType, countries } from "../../Helper/countries";
// import { Input } from 'antd';

const { TextArea } = Input;

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  employeeData: any;
  loading: (progress: number, value: boolean) => void;
};

type FieldType = {
  projectName: string;
  upworkId: string;
  accountTypes: string;
  jobUrl: string;
  jobdescription: string;
  connects: string;
  projectUrl: string;
  clientName: string;
  countryName: string;
  hiredProfile: string;
  email: string;
  mobile: string;
  communicationProfile: string;
  departmentId: string;
  contractType: string;
  weeklyHours: string;
  status: string;
  startDate: string;
  billingType: string;
  billingStatus: string;
};
type SizeType = Parameters<typeof Form>[0]["size"];

export default function AddBid({
  isOpen,
  handleCloseDialog,
  employeeData,
  loading,
}: IProps): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const deptData = useSelector(deptSelector);
  const marketplace = useSelector(marketPlaceAccountSelector);
  const [showHired, setShowHired] = useState(false);
  const [nameRequired, setNameRequired] = useState(false);

  useEffect(() => {
    loading(100, false);
    loadDeptData();
  }, []);

  const loadDeptData = async () => {
    await dispatch<any>(deptService.fetchDepartmentList());
    await dispatch<any>(marketPlaceService.fetchMarketPlaceAccountList());
    loading(100, false);
  };

  const marketplaceOptions =
    marketplace &&
    marketplace.length &&
    marketplace?.map((market: IMarketPlaceAccount, key: number) => ({
      label: `${market.name}`,
      value: market.id,
    }));

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onFinish = (value: FieldType) => {
    loading(100, true);

    const stringValue = {
      ...value,
      contractType:
        value.contractType !== null ? String(value.contractType) : null,
    };

    leadService
      .createBid(stringValue)
      .then((response) => {
        // Handle success
        if (response.data.success) {
          message.success("Bid Created Successfully");
          // Reset form fields
          form.resetFields();
          loading(100, false);
        } else {
          message.error("Something Went Wrong");
          loading(100, false);
        }
        dispatch<any>(leadService.fetchbidsList());
        navigate("/operations/business-Developement/Job_Status");
      })
      .catch((error) => {
        message.error("Failed to create Bid");
        loading(100, false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Row style={{ padding: "20px" }}>
      <Col span={24}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout="vertical"
          autoFocus
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size={"large" as SizeType}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={[30, 0]}>
            <Col span={24} className="form-fields-content">
              <Row gutter={[30, 30]}>
                <Col span={24} className="form-fields">
                  <Row gutter={[30, 30]}>
                    <Col span={6}>
                      <Form.Item
                        label="Project Name"
                        name="projectName"
                        rules={[
                          {
                            required: true,
                            message: "Please input Project Name!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12} className="form-fields">
                      <Form.Item
                        label="Job Url"
                        name="jobUrl"
                        rules={[
                          { required: false, message: "Please input Job Url!" },
                          {
                            pattern: /^https:\/\//,
                            message: "Job Url must start with 'https://'",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={6} className="form-fields">
                      <Form.Item
                        label="Upwork Id"
                        name="upworkId"
                        rules={[
                          {
                            required: true,
                            message: "Please input Upwork Id!",
                          },
                        ]}
                      >
                        <Select
                          showSearch={true}
                          placeholder="Select a Upwork Account"
                          filterOption={filterOption}
                          options={marketplaceOptions || []}
                        ></Select>
                      </Form.Item>
                    </Col>
                    <Col span={6} className="form-fields">
                      <Form.Item
                        label="Client Name"
                        name="clientName"
                        rules={[
                          {
                            required: nameRequired,
                            message: "Please input ClientName!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          {
                            required: false,
                            type: "email",
                            message: "Please input Email!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12} className="form-fields">
                      <Row gutter={[30, 30]}>
                        <Col span={8}>
                          <Form.Item
                            label="Connects"
                            name="connects"
                            rules={[
                              {
                                required: true,
                                pattern: new RegExp("^\\+?[1-9][0-9]{0,99}$"),
                                message: "Please input Connects!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={8} className="form-fields">
                          <Form.Item
                            label="Contract Type"
                            name="contracType"
                            rules={[
                              {
                                required: false,
                                message: "Please input Contract Type!",
                              },
                            ]}
                          >
                            <Select placeholder="Select a ContractType">
                              {Object.values(ContractType).map((item: any) => (
                                <Select.Option
                                  key={item.value}
                                  value={item.value}
                                >
                                  {item.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8} className="form-fields">
                          <Form.Item
                            label="Country Name"
                            name="countryName"
                            rules={[
                              {
                                required: true,
                                message: "Please input Country Name!",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Select a Country"
                              showSearch // Enable search functionality
                              optionFilterProp="children" // Search based on children elements (country names)
                              filterOption={(input, option) =>
                                (option?.children as unknown as string)
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              } // Filter options based on input
                            >
                              {Object.values(countries).map(
                                (item: CountryType) => (
                                  <Select.Option
                                    key={item.code}
                                    value={item.code}
                                  >
                                    {item.label}
                                  </Select.Option>
                                )
                              )}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>

                <Col span={8} className="form-fields">
                  <Row gutter={[30, 30]}>
                    <Col span={24}>
                      <Form.Item
                        label="Job Description"
                        name="jobdescription"
                        rules={[
                          {
                            required: true,
                            message: "Please input Job description!",
                          },
                        ]}
                      >
                        <TextArea rows={6} />
                        {/* <TextArea rows={4} placeholder="maxLength is 6" maxLength={6} /> */}

                        {/* <Input /> */}
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={16} className="form-fields">
                  <Row gutter={[30, 30]}>
                    <Col span={7}>
                      <Form.Item
                        label="Communication Mode"
                        name="communicationmode"
                        rules={[
                          {
                            required: false,
                            message: "Please input a Communication Mode!",
                          },
                        ]}
                      >
                        <Input type="tel" />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        label="Mobile"
                        name="mobile"
                        rules={[
                          {
                            required: false,
                            pattern: new RegExp("^[0-9]{10}$"),
                            message: "Please input a 10-digit Mobile Number!",
                          },
                        ]}
                      >
                        <Input type="tel" />
                      </Form.Item>
                    </Col>

                    <Col span={9} className="form-fields">
                      <Form.Item
                        label="Department Name"
                        name="departmentId"
                        rules={[
                          {
                            required: true,
                            message: "Please select a Department Name!",
                          },
                        ]}
                      >
                        <Select placeholder="Select a Department">
                          {deptData &&
                            deptData.length &&
                            deptData.map((dept: IDept, key: number) => {
                              return (
                                <Select.Option
                                  value={dept.departmentId}
                                  key={key}
                                >
                                  {dept.departmentName}
                                </Select.Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[30, 30]}>
                    <Col span={12} className="form-fields">
                      <Form.Item
                        label="Account Types"
                        name="accountTypes"
                        rules={[
                          {
                            required: true,
                            message: "Please input Account Types!",
                          },
                        ]}
                      >
                        <Select placeholder="Select a AccountTypes">
                          {Object.values(AccountTypes).map((item: any) => (
                            <Select.Option key={item.value} value={item.value}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12} className="form-fields">
                      <Form.Item
                        label="Status"
                        name="status"
                        rules={[
                          { required: true, message: "Please input Status!" },
                        ]}
                      >
                        <Select
                          placeholder="Select a Status"
                          onChange={(e) => {
                            if (e === StatusEnum.Hired.value) {
                              setShowHired(true);
                              setNameRequired(true);
                            } else if (e === StatusEnum.Lead.value) {
                              setShowHired(false);
                              setNameRequired(true);
                            } else {
                              setShowHired(false);
                              setNameRequired(false);
                            }
                          }}
                        >
                          {Object.values(StatusEnum).map((item: any) => (
                            <Select.Option key={item.value} value={item.value}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {showHired ? (
                <>
                  <Divider />
                  <Row gutter={[30, 30]}>
                    <Col span={3} className="form-fields">
                      <Form.Item
                        label="Weekly Hours"
                        name="weeklyHours"
                        rules={[
                          {
                            required: true,
                            message: "Please input Weekly Hours!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={3} className="form-fields">
                      <Form.Item
                        label="Start Date"
                        name="startDate"
                        rules={[
                          {
                            required: true,
                            message: "Please input Start Date!",
                          },
                        ]}
                      >
                        <DatePicker />
                      </Form.Item>
                    </Col>

                    <Col span={4} className="form-fields">
                      <Form.Item
                        label="Project Status"
                        name="billingStatus"
                        rules={[
                          {
                            required: true,
                            message: "Please select a Project Status!",
                          },
                        ]}
                      >
                        <Select placeholder="Select a Project Status">
                          {Object.values(ContractStatus).map((item: any) => (
                            <Select.Option key={item.value} value={item.value}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6} className="form-fields">
                      <Form.Item
                        label="BillingType"
                        name="billingType"
                        rules={[
                          {
                            required: true,
                            message: "Please select a BillingType!",
                          },
                        ]}
                      >
                        <Select placeholder="Select a BillingType">
                          {Object.values(BillingTypes).map((item: any) => (
                            <Select.Option key={item.value} value={item.value}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6} className="form-fields">
                      <Form.Item
                        label="Project Url"
                        name="projectUrl"
                        rules={[
                          {
                            required: false,
                            message: "Please input Project Url!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ) : null}
            </Col>
          </Row>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}
