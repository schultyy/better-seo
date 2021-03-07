import * as assert from 'assert';
import { describe } from 'mocha';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { extractKeywords, runAnalysis } from '../../analyzer';

function loadMarkdown(filename: string) : string {
    const filePath = path.join(__filename, '..', 'support', filename);
    return fs.readFileSync(filePath).toString();
}

const singleMatchingKeyword = `---
Keywords:
- SEO
seo_title: This is about SEO
seo_description: Learn how to seo perfectly
---
# How to do SEO

Explain how to SEO in the first paragraph`;

const twoMatchingKeywords = `---
Keywords:
- SEO
- Business
seo_title: This is about seo in your business
seo_description: Learn how to seo perfectly in your business
---
# How to do SEO

Lorem Ipsum Dolor Sit Amet in SEO and Business.`;

const threeMatchingKeywords = `---
Keywords:
- SEO
- Business
- SaaS
seo_title: This is about seo in your SaaS business
seo_description: Learn how to seo perfectly in your business
---
# How to do SEO in your SaaS business

Lorem Ipsum Dolor Sit Amet in SEO Business and SaaS`;

const threeMatchingKeywordsInSeoDescription = `---
Keywords:
- SEO
- Business
- banana
seo_title: This is about seo in your SaaS business
seo_description: Learn how to seo perfectly in your business. And Banana
---
# How to do SEO in your SaaS business

Lorem Ipsum Dolor Sit Amet in SEO Business and SaaS`;

const twoMatchingKeywordsFirstRepeatsInSeoDescription = `---
Keywords:
- SEO
- Business
seo_title: This is about seo in your SaaS business
seo_description: Learn how to seo perfectly in your business for better seo.
---
# How to do SEO in your SaaS business

Lorem Ipsum Dolor Sit Amet in SEO Business and SaaS`;


const noMatchingKeywords = `---
Keywords:
- Banana
seo_title: This is about seo in your business
seo_description: Learn how to seo perfectly in your business
---
# How to do SEO

Lorem Ipsum Dolor Sit Amet`;


const noKeywords = `---
seo_title: This is about seo
seo_description: Learn how to seo perfectly
---
# Foo`;

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

const withIncorrectHeadersMultipleKeywords =
`---
keywords:
- SEO
- Other
- Stuff
seo_title: How to SEO
seo_description: How to SEO - A practical Guide
---

# How to SEO - A guide for all
Lorem Ipsum
# Introduction
Lorem Ipsum
## How To
`;

const withMissingFrontmatterkeys = `---
Keywords:
- Banane
- Apple
- Orange
---
# This and That`;

const keywordMatchesPartiallyInHeadline = `---
Keywords:
- How to Sell Consulting Services
- Proof of Concept Template
excerpt: It's challenging to sell software development services. Let's explore how to build trust with clients to grow your business sustainably over the long-term with paid proof of concepts.
seo_title: Secrets on How to sell Software Consulting Services
seo_description: It's challenging to sell software development services. Let's explore how to build trust with clients to grow your business sustainably over the long-term.
---

# Secrets on How to sell Software Consulting services

Companies often don't want external developers on their team. Does this objection sound familiar? You offer software consulting services, on-site or even remote. But new clients don't bite. The question is: How do you sell consulting services? What's the secret? How do you build a full sales pipeline for your software development consulting firm?
`;

