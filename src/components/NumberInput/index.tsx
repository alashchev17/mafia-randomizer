import { ChangeEvent, FC, useState } from "react";

import "./index.scss";

interface NumberInputProps {
  label: string;
  currentValue: number;
  name: string;
  setButtonValid: (state: boolean) => void;
}

const NumberInput: FC<NumberInputProps> = ({ label, currentValue, name, setButtonValid }) => {
  const [value, setValue] = useState(currentValue.toString());

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length !== 0) {
      if (Number(event.target.value)) {
        setValue(event.target.value);
        Number(event.target.value) >= 5 && Number(event.target.value) <= 12
          ? setButtonValid(true)
          : setButtonValid(false);
      } else {
        setValue("");
      }
    } else {
      setValue("");
      setButtonValid(false);
    }
    return false;
  };

  return (
    <label className="label">
      {label}
      <input
        className="input"
        type="text"
        autoComplete="off"
        inputMode="numeric"
        value={value}
        name={name}
        onChange={handleChange}
      />
    </label>
  );
};

export default NumberInput;
