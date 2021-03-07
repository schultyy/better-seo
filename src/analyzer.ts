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

export function extractKeywords(currentFile: string) :Array<string> {
    const frontmatter = matter(currentFile);
    const keywords = frontmatter.data['keywords'] || frontmatter.data['Keywords'];
    if(!keywords) {
        return [];
    }
    return keywords;
}

export function runAnalysis(markdownFile: string, configuration: FrontmatterConfiguration) : Array<AnalyzerResult> {
    const fileAnalyzer = new FileAnalyzer(markdownFile);
    const frontmatterAnalyzer = new FrontmatterAnalyzer(markdownFile, configuration);
    const keywords = extractKeywords(markdownFile);
    const fileResults = fileAnalyzer.analyze(keywords);
    const frontmatterResults = frontmatterAnalyzer.analyze(keywords);
    return frontmatterResults.concat(fileResults);
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
        results = results.concat(this.validateHeader(keywords));
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

    private validateHeader(keywords: string[]) : Array<AnalyzerResult> {
        const analyzerResults = [];
        let header = this.children.find(child => child.type === 'Header' && child.depth === 1);
        if(!header) {
            analyzerResults.push(new AnalyzerError('Article Title', 'Not found', ResultType.body));
        }
        if(header && header.raw.indexOf(keywords[0]) === -1) {
            analyzerResults.push(new AnalyzerError('Article Title', `Keyword ${keywords[0]} not found`, ResultType.body));
        }

        if(header) {
            const foundKeywords = keywords.slice(1).filter(keyword => header?.raw.indexOf(keyword));
            if(foundKeywords.length > 0) {
                analyzerResults.push(
                    new AnalyzerError('Article Title', 'Article Title should only include the top keyword', ResultType.body)
                );
            }
        }

        return analyzerResults;
    }
}

export interface FrontmatterConfiguration {
    titleField: string;
    descriptionField: string;
}

export class FrontmatterAnalyzer {
    constructor(public markdownFile: string, private configuration: FrontmatterConfiguration){}

    public analyze(keywords: string[]) : Array<AnalyzerResult> {
        const frontmatter = matter(this.markdownFile);
        const seoTitle = frontmatter.data[this.configuration.titleField];
        const seoDescription = frontmatter.data[this.configuration.descriptionField];

        let results = [];
        if (!seoDescription) {
            results.push(new AnalyzerError(this.configuration.descriptionField, 'Field not found', ResultType.frontmatter));
        }
        if (!seoTitle) {
            results.push(new AnalyzerError(this.configuration.titleField, 'Field not found', ResultType.frontmatter));
        }else {
            if(keywords.length === 1) {
                results = results.concat(this.validateSeoTitle(seoTitle, keywords[0]));
            }
            else if(keywords.length >= 2) {
                results = results.concat(this.validateSeoTitle(seoTitle, keywords[0]));
                results = results.concat(this.validateSeoTitle(seoTitle, keywords[1]));
            }
            if(keywords.length >= 3) {
                results = results.concat(this.validateSeoTitleWithAllKeywords(seoTitle, keywords));
            }
        }

        return keywords.flatMap(keyword => {
            const results : AnalyzerResult[] = [];
            if (seoDescription && seoDescription.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
                results.push(new AnalyzerError(this.configuration.descriptionField, `Keyword '${keyword}' not found`, ResultType.frontmatter));
            }
            if (seoDescription && seoDescription.length > 160) {
                results.push(new AnalyzerError(this.configuration.descriptionField, 'SEO Description should 160 characters max.', ResultType.frontmatter));
            }
            return results;
        })
        .concat(results);
    }

    private validateSeoTitleWithAllKeywords(seoTitle: string, keywords: string[]) : AnalyzerResult[] {
        const foundKeywords = keywords.filter(keyword => {
            return seoTitle.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
        });

        if(foundKeywords.length === keywords.length) {
            return [
                new AnalyzerError(
                        this.configuration.titleField,
                        'SEO Title should only include two keywords maximum',
                        ResultType.frontmatter
                )
            ];
        }
        return [];
    }

    private validateSeoTitle(seoTitle: string, keyword: string) : AnalyzerResult[] {
        const results = [];
        if (seoTitle && seoTitle.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
            results.push(new AnalyzerError(this.configuration.titleField, `Keyword '${keyword}' not found`, ResultType.frontmatter));
        }
        if (seoTitle && seoTitle.length > 60) {
            results.push(new AnalyzerError(this.configuration.titleField, 'SEO Title should have 60 Characters max.', ResultType.frontmatter));
        }
        return results;
    }
}