import * as vscode from 'vscode';
import MatlabTerminal from './MatlabTerminal';

function createMatlabTerminal(workspaceDirectoryPath: string): MatlabTerminal {
	vscode.window.showInformationMessage("Working Directory set to: " + workspaceDirectoryPath);
	return new MatlabTerminal(workspaceDirectoryPath);
}

export function activate(context: vscode.ExtensionContext) {
	const workspaceFoldersPaths = vscode.workspace.workspaceFolders;
	if (workspaceFoldersPaths && workspaceFoldersPaths.length > 0) {
		const rootWorkspaceFolderPath = workspaceFoldersPaths[0];
		let matlabTerminal = createMatlabTerminal(rootWorkspaceFolderPath.uri.fsPath);

		let getTerminal = () => {
			if (!matlabTerminal) {
				matlabTerminal = createMatlabTerminal(rootWorkspaceFolderPath.uri.fsPath);
			}
			return matlabTerminal;
		};

		let cmdRunMatlab = vscode.commands.registerCommand('matlab-code-runner.runMatlabFile', () => {
			if (vscode.window.activeTextEditor) {
				const fileToRunPath = vscode.window.activeTextEditor.document;
				getTerminal().runFile(fileToRunPath.uri.fsPath);
			}
		});

		let cmdRunSelection = vscode.commands.registerCommand('matlab-code-runner.runMatlabSelection', () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				let code = '';
				let lastLine = editor.selection.start.line;
				for (const selection of editor.selections) {
					if (selection.start.line != lastLine) {
						code += '\r\n';
					}
					code += editor.document.getText(selection);
					lastLine = selection.end.line;
				}
				getTerminal().runCode(code);
			}
		});

		context.subscriptions.push(cmdRunMatlab, cmdRunSelection);
	}
}

export function deactivate() {}
