// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { FileAnalyzer, FrontmatterAnalyzer } from './analyzer';
import extractKeywords from './keywords';
import TreeProvider from './treeProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated


	vscode.commands.registerCommand('better-seo.refresh', () => {
		console.log('refershing....');
		if(!vscode.window.activeTextEditor?.document.fileName.endsWith("md")) {
			vscode.window.showErrorMessage("Better SEO: Current file is not a Markdown file");
			return;
		}

		const currentFile = vscode.window.activeTextEditor?.document.getText();
		if(!currentFile) {
			return;
		}
		const frontmatterAnalyzer = new FrontmatterAnalyzer(currentFile.toString());
		const fileAnalyzer = new FileAnalyzer(currentFile.toString());
		const keywordsFromFile = extractKeywords(currentFile);

		if(keywordsFromFile.length === 0) {
			vscode.window.showErrorMessage("Better SEO: No keywords found");
			return;
		}

		const frontmatterResults = keywordsFromFile.flatMap(keyword => {
			return frontmatterAnalyzer.analyze(keyword);
		});

		const contentResults = keywordsFromFile.flatMap(keyword => {
			return fileAnalyzer.analyze(keyword);
		});

		const frontmatterTreeProvider = new TreeProvider(frontmatterResults);
		const contentTreeProvider = new TreeProvider(contentResults);
		vscode.window.registerTreeDataProvider('frontmatter', frontmatterTreeProvider);
		vscode.window.registerTreeDataProvider('text', contentTreeProvider);
		frontmatterTreeProvider.refresh();
		contentTreeProvider.refresh();
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('better-seo.analyze', async () => {
		if(!vscode.window.activeTextEditor?.document.fileName.endsWith("md")) {
			vscode.window.showErrorMessage("Better SEO: Current file is not a Markdown file");
			return;
		}

		const currentFile = vscode.window.activeTextEditor?.document.getText();
		if(!currentFile) {
			return;
		}

		const frontmatterAnalyzer = new FrontmatterAnalyzer(currentFile.toString());
		const fileAnalyzer = new FileAnalyzer(currentFile.toString());
		const keywordsFromFile = extractKeywords(currentFile);

		if(keywordsFromFile.length === 0) {
			const keyword = await askForKeyword();
			if(!keyword) {
				return;
			}
			keywordsFromFile.push(keyword);
		}

		const frontmatterResults = keywordsFromFile.flatMap(keyword => {
			return frontmatterAnalyzer.analyze(keyword);
		});

		const contentResults = keywordsFromFile.flatMap(keyword => {
			return fileAnalyzer.analyze(keyword);
		});

		const frontmatterTreeProvider = new TreeProvider(frontmatterResults);
		const contentTreeProvider = new TreeProvider(contentResults);
		vscode.window.registerTreeDataProvider('frontmatter', frontmatterTreeProvider);
		vscode.window.registerTreeDataProvider('text', contentTreeProvider);
		frontmatterTreeProvider.refresh();
		contentTreeProvider.refresh();
	});

	context.subscriptions.push(disposable);
}

async function askForKeyword() : Promise<string | undefined> {
	return vscode.window.showInputBox({
		placeHolder: "Enter keyword",
		validateInput: text => {
			return text.length > 0 ? null : "Please enter a keyword";
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
