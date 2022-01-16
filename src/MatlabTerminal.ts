import * as vscode from 'vscode';

class TerminalWrapper {

    private name: string;
    private startupFolder?: string;

    private terminal: vscode.Terminal | null;

    readonly matlabCommand: string = "matlab";
    private noSplashArg: string = "-nosplash";
    private noDesktopArg: string = "-nodesktop";

    constructor(name: string, startupFolder?: string) {
        this.name = name;
        this.startupFolder = startupFolder;
        this.terminal = this.createTerminal();
    }

    public get() {
        if (!this.terminal || this.terminal.exitStatus) {
            this.terminal = this.createTerminal();
        }
        return this.terminal;
    }

    private createTerminal() {
        let cmd = `${this.matlabCommand} ${this.noSplashArg} ${this.noDesktopArg} `;

        if (this.startupFolder) {
            cmd += `-sd ${this.startupFolder}`;
        }

        const term = vscode.window.createTerminal(this.name);
        term.sendText(cmd);
        return term;
    }
}

export default class MatlabTerminal {
    private terminal: TerminalWrapper;
    private workspaceDirectoryPath: string;

    constructor(workspaceDirectoryPath: string) {
        this.terminal = new TerminalWrapper("Matlab", workspaceDirectoryPath);
        this.workspaceDirectoryPath = workspaceDirectoryPath;
    }

    private runRawCode(code: string) {
        const term = this.terminal.get();
        term.sendText(code, true);
        term.show();
    }

    public runCode(code: string) {
        this.runRawCode(code);
    }

    public runFile(absFilePath: string) {
        if (!absFilePath.includes(this.workspaceDirectoryPath)) {
            vscode.window.showInformationMessage("File not found in workspace!");
            return;
        }
        if (!absFilePath.endsWith(".m")) {
            vscode.window.showInformationMessage("Trying to run a non-Matlab file!");
            return;
        }
        const relativeFilePath = "." + absFilePath.replace(this.workspaceDirectoryPath, "");
        this.runRawCode(`run('${relativeFilePath}')`);
    }
}
