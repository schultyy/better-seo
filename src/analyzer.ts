import matter = require('gray-matter');
import markdownToAst = require("@textlint/markdown-to-ast");
import { workspace } from 'vscode';

export enum ResultType {
    frontmatter,
    body
}

export abstract class AnalyzerResult {
    constructor(public title: string, public message: string, public resultType: ResultType) {}
}

export class AnalyzerError extends AnalyzerResult {
    constructor(public title: string, public message: string, public resultType: ResultType) {
        super(title, message, resultType);
    }
}

interface AstChild {
    type: string;
    value: string;
    raw: string;
    depth?: number;
    children?: Array<AstChild>;
}

export class FileAnalyzer {
    private readonly children: Array<AstChild>;
    constructor(public markdownFile: string){
        const AST = markdownToAst.parse(this.markdownFile);
        this.children = AST.children;
    }

    public analyze(keywords: string[]) : Array<AnalyzerResult> {
        let results: Array<AnalyzerResult> = [];

        results = results.concat(this.validateHeaderStructure());
        results = results.concat(keywords.flatMap(keyword => this.validateHeader(keyword)));
        results = results.concat(keywords.flatMap(keyword => this.validateFirstParagraph(keyword)));
        return results;
    }

    private validateHeaderStructure() : Array<AnalyzerResult> {
        if(this.children.filter(child => child.type === 'Header' && child.depth === 1).length > 1) {
            return [
                new AnalyzerError('Header', 'Inconsistent Header Structure. Only one first level Header allowed.', ResultType.body)
            ];
        }
        return [];
    }

    private validateFirstParagraph(keyword: string) : Array<AnalyzerResult> {
        const analyzerResults = [];
        let firstParagraph = this.children.find(child => child.type === 'Paragraph');
        let text = firstParagraph?.children?.find(child => child.type === 'Str');

        if(!text) {
            analyzerResults.push(new AnalyzerError('First Paragraph', 'Not found', ResultType.body));
        }

        if(text && text.value.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
            analyzerResults.push(new AnalyzerError('First Paragraph', `Keyword ${keyword} not found`, ResultType.body));
        }
        return analyzerResults;
    }

    private validateHeader(keyword: string) : Array<AnalyzerResult> {
        const analyzerResults = [];
        let header = this.children.find(child => child.type === 'Header' && child.depth === 1);
        if(!header) {
            analyzerResults.push(new AnalyzerError('Article Title', 'Not found', ResultType.body));
        }
        if(header && header.raw.indexOf(keyword) === -1) {
            analyzerResults.push(new AnalyzerError('Article Title', `Keyword ${keyword} not found`, ResultType.body));
        }
        return analyzerResults;
    }
}

export class FrontmatterAnalyzer {

    public get titleAttribute() : string {
        const configuration = workspace.getConfiguration('betterseo');
        const title :string = <string> configuration.get('frontmatter.titleAttribute')!;
        return title;
    }

    public get descriptionAttribute() : string {
        const configuration = workspace.getConfiguration('betterseo');
        const description :string = <string> configuration.get('frontmatter.descriptionAttribute')!;
        return description;
    }

    constructor(public markdownFile: string){}

    public analyze(keywords: string[]) : Array<AnalyzerResult> {
        const frontmatter = matter(this.markdownFile);
        const seoTitle = frontmatter.data[this.titleAttribute];
        const seoDescription = frontmatter.data[this.descriptionAttribute];

        const results = [];
        if (!seoDescription) {
            results.push(new AnalyzerError(this.descriptionAttribute, 'not found', ResultType.frontmatter));
        }
        if (!seoTitle) {
            results.push(new AnalyzerError(this.titleAttribute, 'not found', ResultType.frontmatter));
        }

        return keywords.flatMap(keyword => {
            const results = [];
            if (seoTitle && seoTitle.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
                results.push(new AnalyzerError(this.titleAttribute, `Keyword '${keyword}' not found`, ResultType.frontmatter));
            }
            if (seoTitle && seoTitle.length > 60) {
                results.push(new AnalyzerError(this.titleAttribute, 'SEO Title should have 60 Characters max.', ResultType.frontmatter));
            }
            if (seoDescription && seoDescription.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
                results.push(new AnalyzerError(this.descriptionAttribute, `Keyword '${keyword}' not found`, ResultType.frontmatter));
            }
            if (seoDescription && seoDescription.length > 160) {
                results.push(new AnalyzerError(this.descriptionAttribute, 'SEO Description should 160 characters max.', ResultType.frontmatter));
            }
            return results;
        })
        .concat(results);
    }
}