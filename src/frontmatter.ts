import matter = require('gray-matter');

export class AnalyzerResult {
    constructor(public title: string, public message: string) {}
}

export default class FrontmatterAnalyzer {
    constructor(public markdownFile: string){}

    public analyze(keyword: string) : Array<AnalyzerResult> {
        const frontmatter = matter(this.markdownFile);
        const { seo_title, seo_description } = frontmatter.data;
        const results = [];
        if(!seo_title) {
            results.push(new AnalyzerResult('seo_title', 'not found'));
        }
        if (seo_title && seo_title.indexOf(keyword) === -1) {
            results.push(new AnalyzerResult('seo_title', `Keyword '${keyword}' not found`));
        }
        if(!seo_description) {
            results.push(new AnalyzerResult('seo_description', 'not found'));
        }
        if (seo_description && seo_description.indexOf(keyword) === -1) {
            results.push(new AnalyzerResult('seo_title', `Keyword '${keyword}' not found`));
        }

        return results;
    }
}