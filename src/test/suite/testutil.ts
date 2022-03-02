import { isBoolean, isDate, isNumber, isObject, isString } from "../../components/util";

export function testValueType(arrTypes: string[], value: any): boolean {
  for (let i = 0; i < arrTypes.length; i++) {
    switch (arrTypes[i]) {
      case "string":
        if (isString(value)) {
          return true;
        }
        break;
      case "number":
        if (isNumber(value)) {
          return true;
        }
        break;
      case "boolean":
        if (isBoolean(value)) {
          return true;
        }
        break;
      case "Date":
        if (isDate(value)) {
          return true;
        }
        break;
      case "any":
        if (isObject(value)) {
          return true;
        }
        break;
    }
  }

  return false;
}