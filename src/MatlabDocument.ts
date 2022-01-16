import * as vscode from "vscode";

export type LineRange = {
    start: number,
    end: number,
}

function scanSections(doc: vscode.TextDocument): vscode.Range[] {
    let ranges: vscode.Range[] = [];
    let currentSectionStart = new vscode.Position(0, 0);

    function endSection(end: vscode.Position) {
        ranges.push(new vscode.Range(
            currentSectionStart,
            end
        ));
        currentSectionStart = new vscode.Position(end.line + 1, 0);
    }

    let prevLineEnd: vscode.Position | null = null;
    for (let lineNo = 0; lineNo < doc.lineCount; lineNo++) {
        const line = doc.lineAt(lineNo);
        if (line.text.startsWith('%%') && prevLineEnd) {
            endSection(prevLineEnd);
        }
        prevLineEnd = line.range.end;
    }

    if (prevLineEnd) {
        endSection(prevLineEnd);
    }

    return ranges;
}

export default class MatlabDocument {
    public readonly sections: vscode.Range[];

    constructor(doc: vscode.TextDocument) {
        this.sections = scanSections(doc);
    }
}
