import { Event, EventEmitter, ProviderResult, TreeDataProvider, TreeItem } from "vscode";
import { AnalyzerResult } from "./analyzer";

export default class TreeProvider implements TreeDataProvider<Finding> {
    private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();
    readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;

    constructor(public results: AnalyzerResult[]) {}

    public refresh(){
        this._onDidChangeTreeData.fire(this.results);
    }

    getTreeItem(element: Finding): TreeItem {
        return element;
    }
    getChildren(element?: Finding): ProviderResult<Finding[]> {
        let nodes: Finding[] = this.results.map(result => {
            return new Finding(result.title, result.message, this);
        });
        return Promise.resolve(nodes);
    }
}

export class Finding extends TreeItem {
    constructor(
        public readonly label: string,
        public readonly description: string,
        public provider: TreeProvider

	) {
		super(label);
        this.description = description;
    }


}