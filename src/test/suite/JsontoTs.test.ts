import * as assert from 'assert';
import { convertJsonToTs } from '../../components/JSONtoTS';
import { Result } from '../../components/util';


suite('JSONtoTS Test Suite', () => {
  test('1 - Simple JSON', () => {
    let json = `{
      "text": "2070106566",
      "text2": 3,
      "text3": true,
      "text4": {},
    }`;

    let expectedTs = `export interface IRootInterface {\n\ttext: string;\n\ttext2: number;\n\ttext3: boolean;\n\ttext4: any;\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('2 - Invalid JSON', () => {
    let json = `{
      "text": "2070106566"`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.error);
    assert.strictEqual(tsResult.errorMessage, "Invalid JSON");
  });

  test('3 - Array JSON', () => {
    let json = `[{
      "text": "2070106566",
      "text2": 3,
      "text3": true,
      "text4": {},
    }]`;

    let expectedTs = `export interface IRootInterface {\n\ttext: string;\n\ttext2: number;\n\ttext3: boolean;\n\ttext4: any;\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('4 - JSON With Array Value', () => {
    let json = `{
      "text": ["2070106566"],
      "text2": 3,
      "text3": true,
      "text4": {},
    }`;

    let expectedTs = `export interface IRootInterface {\n\ttext: string[];\n\ttext2: number;\n\ttext3: boolean;\n\ttext4: any;\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('5 - JSON With Empty Prop Object', () => {
    let json = `{
      "text": {},
    }`;

    let expectedTs = `export interface IRootInterface {\n\ttext: any;\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('6 - JSON With Empty Object', () => {
    let json = `{}`;

    let expectedTs = `export interface IRootInterface {}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('7 - JSON With Empty Array Prop Object', () => {
    let json = `{
        "text": [],
      }`;

    let expectedTs = `export interface IRootInterface {\n\ttext: any[];\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('8 - JSON With Multi Array Value', () => {
    let json = `{
      "text": [["Test", "Test"]],
      "text2": [[3]],
      "text3": [[true]]
    }`;

    let expectedTs = `export interface IRootInterface {\n\ttext: string[][];\n\ttext2: number[][];\n\ttext3: boolean[][];\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('9 - JSON With Multi Array Value - 2', () => {
    let json = `{
      "text": [[["Test", "Test"]]],
      "text2": [[[3]]],
      "text3": [[[true]]]
    }`;

    let expectedTs = `export interface IRootInterface {\n\ttext: string[][][];\n\ttext2: number[][][];\n\ttext3: boolean[][][];\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('10 - JSON With Object', () => {
    let json = `{
      "text": {"name": "Test", "age": 30}
    }`;

    let expectedTs = `export interface Text {\n\tname: string;\n\tage: number;\n}` + `\n\n` + `export interface IRootInterface {\n\ttext: Text;\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('11 - JSON With Array Object', () => {
    let json = `{
      "text": [{"name": "Test", "age": 30}]
    }`;

    let expectedTs = `export interface Text {\n\tname: string;\n\tage: number;\n}` + `\n\n` + `export interface IRootInterface {\n\ttext: Text[];\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('12 - JSON With Array Object With Optional Prop', () => {
    let json = `{
      "text": [{"name": "Test", "age": 30}, {"name": "Test", "age": null} ]
    }`;

    let expectedTs = `export interface Text {\n\tname: string;\n\tage?: (number | any);\n}` + `\n\n` + `export interface IRootInterface {\n\ttext: Text[];\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('13 - JSON With Nested Object', () => {
    let json = `{
      "text": {"name": "Test", "age": 30,  "sub": {"name": "Test", "id": 1}}
    }`;

    let expectedTs = `export interface Sub {\n\tname: string;\n\tid: number;\n}` + `\n\n` + `export interface Text {\n\tname: string;\n\tage: number;\n\tsub: Sub;\n}` + `\n\n` + `export interface IRootInterface {\n\ttext: Text;\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });


  test('14 - JSON With Nested Array Object', () => {
    let json = `{
      "text": {"name": "Test", "age": 30,  "sub": [{"name": "Test", "id": 1}]}
    }`;

    let expectedTs = `export interface Sub {\n\tname: string;\n\tid: number;\n}` + `\n\n` + `export interface Text {\n\tname: string;\n\tage: number;\n\tsub: Sub[];\n}` + `\n\n` + `export interface IRootInterface {\n\ttext: Text;\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('15 - JSON With Null Prop', () => {
    let json = `{
      "text": null
    }`;

    let expectedTs = `export interface IRootInterface {\n\ttext?: any;\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('16 - JSON With Array Multiple Object', () => {
    let json = `[
      {
        "userId": 1,
        "id": 1,
        "title": "CEO", 
        "dept": "IT"
      },
      {
        "userId": 1,
        "id": 2,
        "title": "CFO",
        "dept": "IT"
      }
    ]`;

    let expectedTs = `export interface IRootInterface {\n\tuserId: number;\n\tid: number;\n\ttitle: string;\n\tdept: string;\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('17 - JSON With Array With Different Type', () => {
    let json = `{
      arr0: [["24", "42"], null],
      arr1: ["24", "42", 24, 42],
      arr2: [24, 42, true, false],
      arr3: [["24", "42"], [24, 42]],
      arr4: [24, 42],
      arr5: [true, false]
    }`;

    let expectedTs = `export interface IRootInterface {\n\tarr0?: string[][];\n\tarr1: (string | number)[];\n\tarr2: (number | boolean)[];\n\tarr3: (string[] | number[])[];\n\tarr4: number[];\n\tarr5: boolean[];\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });


  test('18 - JSON With Multi Array Object', () => {
    let json = `{
      arr0: [{ name: "Kittin" }],
      arr1: [{ name: "Kittin" }, { name: "Test" }, { name: "Test", id: 10 }],
      arr2: [{ field: ["test"], id: 2 }, { field: ["string"] }, { field: [42] }, { field: null }, { field: [new Date()] }, { test: 10 }],
      arr3: {}
    }`;

    let expectedTs = `export interface Arr0 {\n\tname: string;\n}` + `\n\n` + `export interface Arr1 {\n\tname: string;\n\tid?: number;\n}` + `\n\n` + `export interface Arr2 {\n\tfield?: (string[] | number[] | any);\n\tid?: number;\n\ttest?: number;\n}` + `\n\n` + `export interface IRootInterface {\n\tarr0: Arr0[];\n\tarr1: Arr1[];\n\tarr2: Arr2[];\n\tarr3: any;\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('19 - JSON With All Array Value', () => {
    let json = `{
      "text": ["2070106566"],
      "text2": [3],
      "text3": [true],
      "text4": [{}],
    }`;

    let expectedTs = `export interface IRootInterface {\n\ttext: string[];\n\ttext2: number[];\n\ttext3: boolean[];\n\ttext4: any[];\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });

  test('20 - JSON With Empty Array Value', () => {
    let json = `{      
      "text": [{}],
    }`;

    let expectedTs = `export interface IRootInterface {\n\ttext: any[];\n}`;

    let tsResult = convertJsonToTs(json);

    assert.strictEqual(tsResult.result, Result.ok);
    assert.strictEqual(tsResult.errorMessage, "");
    assert.strictEqual(tsResult.output, expectedTs);
  });
});
