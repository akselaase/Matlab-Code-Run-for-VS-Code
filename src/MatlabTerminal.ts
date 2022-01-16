import * as vscode from 'vscode';

export default class MatlabTerminal {

    public terminal: vscode.Terminal;
    private hasInitializedTerminal: boolean = false;

    readonly matlabCommand: string = "matlab";
    private noSplashArg: string = "-nosplash";
    private noDesktopArg: string = "-nodesktop";
    private workspaceDirectoryPath: string;

    constructor(workspaceDirectoryPath: string) {
        this.terminal = vscode.window.createTerminal("Matlab");
        this.workspaceDirectoryPath = workspaceDirectoryPath;
    }

    private initTerminal() {
        if (!this.hasInitializedTerminal) {
            this.terminal.sendText(`${this.matlabCommand} ${this.noSplashArg} ${this.noDesktopArg} -sd ${this.workspaceDirectoryPath}`);
            this.hasInitializedTerminal = true;
        }
    }

    private runRawCode(code: string) {
        this.initTerminal();
        this.terminal.sendText(code, true);
        this.terminal.show(true);
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

    public getCurrentWorkspaceDirectory = () => this.workspaceDirectoryPath;
    public changeWorkspaceDirectory(dir: string) {
        this.terminal.sendText(`cd ${dir}`);
        this.workspaceDirectoryPath = dir;
    }
}
