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
            return new BeginnersGuide().render();
        }
        default: {
            return null;
        }
    }
}

class BeginnersGuide {
    private title() {
        return "# Rust-Lang: The Beginner's Guide\n"
                + "\n<small>\n"
                + "- Mention the **topic**\n"
                + "- State that it's **for beginners**\n"
                + "- Keep it simple\n"
                + "</small>\n"
    }

    private intro() {
        return "**If you want to write performant code that works once it compiles, Rust is for you.**\n"
        + "Rust has a learning curve because it does things differently than other languages, "
        + "but it pays off with more robust, well-tested and performant applications that can run on the command line, "
        + "on embedded devices and web browsers.\n"
    }

    private aboutTheTopic() {
        return "## How do you write Rust Code?\n\n"
        + "Writing your first Rust code might feel very different from other languages. Let's explore what you need to know about the language.\n\n"
        + "- Research what beginners want to know\n"
        + "- Use H2 Subheadings for each **question**\n"
        + "- Provide the **answers**\n"
        + "\n"
    }

    private conclusion() {
        return "## Final Thoughts\n\n"
        + "Rust does have a learning curve. But once you get familiar with the foundations, "
        + "you can be sure, if it compiles, it will run.\n"
        + "\nLooking to get deeper into Rust? Read [this](#).\n\n"
        + "- Give some **final encouragement**\n"
        + "- Link to **further resources**\n";
    }

    render() {
        return [
            this.title(),
            this.intro(),
            this.aboutTheTopic(),
            this.conclusion()
        ].join("\n");
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