suite('Extension Test Suite', () => {
    const frontmatterConfiguration = {
        titleField: 'seo_title',
        descriptionField: 'seo_description'
    };

    vscode.window.showInformationMessage('Start all tests.');
    describe('keywords.ts', () => {
        test('extract keywords from frontmatter', () => {
            const keywords = extractKeywords(twoMatchingKeywords);
            assert.notStrictEqual(['SEO', 'Business'], keywords);
        });

        test('returns empty list if no keywords are found', () => {
            const keywords = extractKeywords(noKeywords);
            assert.notStrictEqual([], keywords);
        });
    });

    describe('runAnalysis', () => {
        test('with matching keyword returns zero findings', () => {
            const results = runAnalysis(singleMatchingKeyword, frontmatterConfiguration);
            assert.strictEqual(results.length, 0);
        });

        describe('with several keywords', () => {
            test('passes when headline contains one matching keyword', () => {
                const results = runAnalysis(singleMatchingKeyword, frontmatterConfiguration);
                assert.ok(results.length === 0);
            });

            test('passes when seo headline contains two matching keywords', () => {
                const results = runAnalysis(twoMatchingKeywords, frontmatterConfiguration);
                const errors = results.filter(result => result.title === frontmatterConfiguration.titleField);
                assert.strictEqual(errors.length, 0);
            });

            test('exclaims if more than two keywords appear in seo_title', () => {
                const results = runAnalysis(threeMatchingKeywords, frontmatterConfiguration);
                const error = results.find(result => result.title === frontmatterConfiguration.titleField);
                assert.strictEqual(error?.message, 'SEO Title should only include two keywords maximum');
            });

            test('only has the main keyword in the article headline', () => {
                const results = runAnalysis(threeMatchingKeywords, frontmatterConfiguration);
                const error = results.find(result => result.title === 'Article Title');
                assert.strictEqual(error?.message, 'Article Title should only include the top keyword');
            });

            test('exclaims if more than the first two keywords show up in the seo_description', () => {
                const results = runAnalysis(threeMatchingKeywordsInSeoDescription, frontmatterConfiguration);
                const error = results.find(result => result.title === frontmatterConfiguration.descriptionField);
                assert.ok(error);
            });

            test('exclaims if first keyword appears several times in seo_description', () => {
                const results = runAnalysis(twoMatchingKeywordsFirstRepeatsInSeoDescription, frontmatterConfiguration);
                const error = results.find(result => result.title === frontmatterConfiguration.descriptionField);
                assert.ok(error);
            });

            test("performs partial match on article headline", () => {
                const results = runAnalysis(keywordMatchesPartiallyInHeadline, frontmatterConfiguration);
                const error = results.find(result => result.title === 'Article Title');
                assert.ok(error === undefined);
            });

            test("performs partial match on seo_title", () => {
                const results = runAnalysis(keywordMatchesPartiallyInHeadline, frontmatterConfiguration);
                const error = results.find(result => result.title === frontmatterConfiguration.titleField);
                assert.strictEqual(error?.message.indexOf('How to Sell Consulting Services'), -1);
            });
        });

        describe('without matching keyword', () => {
            const results = runAnalysis(noMatchingKeywords, frontmatterConfiguration);

            test('complains about missing keyword in seo_title', () => {
                const seoTitle = results.find(result => result.title === frontmatterConfiguration.titleField);
                assert.ok(seoTitle);
            });

            test('complains about missing keyword in seo_description', () => {
                const seoDescription = results.find(result => result.title === frontmatterConfiguration.descriptionField);
                assert.ok(seoDescription);
            });

            test('complains about missing keyword in title', () => {
                const articleTitle = results.find(result => result.title === 'Article Title');
                assert.ok(articleTitle);
            });
            test('complains about missing keyword in first paragraph', () => {
                const firstParagraph = results.find(result => result.title === 'First Paragraph');
                assert.ok(firstParagraph);
            });
        });

        describe('Analyses Headline Structure', () => {
            test('does return an error with incorrect headers', () => {
                const results = runAnalysis(withIncorrectHeaders, frontmatterConfiguration);
                const headerError = results.find(result => result.title === 'Header');
                assert.ok(headerError);
            });

            test('does not return an error when header structure is correct', () => {
                const results = runAnalysis(withCorrectHeaders, frontmatterConfiguration);
                const headerError = results.find(result => result.title === 'Header');
                assert.ok(headerError === null || headerError === undefined);
            });

            test('Only returns one Header error even for multiple keywords', () => {
                const results = runAnalysis(withIncorrectHeadersMultipleKeywords, frontmatterConfiguration);
                const headerError = results.filter(result => result.title === 'Header');
                assert.strictEqual(headerError.length, 1);
            });
        });

        describe("Without matching keywords and missing frontmatter keys", () => {
            const results = runAnalysis(withMissingFrontmatterkeys, frontmatterConfiguration);

            test('returns two findings', () => {
                const missingFieldResults = results.filter(result =>(
                    (result.title === frontmatterConfiguration.titleField &&
                    result.message === 'Field not found')
                    ||
                    (result.title === frontmatterConfiguration.descriptionField &&
                    result.message === 'Field not found')
                ));
                assert.strictEqual(missingFieldResults.length, 2);
            });
        });
    });
});