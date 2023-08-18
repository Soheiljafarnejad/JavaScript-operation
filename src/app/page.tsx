"use client";
import React, { useCallback, useState } from "react";
import { convertToPars, convertToString, defaultValueBody, defaultValueHeader, tableOptions } from "./utils/utils";

type AnyObject = {
  [key: string]: any;
};

type OperatorType = "+" | "-" | "*" | "**" | "/" | "==" | "===";
type DataType = { body: AnyObject; header: AnyObject; operator: OperatorType };
type ValueType = { body: AnyObject; header: AnyObject };

const operator: OperatorType[] = ["+", "-", "*", "**", "/", "==", "==="];

export const calculation = (first: any, second: any, operator: OperatorType) => {
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
  if (result === true) return <span className="bg-green-200 text-green-500">true</span>;
  else if (result === false) return <span className="bg-red-200 text-red-700">false</span>;
  else if (typeof result === "string")
    return <span className="bg-purple-200 text-purple-700">{result === "" ? `""` : result}</span>;
  else if (typeof result === "number") return <span className="bg-amber-200 text-amber-700">{result}</span>;
};

const Page = () => {
  const [data, setData] = useState<DataType>({
    body: defaultValueBody.params,
    header: defaultValueHeader.params,
    operator: "==",
  });
  const [value, setValue] = useState<ValueType>({ header: defaultValueHeader.string, body: defaultValueBody.string });

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const { name, value } = e.target;
    if (name.includes("header")) setValue((prev) => ({ ...prev, header: { ...prev.header, [name]: value } }));
    else setValue((prev) => ({ ...prev, body: { ...prev.body, [name]: value } }));
  }, []);

  const onClick = useCallback(
    (item: OperatorType) => {
      let body: AnyObject = {};
      let header: AnyObject = {};

      for (let key in value.body) body = { ...body, [key]: convertToPars(value.body[key]) };
      for (let key in value.header) header = { ...header, [key]: convertToPars(value.header[key]) };

      let bodyValue: AnyObject = {};
      let headerValue: AnyObject = {};

      for (let key in body) bodyValue = { ...bodyValue, [key]: convertToString(body[key]) };
      for (let key in header) headerValue = { ...headerValue, [key]: convertToString(header[key]) };

      setValue({ body: bodyValue, header: headerValue });
      setData({ operator: item, body, header });
    },
    [value.body, value.header]
  );

  return (
    <section className="p-4">
      <h1 className="centering text-4xl mb-4">JavaScript coercion rules</h1>

      <ul className="centering gap-4 max-w-3xl mx-auto mb-4">
        {operator.map((item) => {
          return (
            <li
              key={item}
              onClick={() => onClick(item)}
              className={`text-xl rounded-md transition-all duration-400  ${
                data.operator === item ? "bg-blue-50" : "bg-white/50"
              } centering h-10 w-10 cursor-pointer`}
            >
              {item}
            </li>
          );
        })}
      </ul>

      <div className="centering">
        <div className="overflow-auto p-4">
          <table>
            <thead>
              <tr>
                <th className="text-2xl">{data.operator}</th>
                {tableOptions.header.map((item, index) => {
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
              {tableOptions.body.map((bodyItem, index) => {
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
                    {tableOptions.header.map((headerItem, titleIndex) => {
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
