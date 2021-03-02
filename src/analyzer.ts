import matter = require('gray-matter');
import markdownToAst = require("@textlint/markdown-to-ast");

export class AnalyzerResult {
    constructor(public title: string, public message: string) {}
}

interface AstChild {
    type: string;
    value: string;
    raw: string;
    depth: number | undefined;
}

export class FileAnalyzer {
    private readonly children: Array<AstChild>;
    constructor(public markdownFile: string){
        const AST = markdownToAst.parse(this.markdownFile);
        this.children = AST.children;
    }

    public analyze(keyword: string) : Array<AnalyzerResult> {
        let results: Array<AnalyzerResult> = [];
        results = results.concat(this.validateHeader(keyword));
        return results;
    }

    private validateHeader(keyword: string) : Array<AnalyzerResult> {
        const analyzerResults = [];
        let header = this.children.find(child => child.type === 'Header' && child.depth === 1);
        if(!header) {
            analyzerResults.push(new AnalyzerResult('Article Title', 'Not found'));
        }
        if(header && header.raw.indexOf(keyword) === -1) {
            analyzerResults.push(new AnalyzerResult('Article Title', `Keyword ${keyword} not found`));
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
        if (seo_title && seo_title.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
            results.push(new AnalyzerResult('seo_title', `Keyword '${keyword}' not found`));
        }
        if (seo_title && seo_title.length > 60) {
            results.push(new AnalyzerResult('seo_title', 'SEO Title should have 60 Characters max.'));
        }
        if (!seo_description) {
            results.push(new AnalyzerResult('seo_description', 'not found'));
        }
        if (seo_description && seo_description.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
            results.push(new AnalyzerResult('seo_description', `Keyword '${keyword}' not found`));
        }
        if (seo_description && seo_description.length > 160) {
            results.push(new AnalyzerResult('seo_description', 'SEO Description should 160 characters max.'));
        }

        return results;
    }
}