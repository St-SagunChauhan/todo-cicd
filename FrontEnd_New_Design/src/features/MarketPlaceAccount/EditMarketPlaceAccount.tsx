import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import marketPlaceAccountService from "../../services/marketPlaceAccountRequest";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { marketPlaceAccountSelector } from "../../Selectors/marketPlaceAccountSelector";
import { MarketPlaceAccountEnum } from "../../Enums/MarketPlaceAccountEnum/MarketPlaceAccountEnum";
import { AccountTypes } from "../../Enums/LeadsConnect/BillingStatus";

type IProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  accountData: any | null;
  loading: (progress: number, value: boolean) => void;
};

type FieldType = {
  id: string;
  name: string;
  technology: string;
  jobSuccessrate: string;
  earning: string;
  remarks: string;
  isActive: true;
  marketPlaceAccountsStatus: number;
  accounts: number;
};

export default function EditMarketPlaceAccount({
  isOpen,
  handleCloseDialog,
  accountData,
  loading,
}: IProps): JSX.Element {
  const dispatch = useDispatch();
  const [selectedValues, setSelectedValues] = useState([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const marketPlaceAccount = useSelector(marketPlaceAccountSelector);
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({
    id: accountData.id,
    name: accountData.name,
    technology: accountData.technology,
    jobSuccessRate: accountData.jobSuccessRate,
    earning: accountData.earning,
    remarks: accountData.remarks,
    isActive: true,
    marketPlaceAccountsStatus: accountData.marketPlaceAccountsStatus,
    accounts: accountData.accounts,
  });

  const [formChanged, setFormChanged] = useState(false);

  const onValuesChange = () => {
    // Set formChanged to true when any field is changed
    setFormChanged(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    handleInputChange(field, value);
  };

  useEffect(() => {
    dispatch<any>(marketPlaceAccountService.fetchMarketPlaceAccountList());
  }, [dispatch]);

  const getEnumNameFromValue = (
    value: number,
    enumObject: Record<string, any>
  ) => {
    const match = Object.values(enumObject).find(
      (item) => item.value === value
    );
    return match ? match.name : undefined;
  };

  const [errorshow, seterrorshow] = useState({
    name: "",
    technology: "",
    jobSuccessRate: "",
    earning: "",
    remarks: "",
  });

  const validateForm = () => {
    const errors = {
      name: formData?.name === "" ? "Name is required" : "",
      technology: formData?.technology === "" ? "Technology is required" : "",
      jobSuccessRate:
        formData?.jobSuccessRate === "" ? "Job Success Rate is required" : "",
      earning: formData?.earning === "" ? "Earning is required" : "",
      remarks: formData?.remarks === "" ? "Remarks are required" : "",
    };
    seterrorshow(errors);

    // Check if any error exists
    return Object.values(errors).every((error) => error === "");
  };

  const onFinish = async (values: any) => {
    if (!validateForm() || !formChanged) {
      return;
    }

    loading(100, false);

    const response = await marketPlaceAccountService.updateMarketPlaceAccount(
      formData
    );

    if (response.status === 200) {
      message.success("Upwork Id Updated Successfully");
    } else {
      message.error(response.message);
    }
    setIsOpenEditModal(false);
    handleCloseDialog();
    dispatch<any>(marketPlaceAccountService.fetchMarketPlaceAccountList());
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
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: "600px", width: "100%", padding: "20px 10px" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
          onValuesChange={(_, values) => onValuesChange()}
        >
          <Col style={{ textAlign: "left" }}>
            <Form.Item
              label="Upwork Id"
              name="name"
              initialValue={accountData.name}
              help={errorshow.name}
              validateStatus={errorshow.name ? "error" : ""}
            >
              <Input
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Technology"
              name="technology"
              initialValue={accountData.technology}
              help={errorshow.technology}
              validateStatus={errorshow.technology ? "error" : ""}
            >
              <Input
                onChange={(e) =>
                  handleInputChange("technology", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item
              label="status"
              name="marketPlaceAccountsStatus"
              initialValue={getEnumNameFromValue(
                parseInt(accountData.marketPlaceAccountsStatus),
                MarketPlaceAccountEnum // Use the correct enum here
              )}
            >
              <Select
                placeholder="Select a status"
                onChange={(value) =>
                  handleSelectChange("marketPlaceAccountsStatus", value)
                }
              >
                {Object.values(MarketPlaceAccountEnum).map((item: any) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Account Types"
              name="accounts"
              initialValue={getEnumNameFromValue(
                parseInt(accountData.accounts),
                AccountTypes // Use the correct enum here
              )}
            >
              <Select
                placeholder="Select an Account Type"
                onChange={(value) => handleSelectChange("accounts", value)}
              >
                {Object.values(AccountTypes).map((item: any) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Job Success Rate"
              name="jobSuccessRate"
              initialValue={accountData.jobSuccessRate}
              help={errorshow.jobSuccessRate}
              validateStatus={errorshow.jobSuccessRate ? "error" : ""}
            >
              <Input
                onChange={(e) =>
                  handleInputChange("jobSuccessRate", e.target.value)
                }
              />
            </Form.Item>
            <Form.Item
              label="Earning"
              name="earning"
              initialValue={accountData.earning}
              help={errorshow.earning}
              validateStatus={errorshow.earning ? "error" : ""}
            >
              <Input
                onChange={(e) => handleInputChange("earning", e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Remarks"
              name="remarks"
              initialValue={accountData.remarks}
              help={errorshow.remarks}
              validateStatus={errorshow.remarks ? "error" : ""}
            >
              <Input
                onChange={(e) => handleInputChange("remarks", e.target.value)}
              />
            </Form.Item>
            <Form.Item className="submit-btn-wrap" wrapperCol={{ span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 10 }}
                disabled={!formChanged}
              >
                Submit
              </Button>

              <Button
                icon={<CloseOutlined />}
                onClick={handleCloseDialog}
                danger
              >
                Close
              </Button>
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
}
