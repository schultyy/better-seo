import matter = require('gray-matter');

export default class FrontmatterAnalyzer {
    constructor(public markdownFile: string){}

    public analyze(keyword: string) : Array<string> {
        const frontmatter = matter(this.markdownFile);
        const { title } = frontmatter.data;
        const results = [];
        if (title.indexOf(keyword) === -1) {
            results.push("Missing keyword in title");
        }
        return results;
    }
}