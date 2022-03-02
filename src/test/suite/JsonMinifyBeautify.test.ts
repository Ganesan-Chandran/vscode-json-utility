import * as assert from 'assert';
import { fixJson, minifyJSON, prettifyJSON } from '../../components/JSONHelper';
import { Result } from '../../components/util';

suite('Json Minify Test Suite', () => {
  test('1 - Minify - Simple JSON', () => {
    let json = `{\n  \"text\": \"2070106566\",\n  \"text2\": 3,\n  \"text3\": true,\n  \"text4\": {}\n}`;

    let expectedJson = `{\"text\":\"2070106566\",\"text2\":3,\"text3\":true,\"text4\":{}}`;

    let jsonResult = minifyJSON(json);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let jsonParsed = JSON.parse(jsonResult.output);
    assert.strictEqual(4, Object.keys(jsonParsed).length);
    assert.strictEqual(jsonResult.output, expectedJson);
  });

  test('2 - Minify - Nested JSON', () => {
    let json = `{\n  \"text\": \"2070106566\",\n  \"text2\": 3,\n  \"text3\": true,\n  \"text4\": {\n    \"text10\": \"Test\",\n    \"text11\": 10,\n    \"text12\": true\n  }\n}`;

    let expectedJson = `{\"text\":\"2070106566\",\"text2\":3,\"text3\":true,\"text4\":{\"text10\":\"Test\",\"text11\":10,\"text12\":true}}`;

    let jsonResult = minifyJSON(json);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let jsonParsed = JSON.parse(jsonResult.output);
    assert.strictEqual(4, Object.keys(jsonParsed).length);
    assert.strictEqual(jsonResult.output, expectedJson);
  });

  test('3 - Minify - Invalid JSON', () => {
    let json = `{\n  \"text\": \"2070106566\",\n  \"text2\": 3,\n  \"text3\": true,\n  \"text4\": {\n    \"text10\": \"Test\",\n    \"text11\": 10,\n    \"text12\": true\n  }\n`;

    let jsonResult = minifyJSON(json);

    assert.strictEqual(jsonResult.result, Result.error);
    assert.strictEqual(jsonResult.errorMessage, "Invalid JSON.");
  });
});

suite('Json Beautify Test Suite', () => {

  test('1 - Beautify - Simple JSON', () => {
    let json = `{\"text\":\"2070106566\",\"text2\":3,\"text3\":true,\"text4\":{}}`;

    let expectedJson = `{\n  \"text\": \"2070106566\",\n  \"text2\": 3,\n  \"text3\": true,\n  \"text4\": {}\n}`;

    let jsonResult = prettifyJSON(json);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let jsonParsed = JSON.parse(jsonResult.output);
    assert.strictEqual(4, Object.keys(jsonParsed).length);
    assert.strictEqual(jsonResult.output, expectedJson);
  });

  test('2 - Beautify - Nested JSON', () => {
    let json = `{\"text\":\"2070106566\",\"text2\":3,\"text3\":true,\"text4\":{\"text10\":\"Test\",\"text11\":10,\"text12\":true}}`;

    let expectedJson = `{\n  \"text\": \"2070106566\",\n  \"text2\": 3,\n  \"text3\": true,\n  \"text4\": {\n    \"text10\": \"Test\",\n    \"text11\": 10,\n    \"text12\": true\n  }\n}`;

    let jsonResult = prettifyJSON(json);

    assert.strictEqual(jsonResult.result, Result.ok);
    assert.strictEqual(jsonResult.errorMessage, "");

    let jsonParsed = JSON.parse(jsonResult.output);
    assert.strictEqual(4, Object.keys(jsonParsed).length);
    assert.strictEqual(jsonResult.output, expectedJson);
  });

  test('3 - Beautify - Invalid JSON', () => {
    let json = `{\"text\":\"2070106566\",\"text2\":3,\"text3\":true,\"text4\":{\"text10\":\"Test\",\"text11\":10,\"text12\":true}`;

    let jsonResult = prettifyJSON(json);

    assert.strictEqual(jsonResult.result, Result.error);
    assert.strictEqual(jsonResult.errorMessage, "Invalid JSON.");
  });

});
