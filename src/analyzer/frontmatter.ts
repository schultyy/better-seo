import matter = require("gray-matter");
import { AnalyzerError, AnalyzerResult, ResultType } from "./errors";
import { FrontmatterConfiguration } from "./frontmatterConfiguration";
import { doesKeywordPartialMatch } from "./utils";

export function analyzeFrontmatter(markdownFile: string, configuration: FrontmatterConfiguration, keywords: string[]) : Array<AnalyzerResult> {
    const frontmatter = matter(markdownFile);
    const seoTitle = frontmatter.data[configuration.seoTitleField];
    const seoDescription = frontmatter.data[configuration.seoDescriptionField];

    let results :AnalyzerResult[] = [];
    if (!seoDescription) {
        results.push(new AnalyzerError(configuration.seoDescriptionField, 'Field not found', ResultType.frontmatter));
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
        results.push(new AnalyzerError(configuration.seoTitleField, 'Field not found', ResultType.frontmatter));
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
                configuration.seoDescriptionField,
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
            new AnalyzerError(configuration.seoDescriptionField,
                'SEO Description should not contain more than the primary and secondary keyword',
                ResultType.frontmatter)
        ];
    }
    return [];
}

function validateSeoDescription(configuration: FrontmatterConfiguration, seoDescription: string, keyword: string) : AnalyzerResult[] {
    const results :AnalyzerResult[] = [];
    if (seoDescription && seoDescription.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
        results.push(new AnalyzerError(configuration.seoDescriptionField, `Keyword '${keyword}' not found`, ResultType.frontmatter));
    }
    if (seoDescription && seoDescription.length > 160) {
        results.push(new AnalyzerError(configuration.seoDescriptionField, 'SEO Description should 160 characters max.', ResultType.frontmatter));
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
                    configuration.seoTitleField,
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
        results.push(new AnalyzerError(configuration.seoTitleField, `Keyword '${keyword}' not found`, ResultType.frontmatter));
    }
    if (seoTitle && seoTitle.length > 60) {
        results.push(new AnalyzerError(configuration.seoTitleField, 'SEO Title should have 60 Characters max.', ResultType.frontmatter));
    }
    return results;
}