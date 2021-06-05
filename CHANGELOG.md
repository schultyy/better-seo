# Change Log

## 2.0.1

- Add additional explanation about the plugin and how to use it.

## 2.0.0

- Allows for the Blogpost's title to be configured in either the first-level headline or the frontmatter (field is configurable)
- Breaking change: Changes configuration field names to be more specific to accommodate for new title field.

## 1.8.2

- Fixes an issue where analysis would silently fail if `Keywords:` within Frontmatter was empty.
- Requires vscode `1.56.0`

## 1.8.1

- Updates the change log file with all previous release information

## 1.8.0

- Requires vscode `1.55.0`.
- Validates Article Length (see [#71](https://github.com/schultyy/better-seo/pull/71))
- Fixes an issue where the validator would count the total number of characters in a paragraph instead of the total number of words (see [#71](https://github.com/schultyy/better-seo/pull/71))

## 1.7.1

Fixing Links in README so screenshots are visible in the VSCode marketplace. See [#62](https://github.com/schultyy/better-seo/pull/62) for details.

## 1.7.0

- Improved error messages for multiple first-level headlines
- Allow users to click on locations and move cursor directly to the position

See [#54](https://github.com/schultyy/better-seo/pull/54) for details.


## 1.6.0

Add mdx as supported file extension (See [#42](https://github.com/schultyy/better-seo/pull/42)) Thank you [@phartenfeller](https://github.com/phartenfeller)!

## 1.5.0

This release ships with a new validator to ensure paragraph length. See [#14](https://github.com/schultyy/better-seo/issues/14) for more details.
Also increasing the required VSCode version to 1.54.

## 1.4.0

This release ships with more sophisticated keyword analysis for frontmatter and the article header.

- If the user has several keywords configured, only the top two keyword should appear in `seo_title`.
- If the user has several keywords configured, only the top one should appear in the article title.
- If the user has several keywords configured, only the top two should appear in `seo_description`.
- Makes sure the top keyword doesn't appear more than once in `seo_description`.
- We partially match the keyword in `seo_title` and the article title.

See ticket [#5](https://github.com/schultyy/better-seo/issues/5) and PR [#18](https://github.com/schultyy/better-seo/pull/18)


## 1.3.0

Ships with new Icons [#16](https://github.com/schultyy/better-seo/pull/16)

## 1.2.1

Resolves a problem where treeview items wouldn't collapse. See [#15](https://github.com/schultyy/better-seo/pull/15) for details

## 1.2.0

Allows users to configure frontmatter field identifiers for title and descriptions.

## 1.1.0

- Comes with a new view and commands
- More Icons
- Fixed validation structures
- Header Validation

## 1.0.1

Initial Release