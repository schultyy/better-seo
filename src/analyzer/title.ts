import { AstChild } from "./ast";
import { AnalyzerError, AnalyzerResult, HeaderError, ResultType } from "./errors";
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

function analyzeTitleForRemainingKeywords(keywords: string[], header: AstChild) : AnalyzerResult | null {
    const foundKeywords = keywords.slice(1).filter(keyword => header?.raw.indexOf(keyword) !== -1);
    if (foundKeywords.length > 0) {
        return new AnalyzerError('Article Title', 'Article Title should only include the top keyword', ResultType.body);
    }
    return null;
}

export function validateHeader(children : AstChild[], keywords: string[]) : Array<AnalyzerResult> {
    const analyzerResults :AnalyzerResult[] = [];
    let header = children.find(child => child.type === 'Header' && child.depth === 1);
    if(!header) {
        analyzerResults.push(new AnalyzerError('Article Title', 'Not found', ResultType.body));
    }
    if(header &&keywords[0] && header.raw.indexOf(keywords[0]) === -1) {
        if(!doesKeywordPartialMatch(keywords[0], header.raw)) {
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