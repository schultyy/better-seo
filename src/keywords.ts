import { KeyObject } from "crypto";
import matter = require("gray-matter");

export default function extractKeywords(currentFile: string) :Array<string> {
    const frontmatter = matter(currentFile);
    const keywords = frontmatter.data['keywords'] || frontmatter.data['Keywords'];
    if(!keywords) {
        return [];
    }
    return keywords;
}