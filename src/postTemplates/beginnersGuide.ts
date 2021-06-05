export default class BeginnersGuide {
    private title() {
        return "# Rust-Lang: The Beginner's Guide\n"
                + "\n<small>\n"
                + "- Mention the **topic**\n"
                + "- State that it's **for beginners**\n"
                + "- Keep it simple\n"
                + "</small>\n";
    }

    private intro() {
        return "**If you want to write performant code that works once it compiles, Rust is for you.**\n"
        + "Rust has a learning curve because it does things differently than other languages, "
        + "but it pays off with more robust, well-tested and performant applications that can run on the command line, "
        + "on embedded devices and web browsers.\n";
    }

    private aboutTheTopic() {
        return "## How do you write Rust Code?\n\n"
        + "Writing your first Rust code might feel very different from other languages. Let's explore what you need to know about the language.\n\n"
        + "- Research what beginners want to know\n"
        + "- Use H2 Subheadings for each **question**\n"
        + "- Provide the **answers**\n"
        + "\n";
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