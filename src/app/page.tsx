"use client";
import React, { useCallback, useEffect, useState } from "react";
import { convertToPars, convertToString, createDefaultValue } from "../utils/utils";

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
  }, [input, value]);

  return (
    <section className="px-4 py-6">
      <h1 className="centering text-center text-3xl md:text-4xl mb-6">JavaScript Coercion Rules</h1>

      <div className="flex-start-center flex-col md:flex-row gap-6 max-w-screen-xl mx-auto">
        <div className="centering gap-4">
          <button className="h-10 px-8 bg-white rounded-md shadow-md" onClick={onClick}>
            Submit
          </button>
          <input
            className="md:hidden h-10 px-4 bg-white rounded-md w-20 text-center shadow-md"
            value={input.search}
            onChange={(e) => setInput((prev) => ({ ...prev, search: e.target.value }))}
          />
        </div>

        <ul className="centering flex-wrap gap-4 max-w-xl mx-auto flex-1">
          {operator.map((item) => {
            return (
              <li
                key={item}
                onClick={() => setInput((prev) => ({ ...prev, operator: item }))}
                className={`text-lg rounded-md transition-all duration-400 shadow-md ${
                  input.operator === item ? "bg-blue-50" : "bg-white/50"
                } centering h-10 w-10 cursor-pointer`}
              >
                {item}
              </li>
            );
          })}
        </ul>

        <div className="hidden md:flex-end-center">
          <input
            className="h-10 px-4 bg-white rounded-md w-20 text-center shadow-md"
            value={input.search}
            onChange={(e) => setInput((prev) => ({ ...prev, search: e.target.value }))}
          />
        </div>
      </div>

      <div className="centering">
        <div className="overflow-auto py-4">
          <table>
            <thead>
              <tr>
                <th className="text-2xl">{data.operator}</th>
                {table.array.header.map((item, index) => {
                  return (
                    <th key={`1-${index}-${data}`} className="p-3">
                      <input
                        className="bg-transparent text-center w-[80px]"
                        value={value.header[item]}
                        name={item}
                        onChange={onChange}
                      />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {table.array.body.map((bodyItem, index) => {
                return (
                  <tr key={`2-${index}-${data}`}>
                    <th className="px-3">
                      <input
                        className="bg-transparent text-center w-[80px]"
                        value={value.body[bodyItem]}
                        name={bodyItem}
                        onChange={onChange}
                      />
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
        </div>
      </div>
    </section>
  );
};

export default Page;
