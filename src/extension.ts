// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import FrontmatterAnalyzer from './frontmatter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('better-seo.analyze', async () => {
		const currentFile = vscode.window.activeTextEditor?.document.getText();
		if(!currentFile) {
			return;
		}
		let analyzer = new FrontmatterAnalyzer(currentFile.toString());

		let keyword = await vscode.window.showInputBox({
			placeHolder: "Enter keyword",
			validateInput: text => {
				return text.length > 0 ? null : "Please enter a keyword";
			}
		});

		if(!keyword) {
			return;
		}
		console.log(analyzer.analyze(keyword));
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
