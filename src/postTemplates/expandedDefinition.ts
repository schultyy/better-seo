export default class ExpandedDefinition {
    private title() {
        return "# What is SEO? Search Engine Optimization explained\n"
        + "\n<small>"
        + "\nStart with **what is/are**"
        + "\nAdd **context**"
        + "\n</small>\n";
    }

    private intro() {
        return "**SEO stands for “search engine optimization.”"
                + " In simple terms, it means the process of improving your site to increase its visibility for relevant searches.**\n\n"
                + "The better visibility your pages have in search results, the more likely you are to garner attention.\n\n"
                + "- Start with **the definition**\n"
                + "- Keep it short\n"
                + "- Add a **table of contents* with jump links"
                + "\n\n";
    }

    private followUpQuestions() {
        return "## Why is SEO so important for marketing?\n\n"
        + "SEO is a fundamental part of digital marketing because people conduct trillions of searches every year, "
        + "often with commercial intent to find information about products and services.\n\n"
        + "- Research what people want to know\n"
        + "- Use H2 subheadings for each **question**\n"
        + "- Provide the answers\n"
        + "\n\n";
    }

    private conclusion() {
        return "## Final thoughts\n\n"
        + "SEO stands for Search Engine Optimization. If you want to get organic traffic onto your website "
        + "you need to learn the foundations of SEO.\n\n"
        + "- Summarize **key points**\n"
        + "- Link to **further resources**\n";
    }

    render() {
        return [
            this.title(),
            this.intro(),
            this.followUpQuestions(),
            this.conclusion()
        ].join("\n");
    }
}