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

		context.subscriptions.push(cmdRunMatlab);
	}
}

export function deactivate() {}
