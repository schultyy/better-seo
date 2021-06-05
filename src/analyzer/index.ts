import matter = require('gray-matter');
import markdownToAst = require("@textlint/markdown-to-ast");
import { AnalyzerError, AnalyzerResult, ParagraphError, ResultType } from './errors';
import { doesKeywordPartialMatch } from './utils';
import { AstChild } from './ast';
import { validateHeader, validateHeaderStructure } from './header';


export function extractKeywords(currentFile: string) :Array<string> {
    const frontmatter = matter(currentFile);
    const keywords = frontmatter.data['keywords'] || frontmatter.data['Keywords'];
    if(!keywords) {
        return [];
    }
    return keywords;
}

export function runAnalysis(markdownFile: string, configuration: FrontmatterConfiguration) : Array<AnalyzerResult> {
    const keywords = extractKeywords(markdownFile);
    return analyze(markdownFile, keywords).concat(analyzeFrontmatter(markdownFile, configuration, keywords));
}

function validateFirstParagraph(children : AstChild[], keyword: string) : Array<AnalyzerResult> {
    const analyzerResults = [];
    let firstParagraph = children.find(child => child.type === 'Paragraph');
    let text = firstParagraph?.children?.find(child => child.type === 'Str');

    if(!text) {
        analyzerResults.push(new AnalyzerError('First Paragraph', 'Not found', ResultType.body));
    }

    if(text && text.value.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
        analyzerResults.push(new AnalyzerError('First Paragraph', `Keyword ${keyword} not found`, ResultType.body));
    }
    return analyzerResults;
}

function validateParagraphLength(children: AstChild[]) : Array<AnalyzerResult> {
    const paragraphs = children.filter(child => child.type === 'Paragraph');
    const longParagraphErrors = paragraphs.filter(paragraph => {
        return paragraph.raw
                        .split(/\s+/)
                        .length >= 200;
    })
    .map((paragraph) => {
        return new ParagraphError(
            'Paragraph',
            paragraph.loc,
            `Paragraph starting with ${paragraph.raw.substr(0, 20)} has more than 200 characters(${paragraph.raw.length}). Consider breaking it up`,
            ResultType.body
        );
    });
    return longParagraphErrors;
}

function validateArticleLength(children: AstChild[]) : Array<AnalyzerResult> {
    const paragraphs = children.filter(child => child.type === 'Paragraph')
                                    .filter(child => child.children)
                                    .flatMap(child => child.children?.filter(grandChild => grandChild.type === 'Str'));

    const totalLength = paragraphs.flatMap(textElement => textElement ? textElement.raw.split(/\s+/) : [])
                                    .reduce((acc, _currentValue) => acc + 1, 0);
    if (totalLength < 300) {
        return [
            new AnalyzerError('Article Length', `Article is too short. Expected: At least 300 Characters. Actual Length: ${totalLength}`, ResultType.body)
        ];
    }
    return [];
}

function analyze(markdownFile : string, keywords: string[]) : Array<AnalyzerResult> {
    const AST = markdownToAst.parse(markdownFile);
    const children = AST.children;
    return [
        validateHeaderStructure(children),
        validateHeader(children, keywords),
        keywords.flatMap(keyword => validateFirstParagraph(children, keyword)),
        validateParagraphLength(children),
        validateArticleLength(children)
    ].flat();
}

export interface FrontmatterConfiguration {
    titleField: string;
    descriptionField: string;
}

