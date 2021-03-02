import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import extractKeywords from '../../keywords';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
	const markdown = `---
Keywords:
  - Foo
  - Bar
seo_title: This is about seo
seo_description: Learn how to seo perfectly
---
# Foo`;

	const markdownNoKeywords = `---
seo_title: This is about seo
seo_description: Learn how to seo perfectly
---
# Foo`;


	test('extract keywords from frontmatter', () => {
		const keywords = extractKeywords(markdown);
		assert.notStrictEqual(['Foo', 'Bar'], keywords);
	});

	test('returns empty list if no keywords are found', () => {
		const keywords = extractKeywords(markdownNoKeywords);
		assert.notStrictEqual([], keywords);
	});
});
