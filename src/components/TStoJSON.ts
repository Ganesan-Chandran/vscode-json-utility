import { getJSONUtilityConfiguration } from "./config";
import {
  countString, formatJSON, generateNumber, generateNumberFromInterval,
  generateString, getPosition, isArray, isObject, isOptionalProperty,
  randomCheck, removeCommentsFromInterface, Result, ResultType, Types, validateInterface
} from "./util";

export function modeltoJSON(interfaceString: string): ResultType {

  let dict: { [name: string]: string } = {};
  let roorInterfaceName = "";
  let finalJSON: any;
  let finalJSONString: string = "";
  let missingInterfaceList: string[];

  try {
    let pureInterface = removeCommentsFromInterface(interfaceString);
    missingInterfaceList = validateInterface(pureInterface);

    if (missingInterfaceList.length > 0) {
      return {
        result: Result.error,
        output: "",
        errorMessage: "Invalid interface(s). " + missingInterfaceList.join(", ") + " interface(s) are missing!!!!"
      };
    }

    dict = buildJSON(pureInterface);

    roorInterfaceName = replaceChildJSON(dict);

    if (Object.keys(dict).length === 1) {
      finalJSON = processInterface(dict, roorInterfaceName);
      finalJSONString = JSON.stringify(finalJSON, null, 2);
    } else {
      Object.keys(dict).forEach((item) => {
        let commentLine = `/** ${item} **/`;
        finalJSON = processInterface(dict, item);
        finalJSONString = finalJSONString + "\n\n" + commentLine + "\n\n" + JSON.stringify(finalJSON, null, 2);
      });
    }

    return {
      result: Result.ok,
      output: finalJSONString,
      errorMessage: ""
    };
  }
  catch (err) {
    return {
      result: Result.error,
      output: "",
      errorMessage: "Invalid Interface. Please check it. " + err.message
    };
  }
}

function processInterface(dict: { [name: string]: string }, interfaceName: string): any {
  let rootJSONString = "";

  rootJSONString = replaceWithValues(JSON.parse(dict[interfaceName]));

  rootJSONString = formatJSON(rootJSONString);

  return JSON.parse(rootJSONString);
}

