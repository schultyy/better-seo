# Better SEO

![Better SEO Logo](https://github.com/schultyy/better-seo/blob/8e67368054112dab8db5c926a44e6f0f6e8b954a/resources/better_seo.png)

Are you a Software Developer using [VSCode](https://code.visualstudio.com/) to write Blog Posts and do you care about getting found on Google? This extension is for you!

You might already be using third-party tools to ensure SEO compliance outside of VSCode such as [Yoast SEO in Wordpress](https://yoast.com/wordpress/plugins/seo/). But back-porting changes from Wordpress back to your Markdown file is tedious. It takes a long time and the article is already finished.
Better SEO provides you with feedback directly in VSCode, so you can produce high-quality content that gets found by search engines.

## Features

Better SEO expects some meta information in your Markdown file:

```
---
keywords:
    - Search Engines
    - Better SEO
    - Get found online
seo_title: How to get found online
seo_description: Getting found online means organic traffic.
---
# How to get found online - A guide with examples
```

An article needs a `seo_title` and `seo_description`. These are the equivalent fields for `SEO TITLE` and `SEO/Meta Description` on your blog. Also, if you're using any keyword research tools such as [Google Keyword Planner](https://ads.google.com/home/tools/keyword-planner/), [ahrefs](ahrefs.com) or [SEMRush](https://www.semrush.com/), use `keywords` to keep track of your keywords for this article.

### How to use it

Open the Better SEO View in the Activity Bar on the Left-hand side.

![Better SEO in the Sidebar](resources/sidebar.png)

Once the View opened, click the Refresh Button in the top-right corner to start the analysis:

![refresh button](resources/refresh_button.png)

If you have the `keywords` key in your Markdown file, Better SEO will use the keywords in your file for the analysis. Once the analysis is completed, you will see the results in the TreeView:

![Analysis Results](resources/analysis_results.png)

### What it validates

- The blog post's title (The first occurrence of a first-level headline)
- Does the keyword occur in `seo_title`?
- Does the keyword occur in `seo_description`?
- The text length of `seo_title`
- The text length of `seo_description`
- Headline structure

### Configuration

By default, Better SEO looks for `seo_title` and `seo_description` within the blogpost's front-matter. If you use different field names in your front-matter, you can configure those via VSCode's settings. Use the following command:


- On Windows/Linux - __File > Preferences > Settings__
- On macOS - __Code > Preferences > Settings__

Then, search for `BetterSEO`:

![Better SEO Settings Screenshot](resources/settings_screenshot.png)

Now, you can configure different values for both `seo_title` and `seo_description`.

## Release Notes

Check out [GitHub Releases](https://github.com/schultyy/better-seo/releases).

## License

MIT
