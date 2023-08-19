"use client";
import React, { useCallback, useState } from "react";
import { convertToPars, convertToString, createDefaultValue } from "../utils/utils";
import SimpleBar from "simplebar-react";
import { toast } from "react-hot-toast";

type AnyObject = {
  [key: string]: any;
};

type OperatorType = "+" | "-" | "*" | "**" | "/" | "==" | "===";
type DataType = { body: AnyObject; header: AnyObject; operator: OperatorType };
type ValueType = { body: AnyObject; header: AnyObject };

const operator: OperatorType[] = ["==", "===", "+", "-", "*", "**", "/"];

const labelColorOptions = {
  true: "bg-green-200 text-green-700",
  false: "bg-red-200 text-red-700",
  string: "bg-purple-200 text-purple-700",
  number: "bg-amber-200 text-amber-700",
};

const calculation = (first: any, second: any, operator: OperatorType): React.JSX.Element => {
  let result;
  if (operator === "+") result = first + second;
  else if (operator === "-") result = first - second;
  else if (operator === "/") result = first / second;
  else if (operator === "*") result = first * second;
  else if (operator === "**") result = first ** second;
  else if (operator === "==") result = first == second;
  else if (operator === "===") result = first === second;
  return showResult(result);
};

const showResult = (result: string | boolean | number) => {
  let data = { value: "", className: "" };
  if (result === true) data = { value: "true", className: labelColorOptions.true };
  else if (result === false) data = { value: "false", className: labelColorOptions.false };
  else if (typeof result === "string") data = { value: result === "" ? `""` : result, className: labelColorOptions.string };
  else if (typeof result === "number") data = { value: `${result}`, className: labelColorOptions.number };
  return <span className={data.className}>{data.value}</span>;
};

const Page = () => {
  const [table, setTable] = useState(createDefaultValue(20));
  const [input, setInput] = useState<{ search: string; operator: OperatorType }>({ search: "20", operator: "==" });

  const [data, setData] = useState<DataType>({
    body: table.object.body.pars,
    header: table.object.header.pars,
    operator: "==",
  });

  const [value, setValue] = useState<ValueType>({
    header: table.object.header.stringify,
    body: table.object.body.stringify,
  });

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const { name, value } = e.target;
    if (name.includes("header")) setValue((prev) => ({ ...prev, header: { ...prev.header, [name]: value } }));
    else setValue((prev) => ({ ...prev, body: { ...prev.body, [name]: value } }));
  }, []);

  const onClick = useCallback(() => {
    let body: AnyObject = {};
    let header: AnyObject = {};
    let bodyValue: AnyObject = {};
    let headerValue: AnyObject = {};

    for (let key in value.body) {
      const parsValue = convertToPars(value.body[key]);
      body = { ...body, [key]: parsValue };
      bodyValue = { ...bodyValue, [key]: convertToString(parsValue) };
    }

    for (let key in value.header) {
      const parsValue = convertToPars(value.header[key]);
      header = { ...header, [key]: parsValue };
      headerValue = { ...headerValue, [key]: convertToString(parsValue) };
    }
    setTable(createDefaultValue(input.search));
    setValue({ body: bodyValue, header: headerValue });
    setData({ operator: input.operator, body, header });

    toast.success("Success 🎉");
  }, [input, value]);

  return (
    <SimpleBar autoHide={false} className="max-h-screen w-full">
      <section className="p-4 max-w-[1500px] mx-auto">
        <h1 className="centering text-center text-2xl sm:text-3xl md:text-4xl mb-4 text-white font-bold">
          JavaScript Coercion Rules
        </h1>

        <ul className="text-white font-medium mb-4">
          <li className="flex-start-center gap-2">
            <span className="text-lg sm:text-2xl">Guide :</span>
            <ul className="flex-start-center gap-2 flex-1 [&>*]:rounded-md [&>*]:py-0.5 [&>*]:px-1 [&>*]:sm:px-3">
              <li className={labelColorOptions.false}>false</li>
              <li className={labelColorOptions.true}>true</li>
              <li className={labelColorOptions.string}>string</li>
              <li className={labelColorOptions.number}>number</li>
            </ul>
          </li>
          <li className="sm:text-lg">1) You can change the value of each row and column</li>
          <li className="sm:text-lg">2) You can change the Operator</li>
          <li className="sm:text-lg">3) You can change the row count</li>
          <div className="h-[1.5px] w-full bg-white mt-4"></div>
        </ul>

        <div className="flex-between-center gap-4 md:gap-6 mx-auto mb-8">
          <div className="flex-end-center gap-2">
            <p className="whitespace-nowrap text-white font-medium">Row Count : </p>
            <input
              className="w-full max-w-[80px] h-8 rounded-md text-center shadow-md"
              value={input.search}
              onChange={(e) => setInput((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <button className="h-8 w-[90px] bg-white rounded-md shadow-md font-medium" onClick={onClick}>
            Submit
          </button>
        </div>

        <div className="centering">
          <SimpleBar autoHide={false} className="max-h-[80svh] w-full">
            <table className="mx-auto">
              <thead>
                <tr>
                  <th>
                    <select
                      onChange={(e) => setInput((prev) => ({ ...prev, operator: e.target.value as OperatorType }))}
                      value={input.operator}
                    >
                      {operator.map((item) => {
                        return (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </th>
                  {table.array.header.map((item, index) => {
                    return (
                      <th key={`1-${index}-${data}`}>
                        <input value={value.header[item]} name={item} onChange={onChange} />
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {table.array.body.map((bodyItem, index) => {
                  return (
                    <tr key={`2-${index}-${data}`}>
                      <th>
                        <input value={value.body[bodyItem]} name={bodyItem} onChange={onChange} />
                      </th>
                      {table.array.header.map((headerItem, titleIndex) => {
                        return (
                          <td key={`3-${headerItem}-${titleIndex}-${data}`}>
                            {calculation(data.body[bodyItem], data.header[headerItem], data.operator)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </SimpleBar>
        </div>
      </section>
    </SimpleBar>
  );
};

export default Page;
