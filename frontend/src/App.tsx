import { ChangeEvent, useState } from "react";
import "./app.css";
import { Field, FieldOption, FieldType, Honor, OnboardingData } from "./type";

function App() {
  const [data, setData] = useState<OnboardingData>({
    lineUserId: "",
    studentId: "",
    firstName: "",
    lastName: "",
    nickName: "",
    mobileNo: "",
    honor: null,
    currentJob: null,
    currentCompany: null,
    fallbackMessage: "",
    channelAccessToken: "",
  });
  const [isFormValidated, setIsFormValidated] = useState<boolean>(false);
  const graduateFields: Array<Field> = [
    {
      name: "studentId",
      type: FieldType.Text,
      required: true,
      validation: (value: string) => {
        return /^621305002[0-9]{2}$/.test(value);
      },
      errorMessage: "Student Id must be in format of 621305002XX",
    },
    {
      name: "firstName",
      type: FieldType.Text,
      required: true,
    },
    {
      name: "lastName",
      type: FieldType.Text,
      required: true,
    },
    {
      name: "nickName",
      type: FieldType.Text,
    },
    {
      name: "mobileNo",
      type: FieldType.Text,
      required: true,
      validation: (value: string) => {
        return /^0[0-9]{9}$/.test(value);
      },
      errorMessage: "Mobile No must be in format of 0XXXXXXXXX",
    },
    {
      name: "honor",
      type: FieldType.Select,
      options: [
        {
          label: "None",
          value: "",
        },
        {
          label: Honor.First,
          value: Honor.First,
        },
        {
          label: Honor.Second,
          value: Honor.Second,
        },
      ],
    },
    {
      name: "currentJob",
      type: FieldType.Text,
    },
    {
      name: "currentCompany",
      type: FieldType.Text,
    },
  ];

  const lineFields: Array<Field> = [
    {
      name: "lineUserId",
      type: FieldType.Text,
      required: true,
      validation: (value: string) => {
        return /^U[0-9a-f]{32}$/.test(value);
      },
      errorMessage: "Line User Id is invalid",
    },
    {
      name: "channelAccessToken",
      type: FieldType.Text,
      required: true,
    },
    {
      name: "fallbackMessage",
      type: FieldType.Text,
    },
  ];
  const getLabel = (field: Field) => {
    return field.name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };
  const renderLabel = (field: Field) => {
    return (
      <label htmlFor={field.name}>
        {getLabel(field)} {field.required && renderRequire()}
      </label>
    );
  };
  const renderField = (field: Field) => {
    switch (field.type) {
      case FieldType.Select:
        return (
          <div key={field.name}>
            {renderLabel(field)}
            <select
              name={field.name}
              value={data[field.name] ?? ""}
              onChange={handleChange}
            >
              {field.options &&
                field.options.map((option: FieldOption, index: number) => (
                  <option value={option.value} key={index}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>
        );
      case FieldType.Text:
      default:
        return (
          <div key={field.name}>
            {renderLabel(field)}
            <input
              name={field.name}
              value={data[field.name] ?? ""}
              onChange={handleChange}
            />
            {renderErrorMessage(field)}
          </div>
        );
    }
  };
  const renderErrorMessage = (field: Field) => {
    const className = [
      "errorMessage",
      isFormValidated ? "active" : "hidden",
    ].join(" ");
    const fieldValue = data[field.name] ?? "";
    const isEmptyValue = fieldValue === "";
    if (isEmptyValue && field.required) {
      return <div className={className}>{getLabel(field)} is required</div>;
    }
    if (
      field.validation !== undefined &&
      field.validation(fieldValue) === false
    ) {
      return <div className={className}>{field.errorMessage}</div>;
    }

    return <></>;
  };
  const renderRequire = () => {
    return <span className="required">*</span>;
  };
  const handleChange = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    setData({
      ...data,
      [target.name]: target.value,
    });
  };
  const handleSubmit = () => {
    setIsFormValidated(true);
    const isFormValid =
      document.getElementsByClassName("errorMessage").length === 0;
    if (isFormValid) {
      alert("submitting form");
    }
    console.log(data);
  };
  return (
    <>
      <h1>Graduation Bot Onboarding</h1>
      <h2>Graduate's information</h2>
      <div className="form">{graduateFields.map(renderField)}</div>
      <h2>Line Information</h2>
      <div className="form">{lineFields.map(renderField)}</div>
      <div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
}

export default App;
