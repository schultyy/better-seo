// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import TreeProvider from './treeProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	const seoResultTreeProvider = new TreeProvider();
	vscode.window.registerTreeDataProvider('seo-results', seoResultTreeProvider);

	let disposable = vscode.commands.registerCommand('better-seo.refresh', () => {
		seoResultTreeProvider.refresh();
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
