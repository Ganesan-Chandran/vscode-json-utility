import * as assert from 'assert';
import { modeltoJSON } from '../../components/TStoJSON';
import { isArray, isBoolean, isDate, isNumber, isObject, isString, Result } from '../../components/util';
import { testValueType } from './testutil';

suite('TStoJSON Test Suite', () => {
  test('1 - Simple TS', () => {
    let ts = `interface Sample2 {
      text1: string;
    }`;

    let jsonResult = modeltoJSON(ts);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let json = JSON.parse(jsonResult.output);
    assert.strictEqual(1, Object.keys(json).length);
    assert.strictEqual(true, isString(json["text1"]));
  });

  test('2 - Mutiple Props TS', () => {
    let ts = `interface Sample2 {
      text1 : string;
      text2 : number;
      text3 : boolean;
      text4 : any;
    }`;

    let jsonResult = modeltoJSON(ts);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let json = JSON.parse(jsonResult.output);
    assert.strictEqual(4, Object.keys(json).length);
    assert.strictEqual(true, isString(json["text1"]));
    assert.strictEqual(true, isNumber(json["text2"]));
    assert.strictEqual(true, isBoolean(json["text3"]));
    assert.strictEqual(0, Object.keys(json["text4"]).length);
  });

  test('3 - Mutiple Array Props TS', () => {
    let ts = `interface Sample2 {
      text1 : string[];
      text2 : number[];
      text3 : boolean[];
      text4 : any;
    }`;

    let jsonResult = modeltoJSON(ts);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let json = JSON.parse(jsonResult.output);
    assert.strictEqual(4, Object.keys(json).length);
    assert.strictEqual(true, isArray(json["text1"]));
    assert.strictEqual(true, isString(json["text1"][0]));
    assert.strictEqual(true, isArray(json["text2"]));
    assert.strictEqual(true, isNumber(json["text2"][0]));
    assert.strictEqual(true, isArray(json["text3"]));
    assert.strictEqual(true, isBoolean(json["text3"][0]));
    assert.strictEqual(0, Object.keys(json["text4"]).length);
  });

  test('4 - Simple Union TS', () => {
    let ts = `interface Sample2 {
      text1: string | boolean | number;
    }`;

    let jsonResult = modeltoJSON(ts);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let json = JSON.parse(jsonResult.output);
    assert.strictEqual(1, Object.keys(json).length);
    assert.strictEqual(true, testValueType("string | boolean | number".split("|").map(e => e.trim()), json["text1"]));
  });

  test('5 - Array Type in Union TS', () => {
    let ts = `interface Sample2 {
      text1: string[] | boolean[] | number[];
    }`;

    let jsonResult = modeltoJSON(ts);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let json = JSON.parse(jsonResult.output);
    assert.strictEqual(1, Object.keys(json).length);
    assert.strictEqual(true, isArray(json["text1"]));
    assert.strictEqual(true, testValueType("string | boolean | number".split("|").map(e => e.trim()), json["text1"][0]));
  });

  test('6 - Union Array TS', () => {
    let ts = `interface Sample2 {
      text1: (string | boolean | number)[];
    }`;

    let jsonResult = modeltoJSON(ts);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let json = JSON.parse(jsonResult.output);
    assert.strictEqual(1, Object.keys(json).length);
    assert.strictEqual(true, isArray(json["text1"]));
    assert.strictEqual(true, testValueType("string | boolean | number".split("|").map(e => e.trim()), json["text1"][0]));
  });

  test('7 - Array in Union Array TS', () => {
    let ts = `interface Sample2 {
      text1: (string[] | boolean[])[];
    }`;

    let jsonResult = modeltoJSON(ts);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let json = JSON.parse(jsonResult.output);
    assert.strictEqual(1, Object.keys(json).length);
    assert.strictEqual(true, isArray(json["text1"]));
    assert.strictEqual(true, isArray(json["text1"][0]));
    assert.strictEqual(true, testValueType("string | boolean".split("|").map(e => e.trim()), json["text1"][0][0]));
  });

  test('8 - Multi Array Type in Union TS', () => {
    let ts = `interface Sample2 {
      text1: string[][] | number[][];
    }`;

    let jsonResult = modeltoJSON(ts);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let json = JSON.parse(jsonResult.output);
    assert.strictEqual(1, Object.keys(json).length);
    assert.strictEqual(true, isArray(json["text1"]));
    assert.strictEqual(true, isArray(json["text1"][0]));
    assert.strictEqual(true, testValueType("string | number".split("|").map(e => e.trim()), json["text1"][0][0]));
  });

  test('9 - Interface Missing', () => {
    let ts = `interface Sample2 {
      text1: TestInterface;
    }`;

    let jsonResult = modeltoJSON(ts);

    assert.strictEqual(jsonResult.result, Result.error);
    assert.strictEqual(jsonResult.errorMessage, "Invalid interface(s). TestInterface interface(s) are missing!!!!");
  });

  test('10 - Multiple Simple Interface With Child Ts', () => {
    let ts = `interface Sample2 {
      text1: TestInterface;
    }

    interface TestInterface {
      text: string;
    }`;

    let jsonResult = modeltoJSON(ts);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let json = JSON.parse(jsonResult.output);
    assert.strictEqual(1, Object.keys(json).length);
    assert.strictEqual(true, isObject(json["text1"]));
    assert.strictEqual(true, isString(json["text1"]["text"]));
  });

  test('11 - Multiple Interface Ts With Child Ts', () => {
    let ts = `interface Sample2 {
      text: TestInterface;
    }

    interface TestInterface {
      text1: string;
      text2 : number[];
      text3 : string[][] | number[][];
      text4 : string[] | number[];
      text5 : (string[] | boolean[])[];
      text6 : string | number;
      text7 : (string | number)[];
    }`;

    let jsonResult = modeltoJSON(ts);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let json = JSON.parse(jsonResult.output);
    assert.strictEqual(1, Object.keys(json).length);
    assert.strictEqual(true, isObject(json["text"]));
    assert.strictEqual(7, Object.keys(json["text"]).length);
    assert.strictEqual(true, isString(json["text"]["text1"]));
    assert.strictEqual(true, isArray(json["text"]["text2"]));
    assert.strictEqual(true, isNumber(json["text"]["text2"][0]));
    assert.strictEqual(true, isArray(json["text"]["text3"]));
    assert.strictEqual(true, isArray(json["text"]["text3"][0]));
    assert.strictEqual(true, testValueType("string | number".split("|").map(e => e.trim()), json["text"]["text3"][0][0]));
    assert.strictEqual(true, isArray(json["text"]["text4"]));
    assert.strictEqual(true, testValueType("string | number".split("|").map(e => e.trim()), json["text"]["text4"][0]));
    assert.strictEqual(true, isArray(json["text"]["text5"]));
    assert.strictEqual(true, isArray(json["text"]["text5"][0]));
    assert.strictEqual(true, isString(json["text"]["text5"][0][0]));
    assert.strictEqual(true, isArray(json["text"]["text5"][1]));
    assert.strictEqual(true, isBoolean(json["text"]["text5"][1][0]));
    assert.strictEqual(true, testValueType("string | number".split("|").map(e => e.trim()), json["text"]["text6"]));
    assert.strictEqual(true, isArray(json["text"]["text7"]));
    assert.strictEqual(true, isString(json["text"]["text7"][0]));
    assert.strictEqual(true, isNumber(json["text"]["text7"][1]));
  });

  test('12 - Multiple Interface Ts Without Child Ts', () => {
    let ts = `interface Sample2 {
      text: string;
    }

    interface TestInterface {
      text1: string;
      text2 : number[];
      text3 : string[][] | number[][];
      text4 : string[] | number[];
      text5 : (string[] | boolean[])[];
      text6 : string | number;
      text7 : (string | number)[];
    }`;

    let jsonResult = modeltoJSON(ts);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");
    assert.match(jsonResult.output,/\/\*\* Sample2 \*\*\//);
    assert.match(jsonResult.output,/\/\*\* TestInterface \*\*\//);
  });

  test('13 - Multipe Interface Ts', () => {
    let ts = `interface Sample2 {
      text: Sample1;
    }

    interface TestInterface {
      text1: Sample2;
      text2 : number[];
      text3 : string[][] | number[][];
      text4 : string[] | number[];
      text5 : (string[] | boolean[])[];
      text6 : string | number;
      text7 : (string | number)[];
    }
    
    interface Sample1 {
      id: number;
    }`;

    let jsonResult = modeltoJSON(ts);

    let json = JSON.parse(jsonResult.output);
    assert.strictEqual(7, Object.keys(json).length);
    assert.strictEqual(true, isObject(json["text1"]));
    assert.strictEqual(1, Object.keys(json["text1"]).length);
    assert.strictEqual(true, isObject(json["text1"]["text"]));
    assert.strictEqual(1,  Object.keys(json["text1"]["text"]).length);
    assert.strictEqual(true,  isNumber(json["text1"]["text"]["id"]));
    assert.strictEqual(true, isArray(json["text2"]));
    assert.strictEqual(true, isNumber(json["text2"][0]));
    assert.strictEqual(true, isArray(json["text3"]));
    assert.strictEqual(true, isArray(json["text3"][0]));
    assert.strictEqual(true, testValueType("string | number".split("|").map(e => e.trim()), json["text3"][0][0]));
    assert.strictEqual(true, isArray(json["text4"]));
    assert.strictEqual(true, testValueType("string | number".split("|").map(e => e.trim()), json["text4"][0]));
    assert.strictEqual(true, isArray(json["text5"]));
    assert.strictEqual(true, isArray(json["text5"][0]));
    assert.strictEqual(true, isString(json["text5"][0][0]));
    assert.strictEqual(true, isArray(json["text5"][1]));
    assert.strictEqual(true, isBoolean(json["text5"][1][0]));
    assert.strictEqual(true, testValueType("string | number".split("|").map(e => e.trim()), json["text6"]));
    assert.strictEqual(true, isArray(json["text7"]));
    assert.strictEqual(true, isString(json["text7"][0]));
    assert.strictEqual(true, isNumber(json["text7"][1]));
  });
  
});
