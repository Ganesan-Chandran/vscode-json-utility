import * as vscode from 'vscode';
import * as os from "os";
import * as fs from "fs";
import { modeltoJSON } from './components/TStoJSON';
import * as path from "path";
import { ResultType, FormatMode, Result } from './components/util';
import { fixJson, minifyJSON, prettifyJSON } from './components/JSONHelper';
import { getJSONUtilityConfiguration } from './components/config';
import { convertJsonToTs } from './components/JSONtoTS';

export function activate(context: vscode.ExtensionContext) {
  const commands = [
    vscode.commands.registerCommand(`json-utility.toJson`, () => convertToJSON()),
    vscode.commands.registerCommand(`json-utility.toTS`, () => convertJSONToTS()),
    vscode.commands.registerCommand(`json-utility.prettifyJson`, () => formatJSON(FormatMode.prettify)),
    vscode.commands.registerCommand(`json-utility.minifyJson`, () => formatJSON(FormatMode.minify)),
    vscode.commands.registerCommand(`json-utility.fixJson`, () => jsonFix()),
  ];

  context.subscriptions.push(...commands);

}

function convertToJSON() {
  let text = getSelectedText();

  if (text === "") {
    vscode.window.showErrorMessage("Text shouldn't be empty");
    return;
  }

  let result = modeltoJSON(text);

  if (result.result === Result.error) {
    vscode.window.showErrorMessage(result.errorMessage);
    return;
  }

  if (getOutputConfiguration()) {
    openNewWindow(result.output, "jsonUtility.json");
  } else {
    displayResultInCurrentWindow(result.output);
  }
}

function convertJSONToTS() {
  let text = getSelectedText();

  if (text === "") {
    vscode.window.showErrorMessage("Text shouldn't be empty");
    return;
  }

  let result = convertJsonToTs(text);

  if (result.result === Result.error) {
    vscode.window.showErrorMessage(result.errorMessage);
    return;
  }

  if (getOutputConfiguration()) {
    openNewWindow(result.output, "jsonUtility.ts");
  } else {
    displayResultInCurrentWindow(result.output);
  }
}

function formatJSON(formatMode: FormatMode) {
  let text = getSelectedText();
  let result: ResultType;

  if (text === "") {
    vscode.window.showErrorMessage("Text shouldn't be empty");
    return;
  }

  if (formatMode === FormatMode.prettify) {
    result = prettifyJSON(text);
  } else {
    result = minifyJSON(text);
  }

  if (result.result === Result.error) {
    vscode.window.showErrorMessage(result.errorMessage);
    return;
  }

  if (getOutputConfiguration()) {
    openNewWindow(result.output, "format.json");
  } else {
    displayResultInCurrentWindow(result.output);
  }
}

function jsonFix() {
  let text = getSelectedText();

  if (text === "") {
    vscode.window.showErrorMessage("Text shouldn't be empty");
    return;
  }

  let result = fixJson(text);

  if (result.result === Result.error) {
    vscode.window.showErrorMessage(result.errorMessage);
    return;
  }

  if (getOutputConfiguration()) {
    openNewWindow(result.output, "jsonFix.json");
  } else {
    displayResultInCurrentWindow(result.output);
  }
}

function getOutputConfiguration(): boolean {
  let config = getJSONUtilityConfiguration();
  const isNewWindow = config.get('output', true);
  return isNewWindow;
}

function getTempUri(fileName: string) {
  let tempFilePath = path.join(os.tmpdir(), fileName);
  let tempFileUri: vscode.Uri = vscode.Uri.file(tempFilePath);

  return { tempFilePath, tempFileUri };
}

function openNewWindow(result: string, fileName: string) {
  let { tempFilePath, tempFileUri } = getTempUri(fileName);
  fs.writeFileSync(tempFilePath, result);
  vscode.commands.executeCommand("vscode.open", tempFileUri, getViewColumn());
}

function displayResultInCurrentWindow(result: string) {
  let editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  let range: vscode.Range;

  if (editor.selection.end.isAfter(editor.selection.start)) {
    range = new vscode.Range(editor.selection.start, editor.selection.end);
  }
  else {
    let lastLine = editor.document.lineAt(editor.document.lineCount - 1);
    range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(
      lastLine.lineNumber,
      lastLine.text.length
    ));
  }

  editor.edit((editBuilder) => {
    editBuilder.replace(range, result);
  });
}

function getViewColumn(): vscode.ViewColumn {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return vscode.ViewColumn.One;
  }

  switch (activeEditor.viewColumn) {
    case vscode.ViewColumn.One:
      return vscode.ViewColumn.Two;
    case vscode.ViewColumn.Two:
      return vscode.ViewColumn.Three;
  }

  return activeEditor.viewColumn as any;
}

function getSelectedText(): string {
  var editor = vscode.window.activeTextEditor;
  if (!editor) {
    return "";
  }

  let selection = (() => {
    if (editor.selection.end.isAfter(editor.selection.start)) {
      return editor.selection;
    }
    else {
      let lastLine = editor.document.lineAt(editor.document.lineCount - 1);
      return new vscode.Selection(
        new vscode.Position(0, 0),
        new vscode.Position(
          lastLine.lineNumber,
          lastLine.text.length
        )
      );
    }
  })();

  return editor.document.getText(selection).trim();
}

export function deactivate() { }
