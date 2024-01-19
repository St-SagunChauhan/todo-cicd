import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import clientService from "../../services/clientRequest";
import { marketPlaceAccountSelector } from "../../Selectors/marketPlaceAccountSelector";
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
import marketPlaceAccountService from "../../services/marketPlaceAccountRequest";

import { AccountTypes } from "../../Enums/LeadsConnect/BillingStatus";
import dayjs from "dayjs";

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  clientData: any;
};

export default function EditClient({
  isOpen,
  handleCloseDialog,
  clientData,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const accountData = useSelector(marketPlaceAccountSelector);
  const defaultaccoutType = Object.values(AccountTypes)[0]; // Set default dynamically
  const [formData, setFormData] = useState({
    clientId: clientData.clientId,
    clientName: clientData.clientName,
    contactNo: clientData.contactNo,
    country: clientData.country,
    clientEmail: clientData.clientEmail,
    isActive: true,
    accounts: defaultaccoutType.value.toString(),
    marketPlaceAccountId: clientData.marketPlaceAccounts?.id,
    lastFollowUpRemark: clientData.lastFollowUpRemark,
    lastFollowUpDate: clientData.lastFollowUpDate,
  });
  const [form] = Form.useForm();

  // Function to update the state when the input values change
  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const [formChanged, setFormChanged] = useState(false);

  const onValuesChange = () => {
    // Set formChanged to true when any field is changed
    setFormChanged(true);
  };

  // Function to handle changes in select fields
  const handleSelectChange = (field: string, value: string) => {
    handleInputChange(field, value);
  };

  useEffect(() => {
    dispatch<any>(marketPlaceAccountService.fetchMarketPlaceAccountList());
  }, [dispatch]);

  const [errorshow, seterrorshow] = useState({
    clientName: "",
  });

  const validateForm = () => {
    const errors = {
      clientName: formData?.clientName?.trim() ? "" : "Client Name is required",
    };
    seterrorshow(errors);
    return Object.values(errors).every((error) => !error);
  };

  const onFinish = async () => {
    if (!validateForm() || !formChanged) {
      return;
    }
    setLoading(true);

    // Use formData to get the updated values
    formData.accounts = formData.accounts.toString();
    const response = await clientService.updateClient(formData);
    setLoading(false);
    if (response.status === 200) {
      message.success("Client Updated Successfully");
    } else {
      message.error(response.message);
    }

    setIsOpenEditModal(false);
    handleCloseDialog();
    dispatch<any>(clientService.fetchClientList());
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo);
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Form
          className="label-text"
          name="basic"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: "600px", width: "100%", padding: "20px 10px" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
          onValuesChange={(_, values) => onValuesChange()}
        >
          <Col>
            <Form.Item
              label="Client Name"
              name="clientName"
              initialValue={clientData.clientName}
              help={errorshow.clientName}
              validateStatus={errorshow.clientName ? "error" : ""}
            >
              <Input
                onChange={(e) =>
                  handleInputChange("clientName", e.target.value)
                }
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label="Client Email"
              name="clientEmail"
              initialValue={clientData.clientEmail}
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
                  handleInputChange("clientEmail", e.target.value)
                }
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label="Mobile Number"
              name="contactNo"
              initialValue={clientData.contactNo}
              rules={[
                {
                  required: false,
                  pattern: new RegExp("^[0-9]{10}$"),
                  message: "Please input a 10-digit Mobile Number!",
                },
              ]}
            >
              <Input
                onChange={(e) => handleInputChange("contactNo", e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label="Upwork Hired Profile"
              name="marketplaceName"
              initialValue={clientData.marketPlaceAccounts?.name}
            >
              <Select
                placeholder="Select Profile"
                value={formData.marketPlaceAccountId}
                onChange={(e) => handleSelectChange("marketPlaceAccountId", e)}
              >
                {accountData &&
                  accountData.length > 0 &&
                  accountData.map((acc: any, key: number) => {
                    return (
                      <Select.Option value={acc.id || undefined} key={key}>
                        {acc.name}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label="Remarks"
              name="lastFollowUpRemark"
              initialValue={clientData.lastFollowUpRemark}
            >
              <Input
                onChange={(e) =>
                  handleInputChange("lastFollowUpRemark", e.target.value)
                }
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label="Last Follow Up Date"
              name="lastFollowUpDate"
              initialValue={dayjs(clientData.lastFollowUpDate)}
            >
              <DatePicker
                className="custom-select"
                style={{ width: "100%" }}
                onChange={(e: any) => {
                  handleInputChange("lastFollowUpDate", e);
                }}
              />
            </Form.Item>
          </Col>
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
    </>
  );
}
