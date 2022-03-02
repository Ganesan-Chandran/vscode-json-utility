import * as assert from 'assert';
import { fixJson } from '../../components/JSONHelper';
import { Result } from '../../components/util';

suite('JSONFix Test Suite', () => {
  test('1 - Simple JSON', () => {
    let json = `{
      text: "2070106566",
      text2: 3,
      text3: true,
      text4: {},
    }`;

    let expectedJson = `{\n  \"text\": \"2070106566\",\n  \"text2\": 3,\n  \"text3\": true,\n  \"text4\": {}\n}`;

    let jsonResult = fixJson(json);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let jsonParsed = JSON.parse(jsonResult.output);
    assert.strictEqual(4, Object.keys(jsonParsed).length);
    assert.strictEqual(jsonResult.output, expectedJson);
  });

  test('2 - Nested JSON', () => {
    let json = `{
      text: "2070106566",
      text2: 3,
      text3: true,
      text4: {
        text10: "Test",
        text11: 10,
        text12: true,
      },
    }`;

    let expectedJson = `{\n  \"text\": \"2070106566\",\n  \"text2\": 3,\n  \"text3\": true,\n  \"text4\": {\n    \"text10\": \"Test\",\n    \"text11\": 10,\n    \"text12\": true\n  }\n}`;
    let jsonResult = fixJson(json);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let jsonParsed = JSON.parse(jsonResult.output);
    assert.strictEqual(4, Object.keys(jsonParsed).length);
    assert.strictEqual(jsonResult.output, expectedJson);
  });

  test('3 - Array JSON', () => {
    let json = `[{
      text: "2070106566",
      text2: 3,
      text3: true,
      text4: {},
    }]`;

    let expectedJson = `[\n  {\n    \"text\": \"2070106566\",\n    \"text2\": 3,\n    \"text3\": true,\n    \"text4\": {}\n  }\n]`;
    let jsonResult = fixJson(json);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let jsonParsed = JSON.parse(jsonResult.output);
    assert.strictEqual(1, Object.keys(jsonParsed).length);
    assert.strictEqual(jsonResult.output, expectedJson);
  });

  test('4 - Nested Array JSON', () => {
    let json = `{
      text: "2070106566",
      text2: 3,
      text3: true,
      text4: [{
        text10: "Test",
        text11: 10,
        text12: true,
      }],
    }`;

    let expectedJson = `{\n  \"text\": \"2070106566\",\n  \"text2\": 3,\n  \"text3\": true,\n  \"text4\": [\n    {\n      \"text10\": \"Test\",\n      \"text11\": 10,\n      \"text12\": true\n    }\n  ]\n}`;
    let jsonResult = fixJson(json);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let jsonParsed = JSON.parse(jsonResult.output);
    assert.strictEqual(4, Object.keys(jsonParsed).length);
    assert.strictEqual(jsonResult.output, expectedJson);
  });

  test('5 - Invalid JSON', () => {
    let json = `{
      text: "2070106566",
      text2: 3,
      text3: true,
      text4: ,
    }`;

    let jsonResult = fixJson(json);

    assert.strictEqual(jsonResult.result, Result.error);
    assert.strictEqual(jsonResult.errorMessage, `Error in line (5, 14).\nExpected \"[\", \"false\", \"null\", \"true\", \"{\", [^,}\\]], double-quote string, number or single-quote string but \",\" found..`);
  });

});
