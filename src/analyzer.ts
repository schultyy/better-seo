import matter = require('gray-matter');

export class AnalyzerResult {
    constructor(public title: string, public message: string) {}
}

export class FileAnalyzer {
    constructor(public markdownFile: string){}

    public analyze(keyword: string) : Array<AnalyzerResult> {
        const parse = require("@textlint/markdown-to-ast").parse;
        const AST = parse(this.markdownFile);
        const children: Array<any> = AST.children;
        const analyzerResults = [];
        let header = children.find(child => child.type === 'Header' && child.depth === 1);
        if(!header) {
            analyzerResults.push(new AnalyzerResult('Article Title', 'Not found'));
        }
        return analyzerResults;
    }
}

export class FrontmatterAnalyzer {
    constructor(public markdownFile: string){}

    public analyze(keyword: string) : Array<AnalyzerResult> {
        const frontmatter = matter(this.markdownFile);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { seo_title, seo_description } = frontmatter.data;
        const results = [];
        if (!seo_title) {
            results.push(new AnalyzerResult('seo_title', 'not found'));
        }
        if (seo_title && seo_title.indexOf(keyword) === -1) {
            results.push(new AnalyzerResult('seo_title', `Keyword '${keyword}' not found`));
        }
        if (seo_title && seo_title.length > 60) {
            results.push(new AnalyzerResult('seo_title', 'SEO Title should have 60 Characters max.'));
        }
        if (!seo_description) {
            results.push(new AnalyzerResult('seo_description', 'not found'));
        }
        if (seo_description && seo_description.indexOf(keyword) === -1) {
            results.push(new AnalyzerResult('seo_description', `Keyword '${keyword}' not found`));
        }
        if (seo_description && seo_description.length > 160) {
            results.push(new AnalyzerResult('seo_description', 'SEO Description should 160 characters max.'));
        }

        return results;
    }
}