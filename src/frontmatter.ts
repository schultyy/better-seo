import matter = require('gray-matter');

export class AnalyzerResult {
    constructor(public title: string, public message: string) {}
}

export default class FrontmatterAnalyzer {
    constructor(public markdownFile: string){}

    public analyze(keyword: string) : Array<AnalyzerResult> {
        const frontmatter = matter(this.markdownFile);
        const { title } = frontmatter.data;
        const results = [];
        if (title.indexOf(keyword) === -1) {
            results.push(new AnalyzerResult('title', 'missing keyword'));
        }
        return results;
    }
}