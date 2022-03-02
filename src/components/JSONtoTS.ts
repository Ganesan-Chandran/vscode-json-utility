import jsonic = require("jsonic");
import { getJSONUtilityConfiguration } from "./config";
import {
  formatInterfaceName, formatPropertyName, getOptionalKeys, getType,
  isArray, isBoolean, isDate, isNullOrUndefined, isNumber, isObject, isString, isSupportedJsonFormat, isValidJSON, onlyUnique, Result, ResultType
} from "./util";


export function convertJsonToTs(jsonData: string): ResultType {
  try {
    let tsInterface;

    let validationResult = validateJson(jsonData);

    if (validationResult.result === Result.error) {
      return validationResult;
    }

    let parsedJSON = jsonic(validationResult.output);

    if (isArray(parsedJSON)) {
      tsInterface = convertArrayToTs(parsedJSON);
    } else {
      tsInterface = convertToTs(parsedJSON);
    }

    return {
      result: Result.ok,
      output: tsInterface,
      errorMessage: ""
    };

  } catch (err) {
    return {
      result: Result.error,
      output: "",
      errorMessage: (err && err.name && err.name === "SyntaxError" ? "Error while processing the interface. " : "") + err.message
    };
  }
}

function validateJson(jsonData: string): ResultType {
  if (isValidJSON(jsonData)) {
    if (isSupportedJsonFormat(jsonData)) {
      return {
        result: Result.error,
        output: "",
        errorMessage: "Only 'Object' and 'Array of Object' json are supported"
      };
    }
    return {
      result: Result.ok,
      output: jsonData,
      errorMessage: "Invalid JSON"
    };
  }
  else {
    return {
      result: Result.error,
      output: "",
      errorMessage: "Invalid JSON"
    };
  }
}

function convertArrayToTs(json: any, propertyName = "IRootInterface"): string {
  let optional: string[] = [];
  let result: any[] = [];

  arrayType(json, propertyName, optional, result);

  return result.join("\n\n");
}

function convertToTs(json: any, propertyName = "IRootInterface"): string {

  let optional: string[] = [];
  let result: any = [];


  for (let key in json) {
    let value = json[key];

    if (isObject(value)) {
      if (Object.keys(value).length === 0) {
        json[key] = "any;";
        continue;
      }
      let childInterface = formatInterfaceName(key);
      result.push(convertToTs(value, childInterface));
      json[key] = childInterface + ";";
    }
    else if (isArray(value)) {
      json[key] = arrayType(value, key, optional, result);
    }
    else if (isNullOrUndefined(value)) {
      json[key] = "any;";
      optional.push(key);
    }
    else if (isDate(value)) {
      json[key] = "Date;";
    }
    else if (isBoolean(value)) {
      json[key] = "boolean;";
    }
    else if (isNumber(value)) {
      json[key] = "number;";
    }
    else if (isString(value)) {
      json[key] = "string;";
    }
  }

  let formattedInterface = formatInterface(json, propertyName, optional);

  result.push(formattedInterface);

  return result.join("\n\n");
}

function arrayType(value: any, key: string, optional: string[], result: any) {

  if (value.every(isObject)) {
    return arrayWithObjectTypes(value, key, optional, result);
  }
  else {
    return arrayWithMultipleTypes(value, key, optional, result);
  }
}

