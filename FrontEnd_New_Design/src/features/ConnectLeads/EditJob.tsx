import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { IDept } from "../Department/DeptModel";
import { deptSelector } from "../../Selectors/departmentSelector";
import leadService from "../../services/leadsConnectService";
import marketPlaceService from "../../services/marketPlaceAccountRequest";
import bidService from "../../services/leadsConnectService";
import {
  AccountTypes,
  BillingTypes,
  ContractStatus,
  ContractType,
  StatusEnum,
} from "../../Enums/LeadsConnect/BillingStatus";
import { leadsConnectSelector } from "../../Selectors/leadsConnectSelector";
import { marketPlaceAccountSelector } from "../../Selectors/marketPlaceAccountSelector";
import { IMarketPlaceAccount } from "../MarketPlaceAccount/MarketPlaceAccountModel";
import moment from "moment";
import deptService from "../../services/deptRequest";
import TextArea from "antd/es/input/TextArea";
import { CountryType, countries } from "../../Helper/countries";
import dayjs from "dayjs";

type IProps = {
  handleCloseDialog: () => void;
  isOpen: boolean;
  bidData: any | null;
  loading: (progress: number, value: boolean) => void;
};

export default function EditBid({
  isOpen,
  handleCloseDialog,
  bidData,
  loading,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [showHired, setShowHired] = useState(false);
  const deptData = useSelector(deptSelector);
  const marketplace = useSelector(marketPlaceAccountSelector);
  const bid = useSelector(leadsConnectSelector);
  const [initialValue, setInitialValue] = useState({});
  const [formData, setFormData] = useState({
    bidId: bidData.bidId,
    projectName: bidData.projectName,
    upworkId: bidData.upworkId,
    accountTypes: bidData.accountTypes,
    jobUrl: bidData.jobUrl,
    jobdescription: bidData.jobdescription,
    connects: bidData.connects,
    projectUrl: bidData.projectUrl,
    clientName: bidData.clientName,
    countryName: bidData.countryName,
    hiredProfile: bidData.hiredProfile,
    email: bidData.email,
    mobile: bidData.mobile,
    communicationProfile: bidData.communicationProfile,
    departmentId: bidData.departmentId,
    contracType: bidData.contracType,
    weeklyHours: bidData.weeklyHours,
    status: bidData.status,
    startDate: bidData.startDate,
    billingType: bidData.billingType,
    billingStatus: bidData.billingStatus,
    communicationMode: bidData.communicationMode,
  });
  const [form] = Form.useForm();

  const [formChanged, setFormChanged] = useState(false);
  const [nameRequired, setNameRequired] = useState(false);

  const onValuesChange = () => {
    // Set formChanged to true when any field is changed
    setFormChanged(true);
  };

  const toDate = new Date();
  const currDate = `${toDate.getFullYear()}-${(toDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${toDate.getDate().toString().padStart(2, "0")} ${toDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${toDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${toDate
    .getSeconds()
    .toString()
    .padStart(2, "0")}.${toDate.getMilliseconds().toString().padStart(3, "0")}`;

  // Function to update the state when the input values change
  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const marketplaceOptions =
    marketplace &&
    marketplace.length &&
    marketplace?.map((market: IMarketPlaceAccount, key: number) => ({
      label: `${market.name}`,
      value: market.id,
    }));

  useEffect(() => {
    if (bidData.status == StatusEnum.Hired.value) {
      setShowHired(true);
    }
  }, [bidData]);

  // Function to handle changes in select fields
  const handleSelectChange = (field: string, value: string) => {
    handleInputChange(field, value);
  };

  useEffect(() => {
    dispatch<any>(bidService.fetchbidsList());
  }, [dispatch]);

  useEffect(() => {
    dispatch<any>(deptService.fetchDepartmentList());
    dispatch<any>(marketPlaceService.fetchMarketPlaceAccountList());
  }, [dispatch]);

  const onFinish = async () => {
    if (!formChanged) {
      return;
    }
    loading(20, false);

    const payload = {
      ...formData,
      startDate: dayjs(formData.startDate).format("YYYY-MM-DD HH:mm:ss.SSS"),
    };
    // Use formData to get the updated values
    const response = await leadService.updatebidData(formData);
    if (response.status === 200) {
      // message.success("Bid Updated Successfully");
      loading(100, false);
    } else {
      message.error(response.message);
      loading(100, false);
    }

    handleCloseDialog();
    dispatch<any>(leadService.fetchbidsList());

    if (response.status === 200) {
      message.success(response.data.message);
    } else {
      message.error(response.data.message);
    }
    dispatch<any>(leadService.fetchbidsList());
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  console.log(moment(bidData.startDate).format("YYYY-MM-DD HH:mm:ss"));

  // const getAccountTypeName = (value: number) => {
  //   const match = Object.values(AccountTypes).find(
  //     (item) => item.value === value
  //   );
  //   return match ? match.name : undefined;
  // };
  // Generic function to get enum name from value
  const getEnumNameFromValue = (
    value: number,
    enumObject: Record<string, any>
  ) => {
    const match = Object.values(enumObject).find(
      (item) => item.value === value
    );
    return match ? match.name : undefined;
  };

  const handleFormChange = (data: typeof formData) => {
    if (data?.startDate) {
      setFormData({
        ...formData,
        startDate: dayjs(data.startDate).format("YYYY-MM-DD"),
      });
    }
  };

  return (
    <>
      <Row style={{ padding: "20px" }}>
        <Col span={24}>
          <Form
            name="basic"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            layout="vertical"
            autoFocus
            initialValues={{ remember: true }}
            onValuesChange={(_, values) => {
              onValuesChange(); // Call the original handler
              handleFormChange(values); // Call your custom handler
            }}
            onFinish={onFinish}
            size={"large"}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <Row gutter={[30, 0]}>
              <Col span={24} className="form-fields-content">
                <Row gutter={[30, 0]}>
                  <Col span={24} className="form-fields">
                    <Row gutter={[30, 0]}>
                      <Col span={6}>
                        <Form.Item
                          className="input-selected-field"
                          label="Project Name"
                          name="projectName"
                          initialValue={bidData.projectName}
                          rules={[
                            {
                              required: true,
                              message: "Please input Project Name!",
                            },
                          ]}
                        >
                          <Input
                            onChange={(e) =>
                              handleInputChange("projectName", e.target.value)
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Job Url"
                          name="jobUrl"
                          initialValue={bidData.jobUrl}
                          rules={[
                            {
                              required: false,
                              message: "Please input JobUrl!",
                            },
                          ]}
                        >
                          <Input
                            onChange={(e) =>
                              handleInputChange("jobUrl", e.target.value)
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6} className="form-fields">
                        <Form.Item
                          label="Upwork Id"
                          name="upworkId"
                          initialValue={bidData.upworkId}
                          rules={[
                            {
                              required: true,
                              message: "Please input UpworkId!",
                            },
                          ]}
                        >
                          <Select
                            className="selected field"
                            placeholder="Select a Upwork Account"
                            filterOption={filterOption}
                            options={marketplaceOptions || []}
                            showSearch={true}
                            onChange={(value) =>
                              handleSelectChange("upworkId", value)
                            }
                            disabled
                          ></Select>
                        </Form.Item>
                      </Col>
                      <Col span={6} className="form-fields">
                        <Form.Item
                          className="input-selected-field"
                          label="Client Name"
                          name="clientName"
                          initialValue={bidData.clientName}
                          rules={[
                            {
                              required: nameRequired,
                              message: "Please input ClientName!",
                            },
                          ]}
                        >
                          <Input
                            onChange={(e) =>
                              handleInputChange("clientName", e.target.value)
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          className="input-selected-field"
                          label="Email"
                          name="email"
                          initialValue={bidData.email}
                          rules={[
                            {
                              required: false,
                              type: "email",
                              message: "Please input Email!",
                            },
                          ]}
                        >
                          <Input
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Row gutter={[30, 0]}>
                          <Col span={8}>
                            <Form.Item
                              label="Connects"
                              name="connects"
                              initialValue={bidData.connects}
                              rules={[
                                {
                                  required: true,
                                  // pattern: new RegExp("^\\+?[1-9][0-9]{0,99}$"),
                                  message: "Please input Connects!",
                                },
                              ]}
                            >
                              <Input
                                onChange={(e) =>
                                  handleInputChange("connects", e.target.value)
                                }
                                disabled
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8} className="form-fields">
                            <Form.Item
                              label="Contract Type"
                              name="contracType"
                              initialValue={getEnumNameFromValue(
                                parseInt(bidData.contracType),
                                ContractType
                              )}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input ContractType!",
                                },
                              ]}
                            >
                              <Select
                                className="selected field"
                                placeholder="Select a Contract Type"
                                onChange={(value) =>
                                  handleSelectChange("contracType", value)
                                }
                              >
                                {Object.values(ContractType).map(
                                  (item: any) => (
                                    <Select.Option
                                      key={item.value}
                                      value={item.value}
                                    >
                                      {item.name}
                                    </Select.Option>
                                  )
                                )}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              label="Country Name "
                              name="countryName"
                              initialValue={bidData.countryName}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input CountryName!",
                                },
                              ]}
                              isList
                            >
                              <Select
                                className="selected field"
                                placeholder="Select a Country"
                                onChange={(value) =>
                                  handleSelectChange("countryName", value)
                                }
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
                    <Row gutter={[30, 0]}>
                      <Col span={24}>
                        <Form.Item
                          label="Job Description"
                          name="jobdescription"
                          initialValue={bidData.jobdescription}
                          rules={[
                            {
                              required: true,
                              message: "Please input Jobdescription!",
                            },
                          ]}
                        >
                          <TextArea
                            rows={6}
                            onChange={(e) =>
                              handleInputChange(
                                "jobdescription",
                                e.target.value
                              )
                            }
                          />
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
                          className="input-selected-field"
                          label="Communication Mode"
                          name="communicationMode"
                          initialValue={bidData.communicationMode}
                          rules={[
                            {
                              required: false,
                              message: "Please input a Communication Mode!",
                            },
                          ]}
                        >
                          <Input
                            type="tel"
                            onChange={(e) =>
                              handleInputChange(
                                "communicationMode",
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          className="input-selected-field"
                          label="Mobile"
                          name="mobile"
                          initialValue={bidData.mobile}
                          rules={[
                            {
                              required: false,
                              pattern: new RegExp("^[0-9]{10}$"),
                              message: "Please input a 10-digit Mobile Number!",
                            },
                          ]}
                        >
                          <Input
                            type="tel"
                            onChange={(e) =>
                              handleInputChange("mobile", e.target.value)
                            }
                          />
                        </Form.Item>
                      </Col>

                      <Col span={7} className="form-fields">
                        <Form.Item
                          label="Department Name"
                          name="departmentId"
                          initialValue={bidData.departmentId}
                          rules={[
                            {
                              required: true,
                              message: "Please select a DepartmentName!",
                            },
                          ]}
                        >
                          <Select
                            className="selected field"
                            placeholder="Select a Department"
                            onChange={(value) =>
                              handleSelectChange("departmentId", value)
                            }
                          >
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
                    <Row gutter={[30, 0]}>
                      <Col span={12} className="form-fields">
                        <Form.Item
                          label="Account Types"
                          name="accountTypes"
                          initialValue={getEnumNameFromValue(
                            parseInt(bidData.accountTypes),
                            AccountTypes
                          )}
                          rules={[
                            {
                              required: true,
                              message: "Please input AccountTypes!",
                            },
                          ]}
                        >
                          <Select
                            className="selected field"
                            placeholder="Select an Account Type"
                          >
                            {Object.values(AccountTypes).map((item: any) => (
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
                      <Col span={12}>
                        <Form.Item
                          label="Status"
                          name="status"
                          initialValue={getEnumNameFromValue(
                            parseInt(bidData.status),
                            StatusEnum
                          )}
                          rules={[
                            { required: true, message: "Please input Status!" },
                          ]}
                        >
                          <Select
                            className="selected field"
                            placeholder="Select a Status"
                            onChange={(value) => {
                              if (value === StatusEnum.Hired.value) {
                                setShowHired(true);
                                handleSelectChange("status", value);
                                setNameRequired(true);
                              } else if (value === StatusEnum.Lead.value) {
                                handleSelectChange("status", value);
                                setNameRequired(true);
                              } else {
                                setShowHired(false);
                                handleSelectChange("status", value);
                              }
                            }}
                          >
                            {Object.values(StatusEnum).map((item: any) => (
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
                    </Row>
                  </Col>
                </Row>

                {showHired ? (
                  <>
                    <Divider />
                    <Row gutter={[30, 0]}>
                      <Col span={3} className="form-fields">
                        <Form.Item
                          label="Weekly Hours"
                          name="weeklyHours"
                          initialValue={bidData.weeklyHours}
                          rules={[
                            {
                              required: true,
                              message: "Please input WeeklyHours!",
                            },
                          ]}
                        >
                          <Input
                            onChange={(e) =>
                              handleInputChange("weeklyHours", e.target.value)
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item
                          label="Start Date"
                          name="startDate"
                          initialValue={
                            bidData.startDate
                              ? dayjs(bidData.startDate, "YYYY-MM-DD HH:mm:ss")
                              : dayjs(currDate, "YYYY-MM-DD HH:mm:ss")
                          }
                          onMetaChange={(e: any) => {
                            handleInputChange("startDate", e);
                          }}
                          rules={[
                            {
                              required: true,
                              message: "Please input StartDate!",
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
                          initialValue={getEnumNameFromValue(
                            parseInt(bidData.billingStatus),
                            ContractStatus
                          )}
                          rules={[
                            {
                              required: true,
                              message: "Please input ProjectStatus!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select a Project Status"
                            onChange={(value) =>
                              handleSelectChange("billingStatus", value)
                            }
                          >
                            {Object.values(ContractStatus).map((item: any) => (
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
                      <Col span={6}>
                        <Form.Item
                          label="Billing Type"
                          name="billingType"
                          initialValue={getEnumNameFromValue(
                            parseInt(bidData.billingType),
                            BillingTypes
                          )}
                          rules={[
                            {
                              required: true,
                              message: "Please select a BillingType!",
                            },
                          ]}
                        >
                          <Select
                            className="selected field"
                            placeholder="Select a BillingType"
                            onChange={(value) =>
                              handleSelectChange("billingType", value)
                            }
                          >
                            {Object.values(BillingTypes).map((item: any) => (
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
                      <Col span={6} className="form-fields">
                        <Form.Item
                          label="Project Url"
                          name="projectUrl"
                          initialValue={bidData.projectUrl}
                          rules={[
                            {
                              required: true,
                              message: "Please input Project Url!",
                            },
                          ]}
                        >
                          <Input
                            onChange={(e) =>
                              handleInputChange("projectUrl", e.target.value)
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                ) : null}
              </Col>
            </Row>
            <Row gutter={[30, 0]}>
              <Col span={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!formChanged}
                  >
                    Save
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
}
