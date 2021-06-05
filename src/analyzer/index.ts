import matter = require('gray-matter');
import markdownToAst = require("@textlint/markdown-to-ast");
import { AnalyzerError, AnalyzerResult, ParagraphError, ResultType } from './errors';
import { AstChild } from './ast';
import { validateTitle, validateHeaderStructure } from './title';
import { analyzeFrontmatter } from './frontmatter';
import { FrontmatterConfiguration } from './frontmatterConfiguration';

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
        validateTitle(markdownFile, children, keywords),
        keywords.flatMap(keyword => validateFirstParagraph(children, keyword)),
        validateParagraphLength(children),
        validateArticleLength(children)
    ].flat();
}