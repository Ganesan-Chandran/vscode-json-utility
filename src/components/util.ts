import jsonic = require("jsonic");

export enum Types {
  string,
  number,
  boolean,
  date,
  any,
  arrayWithUnionTypeArray,
  multiArrayWithUnion,
  arrayWithUnion,
  arrayOnly,
  multiArrayOnly,
  onlyVal,
  nil
}

export enum FormatMode {
  prettify,
  minify,
};

export enum Result {
  ok,
  error
}

export interface ResultType {
  result: Result
  output: string | any
  errorMessage: string
}

export function isValidJSON(jsonData: string): boolean {
  try {
    if (jsonData.length > 0 && jsonic(jsonData)) {
      return true;
    }
    return false;
  }
  catch {
    return false;
  }
}

export function isArray(value: any): boolean {
  return value && Object.prototype.toString.call(value) === "[object Array]";
}

export function isObject(value: any): boolean {
  return value && Object.prototype.toString.call(value) === "[object Object]" && !isArray(value);
}

export function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined || typeof value === 'undefined';
}

export function isDate(value: any): boolean {
  return Object.prototype.toString.call(value) === "[object Date]";
};

export function isNumber(value: any): boolean {
  if (isString(value)) {
    return false;
  }

  if (isNaN(value)) {
    return false;
  }

  return true;
};

export function isString(value: any): boolean {
  if (typeof value === 'string' || value instanceof String) {
    return true;
  }

  return false;
};

export function isBoolean(value: any): boolean {
  if (typeof (value) === "boolean") {
    return true;
  }

  return false;
};

export function isError(value: any): boolean {
  return value && ("message" in value);
}

export function isOptionalProperty(key: string): boolean {
  if (key.includes("?")) {
    return true;
  }

  return false;
}

export function randomCheck(): boolean {
  return (generateNumber(2) % 2 === 0);
}

export const generateString = function (length: number, randomString = ""): string {
  randomString += Math.random().toString(20).substring(2, length);
  if (randomString.length > length) { return randomString.slice(0, length); };
  return generateString(length, randomString);
};

export function generateNumber(digit: number): number {
  let result = Math.floor((Math.random() * digit) + 1);
  return result;
}

export function generateNumberFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function formatJSON(json: any) {
  let result = JSON.stringify(json);
  result = result.replace(/\?/gm, "");
  return result;
}

export function validateInterface(interfaceString: string): string[] {
  let missingInterfaces: string[] = [];
  let chileInterfaceList = interfaceString.trim()
    .replace(/(([ ]*(export)?[ ]*interface[ ]*[a-zA-Z0-9]*[ ]*\{)|([a-zA-Z0-9-]+(\?)?)[ ]*(:))|(\}|;)/gm, "")
    .replace(/(\r\n|\n|\r|\(|\)|[[]]|\|)/gm, "")
    .replace(/(string|number|boolean|Date|any|unknown|)/gm, "")
    .trim()
    .split(" ")
    .filter(e => e !== "");

  function checkInterfaceIsAvailable(item: string) {
    let re = new RegExp(`\\binterface[ ]*${item.trim()}\\b`, 'gi');
    if (interfaceString.match(re) === null) {
      missingInterfaces.push(item);
    }
  }

  chileInterfaceList.forEach(checkInterfaceIsAvailable);

  return missingInterfaces;
}

export function removeCommentsFromInterface(interfaceString: string): string {
  let pureInterface = interfaceString.trim().replace(/(\/\/[^\n]*$|\/(?!\\)\*[\s\S]*?\*(?!\\)\/)/gm, " ");
  return pureInterface;
}

export function isSupportedJsonFormat(json: any): boolean {
  const isArrayOfObjects = json && json.length > 0 && isArray(json) && json.reduce((a: any, b: any) => a && isObject(b), true);

  if (!(isObject(json) || isArrayOfObjects)) {
    return false;
  }

  return true;
}

export function onlyUnique(value: any, index: number, self: any): boolean {
  return self.indexOf(value) === index;
}

export function getOptionalKeys(value: any): string[] {
  return value.includes("?");
}

export function getType(value: any): string {
  if (isArray(value)) {
    return "Array";
  }
  if (typeof value === "string" && isValidDate(value)) {
    return "Date";
  }

  return typeof value;
}

function isValidDate(value: any): boolean {
  if (!isNaN(value)) { return false;; };
  let date = Date.parse(value);

  if (new Date(date).toString() !== "Invalid Date") {
    if (isNaN(date)) {
      return false;
    }
    else {
      return true;
    }
  }
  return false;
}

export function formatInterfaceName(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export function formatPropertyName(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1);
};