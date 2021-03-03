import { Event, EventEmitter, ProviderResult, TreeDataProvider, TreeItem, TreeItemCollapsibleState, window, workspace } from "vscode";
import { AnalyzerResult, FileAnalyzer, FrontmatterAnalyzer, ResultType } from "./analyzer";
import extractKeywords from "./keywords";
import * as path from 'path';

export default class TreeProvider implements TreeDataProvider<Finding> {
    private _onDidChangeTreeData: EventEmitter<Finding | undefined | null | void> = new EventEmitter<Finding | undefined | null | void>();
    readonly onDidChangeTreeData: Event<Finding | undefined | null | void> = this._onDidChangeTreeData.event;

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
    getChildren(element?: Finding): ProviderResult<Finding[]> {
        if(!element) {
            const frontmatter = new Finding('Frontmatter', "Frontmatter", this, TreeItemCollapsibleState.Expanded);
            const body = new Finding('Body', "Body", this, TreeItemCollapsibleState.Expanded);
            let frontmatterNodes: Finding[] = this.results.filter(r => r.resultType === ResultType.frontmatter).map(result => {
                return new Finding(result.title, result.message, this, TreeItemCollapsibleState.None);
            });
            let bodyNodes: Finding[] = this.results.filter(r => r.resultType === ResultType.body).map(result => {
                return new Finding(result.title, result.message, this, TreeItemCollapsibleState.None);
            });

            return Promise.resolve([frontmatter].concat(frontmatterNodes).concat([body]).concat(bodyNodes));
        }
        return Promise.resolve([]);
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
        const frontmatterAnalyzer = new FrontmatterAnalyzer(currentFile.toString(), {
            titleField: TreeProvider.titleAttribute,
            descriptionField: TreeProvider.descriptionAttribute
        });

        const fileAnalyzer = new FileAnalyzer(currentFile.toString());
        const keywordsFromFile = extractKeywords(currentFile);

        if(keywordsFromFile.length === 0) {
            window.showErrorMessage("Better SEO: No keywords found");
            this.results = [];
            return;
        }

        const frontmatterResults = frontmatterAnalyzer.analyze(keywordsFromFile);
        const contentResults = fileAnalyzer.analyze(keywordsFromFile);

        this.results = frontmatterResults.concat(contentResults);
    }
}

export class Finding extends TreeItem {
    constructor(
        public readonly label: string,
        public readonly description: string,
        public provider: TreeProvider,
        public readonly collapsibleState: TreeItemCollapsibleState
        ) {
            super(label, collapsibleState);
            this.description = description;
        }
        iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'error icon.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'error icon.svg')
        };

    }