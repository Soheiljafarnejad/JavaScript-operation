type initialType = {
  array: { body: any[]; header: any[] };
  object: { header: { stringify: {}; pars: {} }; body: { stringify: {}; pars: {} } };
};

export const convertToString = (value: any): string => {
  if (typeof value === "string") {
    return `"${value}"`;
  } else if (typeof value === "number" || typeof value === "boolean") {
    return value.toString();
  } else if (Array.isArray(value)) {
    return value.length ? `[${convertToString(value[0])}]` : `[]`;
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

export const convertToPars = (value: any): null | undefined | {} | [] | string | number | boolean => {
  if (/(['"]).*\1/g.test(value)) {
    let newValue = value.replace(/(['"])["']{2}\1/g, "");
    try {
      return JSON.parse(newValue);
    } catch (error) {
      return undefined;
    }
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
  } else if (value === "false" || value === "true") {
    return JSON.parse(value);
  } else if (value && !isNaN(value)) {
    return Number(value);
  } else {
    return undefined;
  }
};

const defaultValue = () => {
  return [0, "0", [0], [], {}, "", null, [null], undefined, NaN, [NaN], "a", Infinity, 1, "1", [1], true, false, "true", "false"];
};

const HeaderDefaultValue = defaultValue();
const bodyDefaultValue = defaultValue();

export const createDefaultValue = (total: number | string = 20) => {
  const _total = isNaN(+total) || +total > 20 ? 20 : +total;

  let initial: initialType = {
    array: { body: [], header: [] },
    object: { header: { stringify: {}, pars: {} }, body: { stringify: {}, pars: {} } },
  };

  for (let i = 0; i < _total; i++) {
    initial.array.body.push(`body${i}`);
    initial.array.header.push(`header${i}`);

    initial.object.body.stringify = { ...initial.object.body.stringify, [`body${i}`]: convertToString(bodyDefaultValue[i]) };
    initial.object.header.stringify = {
      ...initial.object.header.stringify,
      [`header${i}`]: convertToString(HeaderDefaultValue[i]),
    };

    initial.object.body.pars = { ...initial.object.body.pars, [`body${i}`]: bodyDefaultValue[i] };
    initial.object.header.pars = { ...initial.object.header.pars, [`header${i}`]: HeaderDefaultValue[i] };
  }

  return initial;
};
