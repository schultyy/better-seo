import * as assert from 'assert';
import { describe } from 'mocha';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { FileAnalyzer, FrontmatterAnalyzer } from '../../analyzer';
import extractKeywords from '../../keywords';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
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
# How to do SEO`;
		describe('FileAnalyzer', () => {
			describe('With matching Keyword', () => {
				const analyzer = new FileAnalyzer(markdown);
				const results = analyzer.analyze("SEO");

				test('returns zero findings', () => {
					assert.strictEqual(results.length, 0);
				});
			});
		});
		describe('FrontmatterAnalyzer', () => {
			describe('With matching Keyword', () => {
				const analyzer = new FrontmatterAnalyzer(markdown);
				const results = analyzer.analyze("SEO");

				test('returns zero findings', () => {
					assert.strictEqual(results.length, 0);
				});
			});
			describe("Without matching keyword", () => {
				const analyzer = new FrontmatterAnalyzer(markdown);
				const results = analyzer.analyze("Banana");

				test("returns 2 findings", () => {
					assert.strictEqual(results.length, 2);
				});

				test("complains about missing keyword in seo_title", () => {
					const result = results.find(result => result.title === 'seo_title');
					assert.strictEqual(result?.title, 'seo_title');
				});

				test("complains about missing keyword in seo_description", () => {
					const result = results.find(result => result.title === 'seo_description');
					assert.strictEqual(result?.title, 'seo_description');
				});
			});
		});
	});
});
