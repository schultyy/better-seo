import { Event, EventEmitter, ProviderResult, TreeDataProvider, TreeItem, TreeItemCollapsibleState, window, workspace } from "vscode";
import { AnalyzerResult, FileAnalyzer, FrontmatterAnalyzer, ResultType, runAnalysis } from "./analyzer";
import * as path from 'path';

export default class TreeProvider implements TreeDataProvider<ResultsTreeItem> {
    private _onDidChangeTreeData: EventEmitter<ResultsTreeItem | undefined | null | void> = new EventEmitter<ResultsTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: Event<ResultsTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    public results: AnalyzerResult[];

    constructor() {
        this.results = [];
    }

    public refresh(){
        this.analyze();
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Finding): TreeItem {
        return element;
    }
    getChildren(element?: Finding): ProviderResult<ResultsTreeItem[]> {
        if(!element) {
            const frontmatter = new HeaderItem('Frontmatter', this, TreeItemCollapsibleState.Expanded);
            const body = new HeaderItem('Body', this, TreeItemCollapsibleState.Expanded);
            return Promise.resolve([frontmatter, body]);
        }
        else if(element.label === 'Frontmatter') {
            return Promise.resolve(this.results.filter(r => r.resultType === ResultType.frontmatter).map(result => {
                return new Finding(result.title, result.message, this, TreeItemCollapsibleState.None);
            }));
        }
        else if(element.label === 'Body') {
            return Promise.resolve(this.results.filter(r => r.resultType === ResultType.body).map(result => {
                return new Finding(result.title, result.message, this, TreeItemCollapsibleState.None);
            }));
        }
        else {
            return Promise.resolve([]);
        }
    }


    private static get titleAttribute() : string {
        const configuration = workspace.getConfiguration('betterseo');
        const title :string = <string> configuration.get('frontmatter.titleAttribute')!;
        return title;
    }

    private static get descriptionAttribute() : string {
        const configuration = workspace.getConfiguration('betterseo');
        const description :string = <string> configuration.get('frontmatter.descriptionAttribute')!;
        return description;
    }

    private analyze() {
        if(!window.activeTextEditor?.document.fileName.endsWith("md")) {
            window.showErrorMessage("Better SEO: Current file is not a Markdown file");
            return;
        }

        const currentFile = window.activeTextEditor?.document.getText();
        if(!currentFile) {
            return;
        }

        const markdownFile = currentFile.toString();
        const frontmatterConfig = {
            titleField: TreeProvider.titleAttribute,
            descriptionField: TreeProvider.descriptionAttribute
        };

        this.results = runAnalysis(markdownFile, frontmatterConfig);
    }
}

export abstract class ResultsTreeItem extends TreeItem {
    constructor(
        public readonly label: string,
        public provider: TreeProvider,
        public readonly collapsibleState: TreeItemCollapsibleState
        ) {
            super(label, collapsibleState);
        }
}

export class HeaderItem extends ResultsTreeItem {
        iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'betterseo-view-icon-light.svg'),
            dark: path.join(__filename, '..', '..', 'resources',  'betterseo-view-icon-light.svg')
        };
}

export class Finding extends ResultsTreeItem {
    constructor(
        public readonly label: string,
        public readonly description: string,
        public provider: TreeProvider,
        public readonly collapsibleState: TreeItemCollapsibleState
        ) {
            super(label, provider, collapsibleState);
            this.description = description;
        }
        iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'error icon.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'error icon.svg')
        };

    }