function analyzeFrontmatter(markdownFile: string, configuration: FrontmatterConfiguration, keywords: string[]) : Array<AnalyzerResult> {
    const frontmatter = matter(markdownFile);
    const seoTitle = frontmatter.data[configuration.titleField];
    const seoDescription = frontmatter.data[configuration.descriptionField];

    let results :AnalyzerResult[] = [];
    if (!seoDescription) {
        results.push(new AnalyzerError(configuration.descriptionField, 'Field not found', ResultType.frontmatter));
    } else {
        results = results.concat(firstKeywordMultipleSeoDescriptionOccurrences(configuration, seoDescription, keywords[0]));

        if(keywords.length === 1) {
            results = results.concat(validateSeoDescription(configuration, seoDescription, keywords[0]));
        }
        else if(keywords.length >= 2) {
            results = results.concat(validateSeoDescription(configuration, seoDescription, keywords[0]));
            results = results.concat(validateSeoDescription(configuration, seoDescription, keywords[1]));
        }
        if(keywords.length >= 3) {
            results = results.concat(validateSeoDescriptionWithAllKeywords(configuration, seoDescription, keywords));
        }
    }
    if (!seoTitle) {
        results.push(new AnalyzerError(configuration.titleField, 'Field not found', ResultType.frontmatter));
    }else {
        if(keywords.length >= 1) {
            const titleError = validateSeoTitle(configuration, seoTitle, keywords[0]);
            if(titleError && !doesKeywordPartialMatch(keywords[0], seoTitle)) {
                results = results.concat(titleError);
            }
        }
        if(keywords.length >= 3) {
            results = results.concat(validateSeoTitleWithAllKeywords(configuration, seoTitle, keywords));
        }
    }

    return results;
}

function firstKeywordMultipleSeoDescriptionOccurrences(configuration : FrontmatterConfiguration, seoDescription: string, firstKeyword: string) : AnalyzerResult[] {
    const regex = new RegExp(`${firstKeyword}+`, 'ig');
    if((seoDescription.match(regex) || []).length > 1) {
        return [
            new AnalyzerError(
                configuration.descriptionField,
                'Should not contain primary keyword more than once',
                ResultType.frontmatter
            )
        ];
    }
    return [];
}

function validateSeoDescriptionWithAllKeywords(configuration: FrontmatterConfiguration, seoDescription: string, keywords: string[]) : AnalyzerResult[] {
    const foundKeyWords = keywords.slice(2)
                                    .filter(keyword => seoDescription.toLowerCase().indexOf(keyword.toLowerCase()) !== -1);
    if(foundKeyWords.length === keywords.slice(2).length) {
        return [
            new AnalyzerError(configuration.descriptionField,
                'SEO Description should not contain more than the primary and secondary keyword',
                ResultType.frontmatter)
        ];
    }
    return [];
}

function validateSeoDescription(configuration: FrontmatterConfiguration, seoDescription: string, keyword: string) : AnalyzerResult[] {
    const results :AnalyzerResult[] = [];
    if (seoDescription && seoDescription.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
        results.push(new AnalyzerError(configuration.descriptionField, `Keyword '${keyword}' not found`, ResultType.frontmatter));
    }
    if (seoDescription && seoDescription.length > 160) {
        results.push(new AnalyzerError(configuration.descriptionField, 'SEO Description should 160 characters max.', ResultType.frontmatter));
    }
    return results;
}

function validateSeoTitleWithAllKeywords(configuration: FrontmatterConfiguration, seoTitle: string, keywords: string[]) : AnalyzerResult[] {
    const foundKeywords = keywords.filter(keyword => {
        return seoTitle.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
    });

    if(foundKeywords.length === keywords.length) {
        return [
            new AnalyzerError(
                    configuration.titleField,
                    'SEO Title should only include two keywords maximum',
                    ResultType.frontmatter
            )
        ];
    }
    return [];
}

function validateSeoTitle(configuration: FrontmatterConfiguration, seoTitle: string, keyword: string) : AnalyzerResult[] {
    const results = [];
    if (seoTitle && seoTitle.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
        results.push(new AnalyzerError(configuration.titleField, `Keyword '${keyword}' not found`, ResultType.frontmatter));
    }
    if (seoTitle && seoTitle.length > 60) {
        results.push(new AnalyzerError(configuration.titleField, 'SEO Title should have 60 Characters max.', ResultType.frontmatter));
    }
    return results;
}