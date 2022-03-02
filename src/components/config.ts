import * as vscode from 'vscode';

export function getJSONTabConfiguration(): number {
  const editorConfig = vscode.workspace.getConfiguration('editor');
  const tabSize = editorConfig.get('tabSize', 4);

  return tabSize;
}

export function getJSONUtilityConfiguration(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration('json-utility');
} 
