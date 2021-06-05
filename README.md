# Better SEO

![Better SEO Logo](https://raw.githubusercontent.com/schultyy/better-seo/main/resources/better_seo.png)

You are a software developer and you care about well-written content. But what's even more important than that is content that attracts organic traffic.
Search Engine Optimization (SEO) is a must to bring in organic traffic to your site. If you ever researched SEO rules before, it can be frightening because **there are so many**.

You'd like to produce great content without having to learn about SEO guidelines first. That's where Better SEO comes in. You focus on writing high-quality content using [VSCode](https://code.visualstudio.com/) and use Better SEO directly within the editor to optimize your posts once they're ready to publish.

## How it works

You start working on your blog post in a Markdown file (`.md`, `.mdx`). Better SEO expects some meta information in the Front Matter of your Markdown file:

```yaml
---
keywords:
    - Search Engines
    - Better SEO
    - Get found online
seo_title: How to get found online
seo_description: Getting found online means organic traffic.
title: The title can be in Front Matter (optional) or first-level headline (default)
---

# How to get found online - A guide with examples

Lorem Ipsum Dolor sit amet.
```

An article needs a `seo_title` and `seo_description` (see [Configuration](#configuration) to configure different field names). These are the equivalent fields for `SEO Title` and `SEO/Meta Description` on your blog.

**What's the difference between title and SEO Title?**

Initially, you could argue both fields are the same, yet they have different jobs.

**Title:** If you share an article on any social media stream, the first thing other people will see in the preview is the post's title.
In this case you want to capture the attention of people who are skimming through their newsfeed to capture their attention and pique their interest enough so that they stop and click through to your article.

**SEO Title:** The SEO Title is relevant for search engines. When your blog post shows up in search results, the SEO Title appears as the blue link. Search engines place a heavy reliance on it in deciding whether or not your page is relevant to the search query.
Your SEO Title needs to reflect the wording that searchers type into a search engine. The closer it can get to that the higher your page will appear in the search results.

**Keywords**

Sometimes, you're doing extensive keyword research before writing your blog post. During the research process, you might be leveraging tools such as [Google Keyword Planner](https://ads.google.com/home/tools/keyword-planner/), [ahrefs](ahrefs.com) or [SEMRush](https://www.semrush.com/) to come up with a list of keywords.

Usually, you have one main keyword to focus on, such as "Learn JavaScript" with one or two more supporting ones. In your Front Matter, use the `keywords` key to enable Better SEO's keyword feedback for your article:

```yaml
---
keywords:
- Learn JavaScript
- JavaScript Tutorial
- How long does it take to learn JavaScript
---
```

The first keyword in the list is your main keyword and has the highest significance which will be reflected in the feedback you'll receive.

**Title**

You can set your blog post's title with a first-level headline:

```markdown
---
seo_title: Learn JavaScript in a week
seo_description: Everything you need to know to get started with JavaScript quickly
---

# How to learn JavaScript in a week
```

Some blogging engines, such as [Jekyll](https://jekyllrb.com/) configure the blog post's title in the Front Matter like this:

```markdown
---
seo_title: Learn JavaScript in a week
seo_description: Everything you need to know to get started with JavaScript quickly
title: How to learn JavaScript in a week
---

JavaScript is one of the most popular programming languages...
```

## SEO Feedback

Once you're ready to review, open the Better SEO sidebar in the menu on the Left-hand side:

![Better SEO in the Sidebar](https://raw.githubusercontent.com/schultyy/better-seo/35987c419133382d554e3e28ac4bd24e14011f7d/resources/sidebar.png)

Once the View opened, click the Refresh Button in the top-right corner to start the analysis:

![refresh button](https://raw.githubusercontent.com/schultyy/better-seo/35987c419133382d554e3e28ac4bd24e14011f7d/resources/refresh_button.png)

If you have configured `keywords` in your Markdown file, they will be used during the analysis. Once the analysis is completed, you will see the results in the TreeView:

![Analysis Results](https://raw.githubusercontent.com/schultyy/better-seo/35987c419133382d554e3e28ac4bd24e14011f7d/resources/analysis_results.png)

### What it validates

- The blog post's title (The first occurrence of a first-level headline)
- Does the keyword occur in `seo_title`?
- Does the keyword occur in `seo_description`?
- The text length of `seo_title`
- The text length of `seo_description`
- Headline structure
- The total Article length

## Configuration

Your Front Matter structure might be different compared to the defaults shown here. Therefore, you can configure field names such as  `seo_title`, `seo_description` and `title` within the blogpost's Front Matter. To configure different field names, use the following command:

- On Windows/Linux - __File > Preferences > Settings__
- On macOS - __Code > Preferences > Settings__

Then, search for `BetterSEO`:

![Better SEO Settings Screenshot](https://raw.githubusercontent.com/schultyy/better-seo/35987c419133382d554e3e28ac4bd24e14011f7d/resources/settings_screenshot.png)

## Release Notes

Check out [GitHub Releases](https://github.com/schultyy/better-seo/releases).

## Anything missing?

Are you missing a feature or SEO validation rule? Please consider [opening a ticket](https://github.com/schultyy/better-seo/issues/new).

## License

MIT
