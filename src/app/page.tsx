"use client";

import React, { useState } from "react";

type OperatorType = "+" | "-" | "*" | "**" | "/" | "==" | "===";

const options = [
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

const operator: OperatorType[] = ["+", "-", "*", "**", "/", "==", "==="];

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

const showLabel = (item: any) => {
  if (item !== null && item !== undefined) {
    const stringify = item.toString();
    if (Array.isArray(item) && item.length) return `[${item[0]}]`;
    else if (stringify === "NaN" || stringify === "Infinity") return stringify;
    else return `${JSON.stringify(item)}`;
  } else return `${JSON.stringify(item)}`;
};

const Page = () => {
  const [value, setValue] = useState<OperatorType>("==");

  return (
    <section className="p-4">
      <h1 className="centering text-4xl mb-4">JavaScript coercion rules</h1>

      <ul className="centering gap-4 max-w-3xl mx-auto mb-4">
        {operator.map((item) => {
          return (
            <li
              key={item}
              onClick={() => setValue(item)}
              className={`text-xl rounded-md transition-all duration-400  ${
                value === item ? "bg-blue-50" : "bg-white/50"
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
                <th className="text-2xl">{value}</th>
                {options.map((item, index) => {
                  return (
                    <th key={`1-${index}-${value}`} className="p-3">
                      {showLabel(item)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {options.map((bodyItem, index) => {
                return (
                  <tr key={`2-${index}-${value}`}>
                    <th className="px-3">{showLabel(bodyItem)}</th>
                    {options.map((headerItem, titleIndex) => {
                      return <td key={`3-${headerItem}-${titleIndex}-${value}`}>{showResult(bodyItem, headerItem, value)}</td>;
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