function arrayWithObjectTypes(value: any, key: string, optional: string[], result: any): string {
  let childJsons = [];

  if (value.length === 0) {
    return `any[]`;
  }

  if (value.length === 1 && Object.keys(value[0]).length === 0) {
    return `any[]`;
  }

  for (let i = 0; i < value.length; i++) {
    if (isNullOrUndefined(value[i])) {
      optional.push(key); continue;
    }
    let json = populateJson(i, value, key);
    childJsons.push(jsonic(json));
  }

  const keys = childJsons
    .map(typeObj => { return Object.keys(typeObj); })
    .reduce((a, b) => [...a, ...b], []);

  const allKeys = keys
    .map(e => { return e.replace("?", ""); })
    .filter(onlyUnique);

  const optionalKeys = keys.filter(getOptionalKeys);

  let types: string[] = [];

  for (let i = 0; i < childJsons.length; i++) {
    for (let j = 0; j < allKeys.length; j++) {
      let obj = childJsons[i];
      let key = allKeys[j];
      if (obj[key] !== undefined) {
        types[j] = types[j] ? (!types[j].includes(obj[key]) ? types[j] + " | " + obj[key] : types[j]) : obj[key];
      } else if (obj[key + "?"] !== undefined) {
        types[j] = types[j] ? (!types[j].includes(obj[key + "?"]) ? types[j] + " | " + obj[key + "?"] : types[j]) : obj[key + "?"];
      } else {
        if (!optional.includes(key)) {
          optional.push(key);
        }
      }
    }
  }

  optionalKeys.forEach(opt => {
    if (!optional.includes(opt.replace("?", ""))) {
      optional.push(opt.replace("?", ""));
    }
  });

  let interfaceString = `{\n`;

  for (let j = 0; j < allKeys.length; j++) {
    let key = allKeys[j];
    interfaceString = `${interfaceString}\t"${key}" : "${types[j].includes("|") ? "(" + types[j] + ")" : types[j]}",\n`;
  }

  interfaceString = interfaceString + "}";

  let interfaceName = formatInterfaceName(key);

  interfaceString = formatInterface(jsonic(interfaceString), interfaceName, optional);

  result.push(interfaceString);

  return `${interfaceName}[]`;
}

function arrayWithMultipleTypes(value: any, key: string, optional: string[], result: any) {
  let type = "";

  for (let i = 0; i < value.length; i++) {
    if (isNullOrUndefined(value[i])) { optional.push(key); continue; }
    let curType = getType(value[i]);
    if (curType === "Array") {
      curType = arrayType(value[i], key, optional, result);
    } else if (curType === "object") {
      let childInterface = formatInterfaceName(key);
      result.push(convertToTs(value[i], childInterface));
      curType = childInterface;
    }
    type = !type.includes(curType) ? (type === "" ? curType : type + " | " + curType) : type;
  }
  return type.includes("|") ? `(${type})[]` : `${type}[]`;
}

function populateJson(index: number, value: any, key: string) {
  let childInterfaceName = formatInterfaceName(key);
  let childInterface = convertToTs(value[index], childInterfaceName);
  let json = childInterface
    .replace(/(([ ]*(export)?[ ]*interface[ ]*)([a-zA-Z0-9-]*[ ]*))/gm, "")
    .replace(/(:)([ ]*)(([\[\]\(a-z0-9A-Z\| \)]*|[a-z0-9A-Z])([[]])*(\?)?([ ]*))(;|,)*/gm, "$1\"$3\",")
    .replace(/([a-zA-Z0-9-]+(\?))(:)/gm, "\"$1\":");
  return json;
}

function formatInterface(json: any, propertyName: string, optional: string[]) {
  let result = JSON.stringify(json, null, "\t").replace(new RegExp("\"", "g"), "");

  let config = getJSONUtilityConfiguration();
  const isLowerCamelCase = config.get('property', true);

  if (optional && optional.length > 0) {
    for (let key in json) {
      if (optional.includes(key) || optional.includes(key + "?")) {
        result = result.replace((key + ":"), (isLowerCamelCase ? formatPropertyName(key) : key) + "?:");
      }
    }
  }

  result = result
    .replace(/((,|;)+)/gm, ";")
    .replace(/((:)([ ]*)(([\[\]\(a-z0-9A-Z\| \)]*|[a-z0-9A-Z])([[]])*(\?)?([ ]*)))((;|,)*)(\n([ ])*})/gm, "$1;$11");

  return "export interface " + propertyName + " " + result;
}


