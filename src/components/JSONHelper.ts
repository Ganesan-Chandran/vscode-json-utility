import { isValidJSON, Result, ResultType } from "./util";
import { getJSONTabConfiguration } from "./config";
import * as jsonic from 'jsonic';

export function prettifyJSON(json: string): ResultType {
  if (isValidJSON(json)) {
    return {
      result: Result.ok,
      output: JSON.stringify(JSON.parse(json), null, getJSONTabConfiguration()),
      errorMessage: ""
    };
  } else {
    return {
      result: Result.error,
      output: "",
      errorMessage: "Invalid JSON."
    };
  }
}

export function minifyJSON(json: string): ResultType {
  if (isValidJSON(json)) {
    return {
      result: Result.ok,
      output: JSON.stringify(JSON.parse(json)),
      errorMessage: ""
    };
  } else {
    return {
      result: Result.error,
      output: "",
      errorMessage: "Invalid JSON."
    };
  }
}

export function fixJson(jsonString: string): ResultType {
  try {
    let json = JSON.stringify(jsonic(jsonString), null, getJSONTabConfiguration());
    return {
      result: Result.ok,
      output: json,
      errorMessage: ""
    };
  } catch (e) {
    let result = e.message;
    if (e.name === 'SyntaxError') {
      result = `Error in line (${e.line}, ${e.column}).\n${result}.`;
    }
    return {
      result: Result.error,
      output: "",
      errorMessage: result
    };
  }
}