function buildJSON(jsonStr: string): { [name: string]: string } {

  let pos = 2;
  let prev = 0;
  let current = 0;
  let dict: { [name: string]: string } = {};

  while (true) {
    current = getPosition(jsonStr, 'interface', pos);
    if (prev === current) {
      break;
    } else {
      let interfaceString = jsonStr.substring(prev, current);
      interfaceString = interfaceString.trim().replace(/}[ |\n|\t|\r]*(export)*/gm, "}").replace(/;/gm, ",");
      let count = countString(interfaceString, "{"); // check any chile object
      if (count > 1) {
        let start = 0;
        let end = 0;
        for (let i = count; i > 1; i--) {
          start = getPosition(interfaceString, '{', i);
          end = getPosition(interfaceString, '}', 1);
          let interfaceString1 = interfaceString.substring(start, end + 1);
          let name = generateString(10);
          let finalinter = interfaceString1;
          finalinter = finalinter.trim().replace(/([ ]*)([\[\]\(a-z0-9A-Z\| \)]*|[a-z0-9A-Z])([[]])*(\?)?([ ]*)(:|,)/gm, "\"$2$3$4\"" + "$6")
            .replace(/(\"[ ]+)|([ ]+\")/gm, "\"").replace(/,([^,]*)$/, '' + "$1");
          dict[name] = finalinter;
          interfaceString = interfaceString.replace(interfaceString1, name);
        }
      }
      let nameList = interfaceString.match(/([ ]*(export)?[ ]*interface[ ]*[a-zA-Z0-9]*[ ]*\{)/gm);
      let name = nameList ? nameList[0].replace("export", "").replace("interface", "").replace("{", "").trim() : "";
      interfaceString = interfaceString.trim().replace(/([ ]*)([\[\]\(a-z0-9A-Z\| \)]*|[a-z0-9A-Z])([[]])*(\?)?([ ]*)(:|,)/gm, "\"$2$3$4\"" + "$6")
        .replace(/(\"[ ]+)|([ ]+\")/gm, "\"").replace(/,([^,]*)$/, '' + "$1").replace("export", "").replace("interface", "").replace(name, "").trim();
      dict[name] = interfaceString;
    }
    prev = current;
    pos++;
  }

  return dict;
}

function replaceChildJSON(dict: { [name: string]: string }): string {
  let rootJSONString: string;
  let roorInterfaceName: string = "";
  let replaceItem: string | null;
  let deletedKeys: string[] = [];

  if (Object.keys(dict).length < 2) { return Object.keys(dict)[0]; };

  for (let key in dict) {
    let available = false;
    for (let key1 in dict) {
      if (key !== key1 && !deletedKeys.includes(key1)) {
        rootJSONString = dict[key1];
        let match = replecChildWithRegex(key, rootJSONString);
        for (let i = 0; i < match.length; i++) {
          let matches = match[i].split(":");
          let prop = matches[0].trim();
          let value = matches[matches.length - 1].trim();
          if (value.includes("|")) {
            let typeList = value.replace(/[^0-9a-zA-Z|]/gm, '');
            let splitType = typeList.split("|");
            const found = splitType.find(element => element === key);
            if (!found) {
              continue;
            }
          } else {
            let typeList = value.replace(/[^0-9a-zA-Z]/gm, '');
            if (typeList !== key) {
              continue;
            }
          }
          let isNullForOptionalProp = isOptionalProperty(prop) ? (randomCheck() ? true : false) : false;
          if (!isNullForOptionalProp) {
            replaceItem = replaceChildInterface(dict, key, value);
          } else {
            replaceItem = null;
          }
          let hideTypes = value.replace(/string|any|boolean|number|Date/gm, "").replace(/[^0-9a-zA-Z|]/gm, '').replace(new RegExp(key, "gm"), "").split("|").filter(e => e !== "");
          if (hideTypes && hideTypes.length > 0) {
            hideTypes.forEach(item => { deletedKeys.push(item); });
          }
          let curlyCloseBrackets = value.match(/(})/gm) ?? [];
          let commas = value.match(/(,)/gm) ?? [];
          rootJSONString = rootJSONString.replace(value, replaceItem + curlyCloseBrackets.join("") + commas.join(""));
          dict[key1] = rootJSONString;
          roorInterfaceName = key1;
          available = true;
        }
      }
    }
    if (available) {
      deletedKeys.push(key);
    }
  }

  deletedKeys.forEach(key => {
    delete dict[key];
  });

  return roorInterfaceName;
}

function replaceChildInterface(dict: { [name: string]: string }, key: string, value: string): string {
  let strTypes: string[];
  let typeOption: string;
  let pickedType: string;
  let replaceItem: string;
  let childJSONString: string;

  if (value.includes("|")) {
    childJSONString = dict[key];
    strTypes = value.split("|");
    typeOption = getTypeConfiguration();
    pickedType = (typeOption === "Random Type" ? strTypes[generateNumberFromInterval(0, strTypes.length - 1)] : strTypes[0]);
    replaceItem = pickedType.replace(/\"/gm, "").replace(/\(/gm, "").replace(/,/gm, "").replace(/\)\[\]/gm, "").replace(/\)/gm, "").replace(/\}/gm, "").trim() + (value.includes(")[]") ? "[]" : "");
    let bracketLength = replaceItem.match(/\[\]/gm)?.length ?? 0;
    replaceItem = replaceItem.replace(/\[\]/gm, "");
    let isPrimitive = false;
    if (pickedType.includes(key)) {
      replaceItem = replaceItem.replace(key, `${JSON.stringify(JSON.parse(childJSONString))}`);
    } else {
      let regex = /string|any|boolean|number|Date/gm;
      if (replaceItem.match(regex) === null) {
        childJSONString = dict[replaceItem];
        replaceItem = replaceItem.replace(replaceItem, `${JSON.stringify(JSON.parse(childJSONString))}`);
      } else {
        isPrimitive = true;
      }
    }

    replaceItem = addBrackets(bracketLength, replaceItem, isPrimitive);

    if (isPrimitive) {
      replaceItem = `"${replaceItem}"`;
    }

  } else {
    pickedType = value;
    replaceItem = pickedType.replace(/\"/gm, "").replace(/,/gm, "").replace(/\}/gm, "").trim();
    let bracketLength = replaceItem.match(/\[\]/gm)?.length ?? 0;
    replaceItem = replaceItem.replace(/\[\]/gm, "");
    childJSONString = dict[replaceItem];
    replaceItem = replaceItem.replace(key, `${JSON.stringify(JSON.parse(childJSONString))}`);
    replaceItem = addBrackets(bracketLength, replaceItem);
  }

  return replaceItem;
}

function addBrackets(bracketLength: number, replaceItem: string, isPrimitive: boolean = false): string {
  for (let j = 0; j < bracketLength; j++) {
    replaceItem = isPrimitive ? `${replaceItem}[]` : `[${replaceItem}]`;
  }

  return replaceItem;
}

function replecChildWithRegex(key: string, jsonString: string): string[] {
  let regex1 = "(.*" + key + ".*)";
  if (new RegExp(regex1).test(jsonString)) {
    return jsonString.replace(/,/gm, ",\n").trim().match(new RegExp(regex1, "gm")) ?? [];
  }

  return [];
}

function replaceWithValues(json: any) {
  let replacementValue: any;
  for (let key in json) {
    let value = json[key];

    if (value === null) {
      continue;
    }

    if (isObject(value)) {
      json[key] = replaceWithValues(value);
      continue;
    }

    replacementValue = checkPrimitiveTypes(value, key); // Ex. string or number or date or boolean or any
    if (replacementValue !== "") {
      json[key] = replacementValue;
      continue;
    }

    replacementValue = checkTypeIsArray(value, key); // string[] or number[] or boolean[]
    if (replacementValue !== "") {
      json[key] = replacementValue;
      continue;
    } else {
      if (isArray(value) && isArray(value[0])) { // Check MultiArray (MultiArray of Other Interface)
        json[key] = [[replaceWithValues(value[0][0])]];
        continue;
      }

      if (isArray(value)) { // Array of Other Interface
        json[key] = [replaceWithValues(value[0])];
        continue;
      }
    }

    replacementValue = checkUnionArray(value); // Ex. (string | number | boolean)[] or (string[] | number | boolean[])[]
    if (replacementValue.length > 0) {
      json[key] = isOptionalProperty(key) ? (randomCheck() ? null : replacementValue) : replacementValue;
      continue;
    }

    replacementValue = checkMultipleArrayType(value); // string[] | number[] |  boolean[]   or  string[][] or number[][] or boolean[][]  or  string[][] | number[][] |  boolean[][]   or  string | number | boolean
    let isArrayType = isArray(replacementValue);
    if (isArrayType && replacementValue.length > 0) {
      json[key] = isOptionalProperty(key) ? (randomCheck() ? null : replacementValue) : replacementValue;
      continue;
    }
    if (!isArrayType && (replacementValue !== "" || replacementValue !== null)) {
      json[key] = isOptionalProperty(key) ? (randomCheck() ? null : replacementValue) : replacementValue;
      continue;
    }
  }

  return json;
}

function checkPrimitiveTypes(value: string, key: string): any {
  if (value.includes("[]")) {
    return "";
  }
  if (value === "string") {
    return replecedValue(key, Types.string, false);
  }
  if (value === "number") {
    return replecedValue(key, Types.number, false);
  }
  if (value === "Date") {
    return replecedValue(key, Types.date, false);
  }
  if (value === "boolean") {
    return replecedValue(key, Types.boolean, false);
  }
  if (value === "any") {
    return replecedValue(key, Types.any, false);
  }

  return "";
}

function checkTypeIsArray(value: string, key: string): any {
  if (value === "string[]") {
    return replecedValue(key, Types.string, true);
  }
  if (value === "number[]") {
    return replecedValue(key, Types.number, true);
  }
  if (value === "Date[]") {
    return replecedValue(key, Types.date, true);
  }
  if (value === "boolean[]") {
    return replecedValue(key, Types.boolean, true);
  }
  if (value === "any[]") {
    return replecedValue(key, Types.any, true);
  }

  return "";
}

function replecedValue(key: string, type: Types, isArray: boolean = false): any {
  let value: any;
  switch (type) {
    case Types.string:
      value = isArray ? [generateString(10)] : generateString(10);
      break;
    case Types.number:
      value = isArray ? [generateNumber(4)] : generateNumber(4);
      break;
    case Types.date:
      value = isArray ? [new Date()] : new Date();
      break;
    case Types.boolean:
      value = isArray ? [true] : true;
      break;
    case Types.any:
      value = isArray ? [{}] : {};
      break;
  }

  return isOptionalProperty(key) ? (randomCheck() ? null : value) : value;
}

function checkUnionArray(value: string): any[] {
  let arr: any[] = [];
  if (value.includes(")[]")) {
    if (value.includes("|")) {
      let str = value.replace(")[]", "").split("|");
      for (let i = 0; i < str.length; i++) {
        let type = str[i].trim();
        replaceArray(type, arr);
      }
    } else {
      replaceArray(value, arr);
    }
  }

  return arr;
}

function replaceArray(type: string, arr: any[]) {
  let val = checkMultipleArrayType(type);
  let isArrayType = isArray(val);
  if (isArrayType && val.length > 0) {
    arr.push(val);
    return;
  }
  if (!isArrayType && (val !== "" || val !== null)) {
    arr.push(val);
    return;
  }
  primitiveTypesInArray(type, arr);
}

function primitiveTypesInArray(type: string, arr: any[]) {
  if (type.includes("string")) {
    arr.push(generateString(10));
  }
  if (type.includes("number")) {
    arr.push(generateNumber(4));
  }
  if (type.includes("Date")) {
    arr.push(new Date());
  }
  if (type.includes("boolean")) {
    arr.push(true);
  }
  if (type.includes("any")) {
    arr.push("{}");
  }
}

function checkMultipleArrayType(value: string): any {
  let arr: any[] = [];

  if (value.includes("|")) {
    let str = value.split("|");
    let typeOption = getTypeConfiguration();
    value = (typeOption === "Random Type" ? str[generateNumberFromInterval(0, str.length - 1)] : str[0]);
  }

  let isMultipleArrayOnly: boolean = true;
  if (value.includes("[][]")) {
    isMultipleArrayOnly = false;
  }

  if (value.includes("string[]")) {
    arr.push(isMultipleArrayOnly ? generateString(10) : [generateString(10)]);
  }
  else if (value.includes("number[]")) {
    arr.push(isMultipleArrayOnly ? generateNumber(4) : [generateNumber(4)]);
  }
  else if (value.includes("Date[]")) {
    arr.push(isMultipleArrayOnly ? new Date() : [new Date()]);
  }
  else if (value.includes("boolean[]")) {
    arr.push(isMultipleArrayOnly ? true : [true]);
  }
  else if (value.includes("any[]")) {
    arr.push(isMultipleArrayOnly ? "{}" : ["{}"]);
  } else {
    primitiveTypesInArray(value, arr);
    return arr[0];
  }

  return arr;
}


function getTypeConfiguration(): string {
  let config = getJSONUtilityConfiguration();
  const typeOption = config.get('typeInUnionTypes', "Random Type");
  return typeOption;
}