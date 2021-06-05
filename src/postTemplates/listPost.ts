export default class ListPost {
    private headline() {
        return "# HEADLINE / Start with the number of items / and desired outcome"
                + "\n<sub>\n"
                + "\tExample: 11 Proven Ways to Drive Traffic to Your Website"
                + "\n</sub>\n";
    }

    private subHeadline() {
        return "\n__Sub Headline: Feeling overwhelmed by the infinite options for driving traffic to your website?__\n";
    }

    private intro() {
        return "__Intro__\n"
                + "\n- Intro: Keep it short."
                + "\n- Try to establish trust in as few words as possible."
                + "\n- Table of contents with jump links:\n\n"
                + "\n[Use H2 subheadings.](#)"
                + "\n[Collaborate with other brands to tap into their audiences](#)"
                + "\n[VSCode and the right plugins for your effective blog workflow.](#)\n";
    }

    private listItemsExplanation() {
        return "## 1. Use H2 subheadings.\n"
        + "\n - Number them where appropriate"
        + "\n - Make them benefit-focused"
        + "\n - **Example:** _Collaborate with other brands to tap into their audiences_"
        + "\n - A benefit tells the reader what **they** get out of it";
    }

    private conclusion() {
        return "\n## Final Thoughts\n"
        + "\nThe headline does not have a number"
        + "\nGive one or two _final tips_"
        + "\nKeep it short\n"
        + "\nIn this post, I've ...\n";
    }

    render() {
        return [
            this.headline(),
            this.subHeadline(),
            this.intro(),
            this.listItemsExplanation(),
            this.conclusion()
        ].join('\n');
    }
}