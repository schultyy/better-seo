export function options() {
    return [
        "List Post",
        "Step by Step",
        "Expanded Definition",
        "Beginners Guide"
    ];
}

export function fromOption(userOption: string) : string | null {
    switch(userOption) {
        case "List Post": {
            return new ListPost().render();
        }
        case "Step by Step": {
            return new StepByStepGuide().render();
        }
        case "Expanded Definition": {
            return new ExpandedDefinition().render();
        }
        case "Beginners Guide": {
            return null;
        }
        default: {
            return null;
        }
    }
}

class ExpandedDefinition {
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
        + "- Link to **further resources**\n"
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

class StepByStepGuide {
    private headline() {
        return "# How to set up a Blogging Framework with VSCode in three Easy Steps"
        + "\n<small>\n"
        + "Use the 'How' Format\n"
        + "Mention the _desired outcome_\n"
        + "List the number of steps\n"
        + "</small>\n";
    }

    private intro() {
        return "**Looking to start your own blog to share your tech lessons learned?"
        + " The trick is a good setup that doesn't cause any overhead.**"
        + "\n"
        + "\nThis is the approach I'm using to produce high-quality blog posts on a frequent schedule with focusing on my content exclusively\n"
        + "\n----\n"
        + "\n"
        + "Explanation:\n\n"
        + "- Show that you understand the **problem**\n"
        + "- Present the **solution** - briefly\n"
        + "- Show **proof** you have the solution\n";
    }

    private listItems() {
        return "## Step #1. Install the right plugins\n"
        + "\n- Use H2 Subheadings"
        + "\n- **Number** them"
        + "\n- Start each one with a **present-tense verb**"
        + "\n\nYour workflow is only as good as the plugins you use to write great content. Let's explore which plugins are the most helpful.\n"
    }

    private conclusion() {
        return "## Final Thoughts\n"
        + "\n - Summarize **key points**"
        + "\n - Keep it short"
    }

    render() {
        return [
            this.headline(),
            this.intro(),
            this.listItems(),
            this.conclusion()
        ].join("\n")
    }
}

class ListPost {
    private headline() {
        return "# 11 Proven Ways to Drive Traffic to Your Website"
                + "\n<sub>Start with the number of items</sub>\n"
                + "\n<sub>If it makes sense: Mention the desired outcome</sub>\n"
    }

    private subHeadline() {
        return "__Feeling overwhelmed by the infinite options for driving traffic to your website?__"
    }

    private intro() {
        return "\nIntro: Keep it short.\n"
                + "Try to establish trust in as few words as possible.\n\n"
                + "Add a table of contents with jump links.\n\n"
                + "[Use H2 subheadings.](#)\n"
                + "[Collaborate with other brands to tap into their audiences](#)\n"
                + "[VSCode and the right plugins for your effective blog workflow.](#)\n"
    }

    private listItemsExplanation() {
        return "## 1. Use H2 subheadings.\n"
                + "\nNumber them where appropriate\n"
                + "\nMake them benefit-focused\n"
                + "\n**Example:** _Collaborate with other brands to tap into their audiences_\n"
                + "\nA benefit tells the reader what **they** get out of it\n"
    }

    private listItemExampleTwo() {
        return "## 2. VSCode and the right plugins for your effective blog workflow.\n"
                + "\nVSCode is well-perceived among developers.\n"
                + "\nBut did you know it is also a great tool for blogging?\n"
                + "\nWith a Markdown plugin, a spellchecker and SEO assistance you produce high-quality"
                + " posts from within a familiar environment in no time.\n"
    }

    private conclusion() {
        return "\n## Final Thoughts\n"
        + "\nThe headline does not have a number"
        + "\nGive one or two _final tips_"
        + "\nKeep it short\n"
        + "\nIn this post, I've ...\n"
    }

    render() {
        return [
            this.headline(),
            this.subHeadline(),
            this.intro(),
            this.listItemsExplanation(),
            this.listItemExampleTwo(),
            this.conclusion()
        ].join('\n')
    }
}