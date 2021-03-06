import * as assert from 'assert';
import { describe } from 'mocha';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { extractKeywords, FileAnalyzer, FrontmatterAnalyzer } from '../../analyzer';

suite('Extension Test Suite', () => {
    const frontmatterConfiguration = {
        titleField: 'seo_title',
        descriptionField: 'seo_description'
    };

    const markdown = `---
Keywords:
- Foo
- Bar
seo_title: This is about seo
seo_description: Learn how to seo perfectly
---
# How to do SEO`;

    const markdownNoKeywords = `---
seo_title: This is about seo
seo_description: Learn how to seo perfectly
---
# Foo`;

    vscode.window.showInformationMessage('Start all tests.');
    describe('keywords.ts', () => {

        test('extract keywords from frontmatter', () => {
            const keywords = extractKeywords(markdown);
            assert.notStrictEqual(['Foo', 'Bar'], keywords);
        });

        test('returns empty list if no keywords are found', () => {
            const keywords = extractKeywords(markdownNoKeywords);
            assert.notStrictEqual([], keywords);
        });
    });

    describe('analyzer.ts', () => {
        const markdown = `---
Keywords:
- SEO
seo_title: This is about seo
seo_description: Learn how to seo perfectly
---
# How to do SEO

Lorem Ipsum Dolor Sit Amet with SEO And among Other Things.


This, that something, else. Dolor Sit Amet.`;

        describe('FileAnalyzer', () => {
            describe('With matching Keyword', () => {
                const analyzer = new FileAnalyzer(markdown);
                const results = analyzer.analyze(["SEO"]);

                test('returns zero findings', () => {
                    assert.strictEqual(results.length, 0);
                });
            });

            describe('Without matching Keyword', () => {
                const analyzer = new FileAnalyzer(markdown);
                const results = analyzer.analyze(["Banana"]);

                test('returns two findings', () => {
                    assert.strictEqual(results.length, 2);
                });

                test('complains about missing keyword in title', () => {
                    const result = results.find(result => result.title === 'Article Title');
                    assert.strictEqual(result?.title, 'Article Title');
                });

                test('complains about missing keyword in first paragraph', () => {
                    const result = results.find(result => result.title === 'First Paragraph');
                    assert.strictEqual(result?.title, 'First Paragraph');
                });
            });

            describe("Analyze Headline Structure", () => {
                const withCorrectHeaders =
`---
keywords:
- SEO
seo_title: How to SEO
seo_description: How to SEO - A practical Guide
---
# How to SEO - A guide for all
Lorem Ipsum
## Introduction
Lorem Ipsum
## How To
Lorem Ipsum
`;
                const withIncorrectHeaders =
`---
keywords:
- SEO
seo_title: How to SEO
seo_description: How to SEO - A practical Guide
---

# How to SEO - A guide for all
Lorem Ipsum
# Introduction
Lorem Ipsum
## How To
`;
                test('does return an error with incorrect headers', () => {
                    const analyzer = new FileAnalyzer(withIncorrectHeaders);
                    const results = analyzer.analyze(["SEO"]);
                    const headerError = results.find(result => result.title === 'Header');
                    assert.ok(headerError);
                });

                test('does not return an error when header structure is correct', () => {
                    const analyzer = new FileAnalyzer(withCorrectHeaders);
                    const results = analyzer.analyze(["SEO"]);
                    const headerError = results.find(result => result.title === 'Header');
                    assert.ok(headerError === null || headerError === undefined);
                });

                test('Only returns one Header error even for multiple keywords', () => {
                    const analyzer = new FileAnalyzer(withIncorrectHeaders);
                    const results = analyzer.analyze(["SEO", "Apple", "Banana"]);
                    const headerError = results.filter(result => result.title === 'Header');
                    assert.strictEqual(headerError.length, 1);
                });
            });
        });
        describe('FrontmatterAnalyzer', () => {
            describe('With matching single Keyword', () => {
                const analyzer = new FrontmatterAnalyzer(markdown, frontmatterConfiguration);
                const results = analyzer.analyze(["SEO"]);

                test('returns zero findings', () => {
                    assert.strictEqual(results.length, 0);
                });
            });
            describe("Without matching keyword", () => {
                const analyzer = new FrontmatterAnalyzer(markdown, frontmatterConfiguration);
                const results = analyzer.analyze(["Banana"]);

                test("returns 2 findings", () => {
                    assert.strictEqual(results.length, 2);
                });

                test("complains about missing keyword in seo_title", () => {
                    const result = results.find(result => result.title === frontmatterConfiguration.titleField);
                    assert.strictEqual(result?.title, frontmatterConfiguration.titleField);
                });

                test("complains about missing keyword in seo_description", () => {
                    const result = results.find(result => result.title === frontmatterConfiguration.descriptionField);
                    assert.strictEqual(result?.title, frontmatterConfiguration.descriptionField);
                });
            });
            describe("Without matching keywords and missing frontmatter keys", () => {
                const file = `---
Keywords:
- Banane
- Apple
- Orange
---
# This and That`;
                const analyzer = new FrontmatterAnalyzer(file, frontmatterConfiguration);
                const results = analyzer.analyze(["Banana", "Apple", "Orange"]);

                test('returns two findings', () => {
                    assert.strictEqual(results.length, 2);
                });
            });
        });
    });
});
