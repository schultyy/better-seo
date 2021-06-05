export default class StepByStepGuide {
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
        + "\n\nYour workflow is only as good as the plugins you use to write great content. Let's explore which plugins are the most helpful.\n";
    }

    private conclusion() {
        return "## Final Thoughts\n"
        + "\n - Summarize **key points**"
        + "\n - Keep it short";
    }

    render() {
        return [
            this.headline(),
            this.intro(),
            this.listItems(),
            this.conclusion()
        ].join("\n");
    }
}

