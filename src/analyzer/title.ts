import matter = require("gray-matter");
import { AstChild } from "./ast";
import { AnalyzerError, AnalyzerResult, HeaderError, ResultType } from "./errors";
import { FrontmatterConfiguration } from "./frontmatterConfiguration";
import { doesKeywordPartialMatch } from "./utils";

export function validateHeaderStructure(children: AstChild[]) : Array<AnalyzerResult> {
    const firstLevelHeadlines = children.filter(child => child.type === 'Header' && child.depth === 1);
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

function analyzeTitleForRemainingKeywords(keywords: string[], header: string) : AnalyzerResult | null {
    const foundKeywords = keywords.slice(1).filter(keyword => header.indexOf(keyword) !== -1);
    if (foundKeywords.length > 0) {
        return new AnalyzerError('Article Title', 'Article Title should only include the top keyword', ResultType.body);
    }
    return null;
}

function isTitlePresent(markdownFile: string, children: AstChild[], configuration : FrontmatterConfiguration) : boolean {
    let header = children.find(child => child.type === 'Header' && child.depth === 1);
    if(!header) {
        const frontmatter = matter(markdownFile);
        return !!frontmatter.data[configuration.titleField];
    }
    return true;
}

function hasDuplicateTitle(markdownFile: string, children: AstChild[], frontmatterConfiguration: FrontmatterConfiguration) : boolean {
    const frontmatter = matter(markdownFile);
    let firstLevelHeadline = children.find(child => child.type === 'Header' && child.depth === 1);
    const frontmatterTitle = frontmatter.data[frontmatterConfiguration.titleField];
    return firstLevelHeadline && frontmatterTitle;
}

function getHeader(markdownFile : string, children: AstChild[], frontmatterConfiguration: FrontmatterConfiguration) : string | undefined {
    const frontmatter = matter(markdownFile);
    if(frontmatter.data[frontmatterConfiguration.titleField]) {
        return frontmatter.data[frontmatterConfiguration.titleField];
    }
    return children.find(child => child.type === 'Header' && child.depth === 1)?.raw;
}

export function validateTitle(markdownFile: string, children : AstChild[], keywords: string[], frontmatterConfiguration: FrontmatterConfiguration) : Array<AnalyzerResult> {
    const analyzerResults :AnalyzerResult[] = [];

    if(!isTitlePresent(markdownFile, children, frontmatterConfiguration)) {
        analyzerResults.push(new AnalyzerError('Article Title', 'Not found', ResultType.body));
    }

    if(hasDuplicateTitle(markdownFile, children, frontmatterConfiguration)) {
        analyzerResults.push(new AnalyzerError('Article Title', 'Found title in First-Level Headline and Frontmatter', ResultType.body));
    }

    const header = getHeader(markdownFile, children, frontmatterConfiguration);

    if(header && keywords[0] && header.indexOf(keywords[0]) === -1) {
        if(!doesKeywordPartialMatch(keywords[0], header)) {
            analyzerResults.push(new AnalyzerError('Article Title', `Keyword ${keywords[0]} not found`, ResultType.body));
        }
    }

    if(header) {
        const analyzerResult = analyzeTitleForRemainingKeywords(keywords, header);
        if(analyzerResult) {
            analyzerResults.push(analyzerResult);
        }
    }

    return analyzerResults;
}