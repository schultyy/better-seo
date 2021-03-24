import matter = require('gray-matter');
import markdownToAst = require("@textlint/markdown-to-ast");

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

export interface Position {
    line: number;
    column: number;
}

export interface Location {
    start: Position;
    end: Position;
}

export class ParagraphError extends AnalyzerError {
    constructor(
        public title: string,
        public loc: Location,
        public message: string,
        public resultType: ResultType) {
            super(title, message, resultType);
    }
}

export class HeaderError extends AnalyzerError {
    constructor(
        public title: string,
        public loc: Location,
        public message: string,
        public resultType: ResultType) {
            super(title, message, resultType);
        }
}

interface AstChild {
    type: string;
    value: string;
    raw: string;
    depth?: number;
    loc: Location;
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

function doesKeywordPartialMatch(keyword: string, fieldValue: string) : boolean {
    const splittedKeyword = keyword.split(' ');
    const foundWordResults = [];

    for(let i = 0; i < splittedKeyword.length; i++) {
        const currentKeywordPartial = splittedKeyword[i].toLowerCase();
        foundWordResults.push(fieldValue.toLowerCase().indexOf(currentKeywordPartial) !== -1);
    }

    return foundWordResults.every(value => value === true);
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
        results = results.concat(this.validateParagraphLength());
        return results;
    }

    private validateHeaderStructure() : Array<AnalyzerResult> {
        const firstLevelHeadlines = this.children.filter(child => child.type === 'Header' && child.depth === 1);
        if(firstLevelHeadlines.length > 1) {
            return firstLevelHeadlines.map(firstLevelHeadline => {
                return new HeaderError(
                        'Header',
                        firstLevelHeadline.loc,
                        'Inconsistent Header Structure. Only one first level Header allowed.',
                        ResultType.body);
            });
        }
        return [];
    }

    private validateParagraphLength() : Array<AnalyzerResult> {
        const paragraphs = this.children.filter(child => child.type === 'Paragraph');
        const longParagraphErrors = paragraphs.filter(paragraph => {
            return paragraph.raw.length >= 200;
        })
        .map((paragraph) => {
            return new ParagraphError(
                'Paragraph',
                paragraph.loc,
                `Paragraph starting with ${paragraph.raw.substr(0, 20)} has more than 200 characters. Consider breaking it up`,
                ResultType.body
            );
        });
        return longParagraphErrors;
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
        const analyzerResults :AnalyzerResult[] = [];
        let header = this.children.find(child => child.type === 'Header' && child.depth === 1);
        if(!header) {
            analyzerResults.push(new AnalyzerError('Article Title', 'Not found', ResultType.body));
        }
        if(header && header.raw.indexOf(keywords[0]) === -1) {
            if(!doesKeywordPartialMatch(keywords[0], header.raw)) {
                analyzerResults.push(new AnalyzerError('Article Title', `Keyword ${keywords[0]} not found`, ResultType.body));
            }
        }

        if(header) {
            const analyzerResult = this.analyzeTitleForRemainingKeywords(keywords, header);
            if(analyzerResult) {
                analyzerResults.push(analyzerResult);
            }
        }

        return analyzerResults;
    }

    private analyzeTitleForRemainingKeywords(keywords: string[], header: AstChild) : AnalyzerResult | null {
        const foundKeywords = keywords.slice(1).filter(keyword => header?.raw.indexOf(keyword) !== -1);
        if (foundKeywords.length > 0) {
            return new AnalyzerError('Article Title', 'Article Title should only include the top keyword', ResultType.body);
        }
        return null;
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

        let results :AnalyzerResult[] = [];
        if (!seoDescription) {
            results.push(new AnalyzerError(this.configuration.descriptionField, 'Field not found', ResultType.frontmatter));
        } else {
            results = results.concat(this.firstKeywordMultipleSeoDescriptionOccurrences(seoDescription, keywords[0]));

            if(keywords.length === 1) {
                results = results.concat(this.validateSeoDescription(seoDescription, keywords[0]));
            }
            else if(keywords.length >= 2) {
                results = results.concat(this.validateSeoDescription(seoDescription, keywords[0]));
                results = results.concat(this.validateSeoDescription(seoDescription, keywords[1]));
            }
            if(keywords.length >= 3) {
                results = results.concat(this.validateSeoDescriptionWithAllKeywords(seoDescription, keywords));
            }
        }
        if (!seoTitle) {
            results.push(new AnalyzerError(this.configuration.titleField, 'Field not found', ResultType.frontmatter));
        }else {
            if(keywords.length >= 1) {
                const titleError = this.validateSeoTitle(seoTitle, keywords[0]);
                if(titleError && !doesKeywordPartialMatch(keywords[0], seoTitle)) {
                    results = results.concat(titleError);
                }
            }
            if(keywords.length >= 3) {
                results = results.concat(this.validateSeoTitleWithAllKeywords(seoTitle, keywords));
            }
        }

        return results;
    }

    private firstKeywordMultipleSeoDescriptionOccurrences(seoDescription: string, firstKeyword: string) : AnalyzerResult[] {
        const regex = new RegExp(`${firstKeyword}+`, 'ig');
        if((seoDescription.match(regex) || []).length > 1) {
            return [
                new AnalyzerError(
                    this.configuration.descriptionField,
                    'Should not contain primary keyword more than once',
                    ResultType.frontmatter
                )
            ];
        }
        return [];
    }

    private validateSeoDescriptionWithAllKeywords(seoDescription: string, keywords: string[]) : AnalyzerResult[] {
        const foundKeyWords = keywords.slice(2)
                                        .filter(keyword => seoDescription.toLowerCase().indexOf(keyword.toLowerCase()) !== -1);
        if(foundKeyWords.length === keywords.slice(2).length) {
            return [
                new AnalyzerError(this.configuration.descriptionField,
                    'SEO Description should not contain more than the primary and secondary keyword',
                    ResultType.frontmatter)
            ];
        }
        return [];
    }

    private validateSeoDescription(seoDescription: string, keyword: string) : AnalyzerResult[] {
        const results :AnalyzerResult[] = [];
        if (seoDescription && seoDescription.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
            results.push(new AnalyzerError(this.configuration.descriptionField, `Keyword '${keyword}' not found`, ResultType.frontmatter));
        }
        if (seoDescription && seoDescription.length > 160) {
            results.push(new AnalyzerError(this.configuration.descriptionField, 'SEO Description should 160 characters max.', ResultType.frontmatter));
        }
        return results;
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