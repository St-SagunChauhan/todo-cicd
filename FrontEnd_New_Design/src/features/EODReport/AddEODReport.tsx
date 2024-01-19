import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  DatePicker,
  TimePicker,
  message,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { projectSelector } from "../../Selectors/projectSelector";
import { eodReportSelector } from "../../Selectors/eodReportSelector";
import TextArea from "antd/es/input/TextArea";
import eodReportService from "../../services/eodReportRequest";
import { FormInstance } from "antd/lib/form";
import projectService from "../../services/projectRequest";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  eodData: any;
};

type FieldType = {
  employeeId: string;
  isActive: true;
  projectHours: {
    projectId: string;
    billingHours: number;
    employeeDelightHours: number;
  }[];
  // delightHours: { projectId: string; employeeDelightHours: number }[];
  eodDate: string;
  remarks: string;
};

export default function AddEODREport({
  isOpen,
  handleCloseDialog,
  eodData,
}: IProps): JSX.Element {
  const [form] = Form.useForm();
  const selProjectId = Form.useWatch("projectHours", form);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formattedBillingHours, setFormattedBillingHours] = useState<number>(0);
  const [formattedDelightHours, setFormattedDelightHours] = useState<number>(0);
  const [selectedProj, setSelectedProj] = useState<any>([]);

  const [showDelightHr, setShowDelightHr] = useState({
    show: false,
    key: 0,
    remainingHR: 0,
    textError: false,
  });

  const projectData = useSelector(projectSelector);
  const eodReports = useSelector(eodReportSelector);

  const formRef = useRef<FormInstance>(null);

  useEffect(() => {
    dispatch<any>(projectService.fetchProjectList());
  }, [dispatch]);

  const onFinish = async (value: FieldType) => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
      setLoading(true);

      // Inside the component where you update project hours
      const updatedProjectHours = value.projectHours.map((projectHour) => {
        return {
          ...projectHour,
          billingHours: formattedBillingHours,
          employeeDelightHours: formattedDelightHours,
        };
      });

      const updatedValue: FieldType = {
        ...value,
        employeeId: String(loggedInUser.employeeId),
        eodDate: new Date().toISOString(),
        projectHours: updatedProjectHours, // Include the updated projectHours
      };

      eodReportService
        .addEodReport(updatedValue)
        .then((response) => {
          if (response.status === 200) {
            // Handle success
            message.success("EOD Created Successfully");
            handleCloseDialog();
            dispatch<any>(eodReportService.fetchEodReportList());
          } else {
            throw new Error(`Failed to create EOD. Status: ${response}`);
          }
        })
        .catch((error) => {
          message.error("Failed to create eod");
          setLoading(false);
        });
      handleCloseDialog();
      formRef.current?.resetFields();
      dispatch<any>(eodReportService.fetchEodReportList());
    } catch (error) {
      // Validation failed, do not proceed with the submission
      console.error("Validation error:", error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const showDelightField = async (
    dateString: any,
    projectId: any,
    key: number
  ) => {
    const filterPro = projectData.filter((item: any) => {
      return item.id === projectId[key].projectId;
    });
    const [filProject] = filterPro;

    const eods: any = [];
    let pastBillingHr = 0;

    await eodReports.map((item: any) => {
      item.projectHours.map((it: any) => {
        eods.push(it);
      });
    });

    const filterEodReports = eods.filter((item: any) => {
      return item.projectId === projectId[key].projectId;
    });

    await filterEodReports.map((item: any) => {
      pastBillingHr = pastBillingHr + parseFloat(item.billingHours);
    });

    if (pastBillingHr + dateString > parseFloat(filProject.hoursPerWeek)) {
      setShowDelightHr({
        show: true,
        key: key,
        remainingHR: parseFloat(filProject.hoursPerWeek) - pastBillingHr,
        textError: true,
      });
    } else if (
      pastBillingHr + dateString ===
      parseFloat(filProject.hoursPerWeek)
    ) {
      setShowDelightHr({
        show: true,
        key: key,
        remainingHR: 0,
        textError: false,
      });
    } else {
      setShowDelightHr({
        show: false,
        key: key,
        remainingHR: 0,
        textError: false,
      });
    }
  };

  // const isSubmitButtonDisabled = () => {
  //   const fieldsValue = form.getFieldsValue();

  //   // Check if any field is touched with validation errors
  //   const hasTouchedFieldWithError = Object.keys(fieldsValue).some(
  //     (fieldName) =>
  //       (form.isFieldTouched(fieldName) &&
  //         form.getFieldError(fieldName).length > 0) ||
  //       showDelightHr.show
  //   );

  //   // Disable the button only if there are touched fields with errors
  //   return hasTouchedFieldWithError;
  // };

  const removeSelectedItem = (index: any) => {
    console.log({ index });

    const tempArr = selectedProj;
    tempArr.pop(index);
    setSelectedProj(tempArr);
  };

  const disabledDate = (current: any) => {
    // Disable dates for last week and upcoming week
    const today = moment();
    const lastWeekStartDate = today
      .clone()
      .subtract(1, "weeks")
      .startOf("week");
    const lastWeekEndDate = today.clone().subtract(1, "weeks").endOf("week");
    const nextWeekStartDate = today.clone().add(1, "weeks").startOf("week");
    const nextWeekEndDate = today.clone().add(1, "weeks").endOf("week");

    return current < lastWeekEndDate || current > nextWeekStartDate;
  };

  return (
    <Row gutter={[16, 16]}>
      <Form
        form={form}
        ref={formRef}
        name="basic"
        style={{ width: "100%" }}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 14 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        onValuesChange={() => form.validateFields()}
      >
        <Form.List
          name="projectHours"
          initialValue={[{ projectId: "", billingHours: null }]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <div
                  key={key}
                  style={{
                    borderBottom: "1px solid #e3e3e3",
                    paddingBottom: 5,
                    marginBottom: 20,
                  }}
                >
                  <Form.Item
                    label="Project Name"
                    {...restField}
                    name={[name, "projectId"]}
                    rules={[
                      {
                        required: true,
                        message: "Please input Project Name!",
                      },
                    ]}
                  >
                    <Select placeholder="Select Project Name">
                      {projectData &&
                        projectData.length &&
                        projectData.map((project: any, key: number) => {
                          const projectArray =
                            form.getFieldValue("projectHours");
                          return (
                            <Select.Option
                              disabled={projectArray.some(
                                (proj: any) => proj?.projectId === project?.id
                              )}
                              value={project.id}
                              key={key}
                            >
                              {project.contractName}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={`Billing Hours`}
                    {...restField}
                    name={[name, "billingHours"]}
                    validateStatus={
                      showDelightHr.textError && showDelightHr.key === index
                        ? "error"
                        : ""
                    }
                    help={
                      showDelightHr.textError && showDelightHr.key === index
                        ? `Remaining Billing Hours: ${showDelightHr.remainingHR}`
                        : ""
                    }
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const employeeDelightHours = getFieldValue([
                            "projectHours",
                            name,
                            "employeeDelightHours",
                          ]);

                          if (!value && !employeeDelightHours) {
                            return Promise.reject(
                              "Please input Billing Hours or Delight Hours!"
                            );
                          }

                          return Promise.resolve();
                        },
                      }),
                      () => ({
                        validator(_) {
                          if (
                            showDelightHr.textError &&
                            showDelightHr.key === index
                          ) {
                            return Promise.reject(
                              `Remaining Billing Hours: ${showDelightHr.remainingHR}`
                            );
                          } else {
                            return Promise.resolve();
                          }
                        },
                      }),
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      onChange={(_, dateString) => {
                        const formattedValue = dateString;
                        setFormattedBillingHours(
                          parseFloat(formattedValue.replace(":", "."))
                        );
                        form.setFieldValue(
                          "billingHours",
                          parseFloat(formattedValue.replace(":", "."))
                        );
                        showDelightField(
                          parseFloat(formattedValue.replace(":", ".")),
                          selProjectId,
                          index
                        );
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={`Delight Hours`}
                    {...restField}
                    name={[name, "employeeDelightHours"]}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const billingHours = getFieldValue([
                            "projectHours",
                            name,
                            "billingHours",
                          ]);
                          if (!value && !billingHours) {
                            return Promise.reject(
                              "Please input Billing Hours or Delight Hours!"
                            );
                          }

                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <TimePicker
                      format="HH:mm" // Specify the format as hours and minutes for display
                      onChange={(value, dateString) => {
                        const formattedValue = dateString;
                        setFormattedDelightHours(
                          parseFloat(formattedValue.replace(":", "."))
                        );
                        form.setFieldValue(
                          "employeeDelightHours",
                          parseFloat(formattedValue.replace(":", "."))
                        );
                      }}
                    />
                  </Form.Item>
                  {index !== 0 && (
                    <Button
                      onClick={() => {
                        removeSelectedItem(name);
                        remove(name);
                      }}
                      style={{ marginBottom: 10, width: "50%" }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                style={{ marginBottom: 10, width: "50%" }}
                onClick={() => add()}
              >
                Add Project
              </Button>
            </>
          )}
        </Form.List>

        <Form.Item
          label="Eod Date"
          name="eodDate"
          rules={[
            {
              required: false,
              message: "Please input Eod Date!",
            },
          ]}
        >
          <DatePicker disabledDate={disabledDate} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Remarks" name="remarks">
          <TextArea rows={6} />
          {/* <TextArea rows={4} placeholder="maxLength is 6" maxLength={6} /> */}

          {/* <Input /> */}
        </Form.Item>
        <Form.Item className="submit-btn-wrap" wrapperCol={{ span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginRight: 10 }}
            //disabled={isSubmitButtonDisabled()}
          >
            Submit
          </Button>

          <Button icon={<CloseOutlined />} onClick={handleCloseDialog} danger>
            Close
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
}
