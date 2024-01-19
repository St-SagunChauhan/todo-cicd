import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Form,
  Input,
  Select,
  Row,
  DatePicker,
  message,
  TimePicker,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { projectSelector } from "../../Selectors/projectSelector";
import TextArea from "antd/es/input/TextArea";
import eodReportService from "../../services/eodReportRequest";
import { FormInstance } from "antd/lib/form";
import dayjs from "dayjs";
import projectService from "../../services/projectRequest";
import { eodReportSelector } from "../../Selectors/eodReportSelector";

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

export default function EditEODReport({
  isOpen,
  handleCloseDialog,
  eodData,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const projectData = useSelector(projectSelector);
  const [formChanged, setFormChanged] = useState(false);

  const formRef = useRef<FormInstance>(null);

  const [formData, setFormData] = useState({
    employeeId: eodData.employeeId,
    eodDate: eodData.eodDate,
    eodReportId: eodData.eodReportId,
    projectHours: [] as any,
    remarks: eodData.remarks,
    isActive: true,
  });

  const [formattedBillingHours, setFormattedBillingHours] = useState<number>(0);
  const [formattedDelightHours, setFormattedDelightHours] = useState<number>(0);
  const [selectedProj, setSelectedProj] = useState<any>([]);

  const [showDelightHr, setShowDelightHr] = useState({
    show: false,
    key: 0,
    remainingHR: 0,
    textError: false,
  });

  const eodReports = useSelector(eodReportSelector);

  const onValuesChange = () => {
    // Set formChanged to true when any field is changed
    setFormChanged(true);
  };

  const [form] = Form.useForm();
  const selProjectId = Form.useWatch("projectHours", form);

  useEffect(() => {
    dispatch<any>(projectService.fetchProjectList());
  }, [dispatch]);

  useEffect(() => {
    if (!eodData.projectHours) return;
    let refinedArray = Object.entries(eodData.projectHours).map((item: any) => {
      return {
        projectId: item[0],
        ...item[1],
      };
    });

    refinedArray = refinedArray.map((item: any, index: number) => {
      if (item.EmployeeDelightHours > 0.0) {
        setShowDelightHr({
          show: true,
          key: index,
          remainingHR: 0,
          textError: false,
        });
      }
      return {
        ...item,
        BillingHours: dayjs()
          .set("hours", convertInTime(item.BillingHours).hours)
          .set("minutes", convertInTime(item.BillingHours).minutes),
        EmployeeDelightHours: dayjs()
          .set("hours", convertInTime(item.EmployeeDelightHours).hours)
          .set("minutes", convertInTime(item.EmployeeDelightHours).minutes),
      };
    });

    setFormData((prevState) => ({ ...prevState, projectHours: refinedArray }));
    form.setFieldValue("projectHours", refinedArray);
  }, [eodData.projectHours, form]);

  const convertInTime = (hrs: number) => {
    const fullTime = hrs.toLocaleString().split(".");
    const [hour, min] = fullTime;

    let hours = hour == undefined ? 0 : Math.floor(parseFloat(hour));
    let minutes = min == undefined ? 0 : Math.round(parseFloat(min));

    return { hours, minutes };
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const onFinish = async (value: FieldType) => {
    const updatedProjectHours = value.projectHours.map((projectHour: any) => {
      return {
        ...projectHour,
        BillingHours: formattedBillingHours,
        EmployeeDelightHours: formattedDelightHours,
      };
    });
    const payload = {
      ...formData,
      projectHours: updatedProjectHours,
    };

    if (form.isFieldsTouched()) {
      const response = await eodReportService.updateEodReport(payload);
      if (response.status === 200) {
        message.success(response.data.message);
        setLoading(false);
      } else {
        message.error(response.data.message);
      }
    }

    setIsOpenEditModal(false);
    handleCloseDialog();
    dispatch<any>(eodReportService.fetchEodReportList());
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo);
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

    // pastBillingHr = pastBillingHr + dateString;

    if (pastBillingHr + dateString > parseFloat(filProject.hoursPerWeek)) {
      setShowDelightHr({
        show: true,
        key: key,
        remainingHR: parseFloat(filProject.hoursPerWeek) - pastBillingHr,
        textError: true,
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

  const handleProjectSelect = (projectId: any, index: any) => {
    // Assuming you have a function to update the selected project IDs
    setSelectedProj([...selectedProj, projectId]);
    // Other logic, if needed
  };

  const removeSelectedItem = (index: any) => {
    console.log({ index });

    const tempArr = selectedProj;
    tempArr.pop(index);
    setSelectedProj(tempArr);
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
        onValuesChange={() => {
          form.validateFields();
          onValuesChange();
        }}
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
                    name={[name, "BillingHours"]}
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
                            "EmployeeDelightHours",
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
                          "BillingHours",
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
                    name={[name, "EmployeeDelightHours"]}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const billingHours = getFieldValue([
                            "projectHours",
                            name,
                            "BillingHours",
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
                          "EmployeeDelightHours",
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
          initialValue={dayjs(eodData.eodDate)}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Remarks"
          name="remarks"
          initialValue={eodData.remarks}
        >
          <TextArea rows={6} />
          {/* <TextArea rows={4} placeholder="maxLength is 6" maxLength={6} /> */}

          {/* <Input /> */}
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginRight: 10 }}
            disabled={!formChanged}
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
