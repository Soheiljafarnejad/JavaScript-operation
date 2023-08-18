type CountOptionsType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

type BodyOptionType = `body${CountOptionsType}`;
type HeaderOptionType = `header${CountOptionsType}`;

const bodyOptions: BodyOptionType[] = [
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

const headerOptions: HeaderOptionType[] = [
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

export const tableOptions: { body: BodyOptionType[]; header: HeaderOptionType[] } = {
  body: bodyOptions,
  header: headerOptions,
};

export const convertToString = (value: any): string => {
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

export const convertToPars = (value: any): null | undefined | object | [] | string | number | boolean => {
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

export const defaultValueHeader = tableOptions.header.reduce(
  (prev, current, index) => {
    prev.string = { ...prev.string, [current]: convertToString(defaultValue[index]) };
    prev.params = { ...prev.params, [current]: defaultValue[index] };

    return prev;
  },
  { string: {}, params: {} }
);

export const defaultValueBody = tableOptions.body.reduce(
  (prev, current, index) => {
    prev.string = { ...prev.string, [current]: convertToString(defaultValue[index]) };
    prev.params = { ...prev.params, [current]: defaultValue[index] };

    return prev;
  },
  { string: {}, params: {} }
);
