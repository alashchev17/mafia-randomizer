import { FC, useEffect, useId, useState } from "react";

import "./index.scss";

interface NumberInputProps {
  label: string;
  sublabel?: string;
  entityTitle: string;
  currentValue: number;
  minValue: number;
  maxValue: number;
  name?: string;
  onChange?: (value: number) => void;
}

const clampValue = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const NumberInput: FC<NumberInputProps> = ({
  label,
  sublabel,
  entityTitle,
  currentValue,
  minValue,
  maxValue,
  name,
  onChange,
}) => {
  const labelId = useId();
  const sublabelId = useId();
  const [value, setValue] = useState(clampValue(currentValue, minValue, maxValue));

  useEffect(() => {
    setValue(clampValue(currentValue, minValue, maxValue));
  }, [currentValue, minValue, maxValue]);

  const updateValue = (nextValue: number) => {
    const clampedValue = clampValue(nextValue, minValue, maxValue);

    setValue(clampedValue);
    onChange?.(clampedValue);
  };

  return (
    <div
      className="number-input"
      role="group"
      aria-labelledby={labelId}
      aria-describedby={sublabel ? sublabelId : undefined}
    >
      <div className="number-input__header">
        <span className="number-input__label" id={labelId}>
          {label}
        </span>
        {sublabel && (
          <span className="number-input__sublabel" id={sublabelId}>
            {sublabel}
          </span>
        )}
      </div>
      <div className="number-input__controls">
        <button
          className="number-input__button"
          type="button"
          disabled={value <= minValue}
          aria-label={`${label}: decrease`}
          onClick={() => updateValue(value - 1)}
        >
          -
        </button>
        <output className="number-input__value" aria-live="polite">
          {value} {entityTitle}
        </output>
        <button
          className="number-input__button"
          type="button"
          disabled={value >= maxValue}
          aria-label={`${label}: increase`}
          onClick={() => updateValue(value + 1)}
        >
          +
        </button>
      </div>
      {name && <input type="hidden" value={value} name={name} readOnly />}
    </div>
  );
};

export default NumberInput;
