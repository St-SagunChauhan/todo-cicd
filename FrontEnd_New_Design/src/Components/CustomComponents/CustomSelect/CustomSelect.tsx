import React, { useState } from "react";
import { Select } from "antd";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

interface CustomSelectProps {
  allowClear: boolean;
  placeholder: string;
  onChange?: (value: string | null) => void;
  value: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  allowClear,
  placeholder,
  onChange,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleOptionSelect = (value: string) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleClear = () => {
    setSelectedValue(null);
    setSearchValue("");
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <Select
      size="large"
      value={selectedValue}
      placeholder={placeholder}
      allowClear={allowClear}
      onClear={handleClear}
      onChange={handleOptionSelect}
      onSearch={(value) => setSearchValue(value)}
    ></Select>
  );
};

export default CustomSelect;
