"use client";

import React, { useEffect, useState } from "react";

type OperatorType = "+" | "-" | "*" | "**" | "/" | "==" | "===";

const bodyOptions = [
  "body1",
  "body2",
  "body3",
  "body4",
  "body5",
  "body6",
  "body7",
  "body8",
  "body9",
  "body10",
  "body11",
  "body12",
  "body13",
  "body14",
  "body15",
  "body16",
  "body17",
  "body18",
  "body19",
  "body20",
];

const headerOptions = [
  "header1",
  "header2",
  "header3",
  "header4",
  "header5",
  "header6",
  "header7",
  "header8",
  "header9",
  "header10",
  "header11",
  "header12",
  "header13",
  "header14",
  "header15",
  "header16",
  "header17",
  "header18",
  "header19",
  "header20",
];

const operator: OperatorType[] = ["+", "-", "*", "**", "/", "==", "==="];

const defaultValue = [
  0,
  "0",
  [0],
  [],
  {},
  "",
  null,
  [null],
  undefined,
  NaN,
  [NaN],
  "a",
  Infinity,
  1,
  "1",
  [1],
  true,
  false,
  "true",
  "false",
];

const convertToString = (value: any): string => {
  if (typeof value === "string") {
    return `"${value}"`;
  } else if (typeof value === "number" || typeof value === "boolean") {
    return value.toString();
  } else if (Array.isArray(value)) {
    return value.length ? `[${value[0]}]` : `[]`;
  } else if (value === null) {
    return "null";
  } else if (value === undefined) {
    return "undefined";
  } else if (isNaN(value) && typeof value !== "object") {
    return "NaN";
  } else if (value === Infinity) {
    return "Infinity";
  } else if (typeof value === "object") {
    return "{}";
  } else {
    return String(value);
  }
};

const convertToPars = (value: any): null | undefined | object | [] | string | number | boolean => {
  if (/(['"]).*\1/g.test(value)) {
    const replaceValue = value.replace(/(['"])["']{2}\1/g, "");
    return JSON.parse(replaceValue);
  } else if (value.includes("[") && value.includes("]")) {
    const firstIndex = value.indexOf("[") + 1;
    let lastIndex = value.indexOf(",");
    if (lastIndex === -1) lastIndex = value.indexOf("]");
    const indexOneValue = value.slice(firstIndex, lastIndex);
    return indexOneValue ? [convertToPars(indexOneValue)] : [];
  } else if (value.includes("{") && value.includes("}")) {
    return {};
  } else if (value === "null") {
    return null;
  } else if (value === "undefined") {
    return undefined;
  } else if (value === "NaN") {
    return NaN;
  } else if (value === "Infinity") {
    return Infinity;
  } else if (value && (value === "false" || value === "true" || !isNaN(value))) {
    return JSON.parse(value);
  } else {
    return value;
  }
};

const calculation = (first: any, second: any, operator: OperatorType) => {
  if (operator === "+") return first + second;
  else if (operator === "-") return first - second;
  else if (operator === "/") return first / second;
  else if (operator === "*") return first * second;
  else if (operator === "**") return first ** second;
  else if (operator === "==") return first == second;
  else if (operator === "===") return first === second;
};

const showResult = (first: any, second: any, operator: OperatorType) => {
  const result = calculation(first, second, operator);
  if (result === true) return <span className="bg-green-200 text-green-500">true</span>;
  else if (result === false) return <span className="bg-red-200 text-red-700">false</span>;
  else if (typeof result === "string")
    return <span className="bg-purple-200 text-purple-700">{result === "" ? `""` : result}</span>;
  else if (typeof result === "number") return <span className="bg-amber-200 text-amber-700">{result}</span>;
};

const defaultHeader = headerOptions.reduce((prev, current, index) => {
  prev = { ...prev, [current]: convertToString(defaultValue[index]) };
  return prev;
}, {});

const defaultBody = bodyOptions.reduce((prev, current, index) => {
  prev = { ...prev, [current]: convertToString(defaultValue[index]) };
  return prev;
}, {});

const Page = () => {
  const [data, setData] = useState<{ body: {}; header: {}; operator: OperatorType }>({
    body: defaultBody,
    header: defaultHeader,
    operator: "==",
  });

  const [hederValue, setHeaderValue] = useState(defaultHeader);
  const [bodyValue, setBodyValue] = useState(defaultBody);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    if (name.includes("header")) setHeaderValue((prev) => ({ ...prev, [name]: value }));
    else setBodyValue((prev) => ({ ...prev, [name]: value }));
  };

  const onClick = (item: OperatorType) => {
    let body = {};
    let header = {};

    for (let key in bodyValue) body[key] = convertToPars(bodyValue[key]);

    for (let key in hederValue) header[key] = convertToPars(hederValue[key]);

    let _bodyValue = {};
    let _headerValue = {};

    for (let key in body) _bodyValue[key] = convertToString(body[key]);
    for (let key in header) _headerValue[key] = convertToString(header[key]);

    setBodyValue(_bodyValue);
    setHeaderValue(_headerValue);

    setData({ operator: item, body, header });
  };

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
                {headerOptions.map((item, index) => {
                  return (
                    <th key={`1-${index}-${data}`} className="p-3">
                      <input
                        className="bg-transparent text-center w-[80px]"
                        value={hederValue[item]}
                        name={item}
                        onChange={onChange}
                      />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {bodyOptions.map((bodyItem, index) => {
                return (
                  <tr key={`2-${index}-${data}`}>
                    <th className="px-3">
                      <input
                        className="bg-transparent text-center w-[80px]"
                        value={bodyValue[bodyItem]}
                        name={bodyItem}
                        onChange={onChange}
                      />
                    </th>
                    {headerOptions.map((headerItem, titleIndex) => {
                      return (
                        <td key={`3-${headerItem}-${titleIndex}-${data}`}>
                          {showResult(data.body[bodyItem], data.header[headerItem], data.operator)}
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
