import * as assert from 'assert';
import { describe } from 'mocha';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { extractKeywords, runAnalysis } from '../../analyzer';
import { ParagraphError, ResultType } from '../../analyzer/errors';

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

Lorem ipsum dolor sit amet SEO,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim tortor at auctor urna nunc id. Nibh sed pulvinar proin gravida hendrerit. Dolor magna eget est lorem ipsum dolor sit amet. Massa id neque aliquam vestibulum morbi blandit cursus. Dolor magna eget est lorem. Dolor purus non enim praesent elementum facilisis leo vel fringilla. Facilisis volutpat est velit egestas. Eget egestas purus viverra accumsan in nisl. Pellentesque nec nam aliquam sem. Enim praesent elementum facilisis leo vel fringilla est. Est ullamcorper eget nulla facilisi etiam dignissim diam quis enim. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus. Faucibus ornare suspendisse sed nisi lacus. Leo vel orci porta non pulvinar neque laoreet suspendisse interdum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim tortor at auctor urna nunc id. Nibh sed pulvinar proin gravida hendrerit. Dolor magna eget est lorem ipsum dolor sit amet. Massa id neque aliquam vestibulum morbi blandit cursus. Dolor magna eget est lorem. Dolor purus non enim praesent elementum facilisis leo vel fringilla. Facilisis volutpat est velit egestas. Eget egestas purus viverra accumsan in nisl. Pellentesque nec nam aliquam sem. Enim praesent elementum facilisis leo vel fringilla est. Est ullamcorper eget nulla facilisi etiam dignissim diam quis enim. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus. Faucibus ornare suspendisse sed nisi lacus. Leo vel orci porta non pulvinar neque laoreet suspendisse interdum. Placerat vestibulum lectus mauris ultrices eros.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim tortor at auctor urna nunc id. Nibh sed pulvinar proin gravida hendrerit. Dolor magna eget est lorem ipsum dolor sit amet. Massa id neque aliquam vestibulum morbi blandit cursus. Dolor magna eget est lorem. Dolor purus non enim praesent elementum facilisis leo vel fringilla. Facilisis volutpat est velit egestas. Eget egestas purus viverra accumsan in nisl. Pellentesque nec nam aliquam sem. Enim praesent elementum facilisis leo vel fringilla est. Est ullamcorper eget nulla facilisi etiam dignissim diam quis enim. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus. Faucibus ornare suspendisse sed nisi lacus. Leo vel orci porta non pulvinar neque laoreet suspendisse interdum. Placerat vestibulum lectus mauris ultrices eros. `;

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


const emptyKeywords = `---
Keywords:
seo_title: This is about seo
seo_description: Learn how to seo perfectly
---
# Foo

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim tortor at auctor urna nunc id. Nibh sed pulvinar proin gravida hendrerit. Dolor magna eget est lorem ipsum dolor sit amet. Massa id neque aliquam vestibulum morbi blandit cursus. Dolor magna eget est lorem. Dolor purus non enim praesent elementum facilisis leo vel fringilla. Facilisis volutpat est velit egestas. Eget egestas purus viverra accumsan in nisl. Pellentesque nec nam aliquam sem. Enim praesent elementum facilisis leo vel fringilla est. Est ullamcorper eget nulla facilisi etiam dignissim diam quis enim. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus. Faucibus ornare suspendisse sed nisi lacus. Leo vel orci porta non pulvinar neque laoreet suspendisse interdum. Placerat vestibulum lectus mauris ultrices eros. Facilisis volutpat est velit egestas dui id ornare arcu odio. Tortor condimentum lacinia quis vel eros donec ac.

Consectetur a erat nam at lectus. Vivamus at augue eget arcu dictum varius. Malesuada proin libero nunc consequat interdum varius. Placerat vestibulum lectus mauris ultrices eros in cursus. Lacus sed turpis tincidunt id aliquet risus feugiat in. At quis risus sed vulputate odio ut. Semper feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Aliquam sem fringilla ut morbi tincidunt augue interdum velit. Diam ut venenatis tellus in metus vulputate eu. Nisi lacus sed viverra tellus. Parturient montes nascetur ridiculus mus mauris vitae ultricies leo integer. Massa id neque aliquam vestibulum morbi blandit cursus risus at. Amet justo donec enim diam vulputate ut pharetra sit. Vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam. Amet massa vitae tortor condimentum lacinia quis vel eros. Sit amet nulla facilisi morbi tempus. Tortor vitae purus faucibus ornare suspendisse sed. Arcu cursus vitae congue mauris rhoncus aenean. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Ligula ullamcorper malesuada proin libero nunc consequat interdum varius sit.

Habitant morbi tristique senectus et netus et. Quis eleifend quam adipiscing vitae proin sagittis. Porta non pulvinar neque laoreet. Egestas pretium aenean pharetra magna ac placerat vestibulum lectus mauris. Pulvinar mattis nunc sed blandit libero volutpat sed. Interdum varius sit amet mattis vulputate enim. Praesent tristique magna sit amet purus gravida quis blandit turpis. Fermentum odio eu feugiat pretium. Egestas congue quisque egestas diam in arcu. Metus aliquam eleifend mi in. Vivamus arcu felis bibendum ut tristique et. Aliquam ultrices sagittis orci a. At in tellus integer feugiat. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum. Vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet. Urna porttitor rhoncus dolor purus non. Ut diam quam nulla porttitor. Dolor sit amet consectetur adipiscing elit pellentesque habitant. Sed viverra tellus in hac.

Ut faucibus pulvinar elementum integer enim. Sit amet volutpat consequat mauris nunc congue nisi. Cursus mattis molestie a iaculis at erat pellentesque adipiscing. Pulvinar etiam non quam lacus suspendisse. Libero justo laoreet sit amet cursus sit. Vivamus at augue eget arcu dictum varius. Vestibulum lorem sed risus ultricies tristique nulla. Vel fringilla est ullamcorper eget nulla. Purus sit amet volutpat consequat mauris nunc congue nisi. In hendrerit gravida rutrum quisque non. Vel pretium lectus quam id. Suscipit adipiscing bibendum est ultricies integer. Morbi tempus iaculis urna id volutpat lacus laoreet non curabitur. Consectetur a erat nam at lectus urna duis convallis convallis.

Enim lobortis scelerisque fermentum dui faucibus in ornare. Eget gravida cum sociis natoque. Enim ut sem viverra aliquet eget. Mattis rhoncus urna neque viverra justo nec ultrices dui sapien. Eget nunc scelerisque viverra mauris in aliquam sem. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Auctor augue mauris augue neque gravida in fermentum et. Aliquet bibendum enim facilisis gravida. In hac habitasse platea dictumst vestibulum rhoncus. Nibh nisl condimentum id venenatis a condimentum vitae sapien pellentesque.
`;

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

const extraLongHeadline = `---
Keywords:
- VSCode
seo_title: Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet fsdfdsfdsfsdfsdfdsf
seo_description: It's challenging to sell software development services. Let's explore how to build trust with clients to grow your business sustainably over the long-term.
---

# Building a VSCode SEO Plugin Lorem Ipsum Dolor Sit Amet

Lorem Ipsum Dolor Sit Amet. Lorem Ipsum Dolor Sit Amet. Lorem Ipsum Dolor Sit Amet.Lorem Ipsum Dolor Sit Amet.Lorem Ipsum Dolor Sit Amet.Lorem Ipsum Dolor Sit Amet.Lorem Ipsum Dolor Sit Amet.Lorem Ipsum Dolor Sit Amet.
`;

const extraLongParagraph = `---
Keywords:
- VSCode
seo_title: Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet fsdfdsfdsfsdfsdfdsf
seo_description: It's challenging to sell software development services. Let's explore how to build trust with clients to grow your business sustainably over the long-term.
---

# Building a VSCode SEO Plugin Lorem Ipsum Dolor Sit Amet

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus mauris a diam maecenas sed enim ut sem viverra. Lorem ipsum dolor sit amet consectetur adipiscing. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant. Ut consequat semper viverra nam. Varius sit amet mattis vulputate enim nulla aliquet porttitor. Proin sed libero enim sed faucibus turpis in eu. Velit laoreet id donec ultrices tincidunt arcu non. Egestas maecenas pharetra convallis posuere morbi leo urna molestie at. Vivamus at augue eget arcu dictum varius duis. Elementum tempus egestas sed sed risus pretium quam vulputate. Neque viverra justo nec ultrices dui sapien eget. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique. Et leo duis ut diam quam. Volutpat ac tincidunt vitae semper quis lectus nulla at. Integer quis auctor elit sed vulputate. Malesuada fames ac turpis egestas sed tempus urna. Euismod quis viverra nibh cras pulvinar mattis nunc sed blandit. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus mauris a diam maecenas sed enim ut sem viverra. Lorem ipsum dolor sit amet consectetur adipiscing. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant. Ut consequat semper viverra nam. Varius sit amet mattis vulputate enim nulla aliquet porttitor. Proin sed libero enim sed faucibus turpis in eu. Velit laoreet id donec ultrices tincidunt arcu non. Egestas maecenas pharetra convallis posuere morbi leo urna molestie at. Vivamus at augue eget arcu dictum varius duis. Elementum tempus egestas sed sed risus pretium quam vulputate. Neque viverra justo nec ultrices dui sapien eget. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique. Et leo duis ut diam quam. Volutpat ac tincidunt vitae semper quis lectus nulla at. Integer quis auctor elit sed vulputate. Malesuada fames ac turpis egestas sed tempus urna. Euismod quis viverra nibh cras pulvinar mattis nunc sed blandit.

Nisi est sit amet facilisis magna. Nisl pretium fusce id velit ut tortor pretium viverra suspendisse. Tellus molestie nunc non blandit. Urna et pharetra pharetra massa massa. Pretium nibh ipsum consequat nisl vel pretium lectus. Senectus et netus et malesuada. Morbi tristique senectus et netus et malesuada fames ac. Nibh tortor id aliquet lectus proin nibh nisl condimentum id. Varius sit amet mattis vulputate enim nulla. Semper feugiat nibh sed pulvinar. At urna condimentum mattis pellentesque id. Sollicitudin nibh sit amet commodo.
`;

const articleTooShort = `---
Keywords:
- VSCode
seo_title: Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet fsdfdsfdsfsdfsdfdsf
seo_description: It's challenging to sell software development services. Let's explore how to build trust with clients to grow your business sustainably over the long-term.
---

# Building a VSCode SEO Plugin Lorem Ipsum Dolor Sit Amet

Lorem ipsum dolor sit amet.
`;

const articleLengthAtLeast300Words = `---
Keywords:
- VSCode
seo_title: Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet fsdfdsfdsfsdfsdfdsf
seo_description: It's challenging to sell software development services. Let's explore how to build trust with clients to grow your business sustainably over the long-term.
---

# Building a VSCode SEO Plugin Lorem Ipsum Dolor Sit Amet

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim tortor at auctor urna nunc id. Nibh sed pulvinar proin gravida hendrerit. Dolor magna eget est lorem ipsum dolor sit amet. Massa id neque aliquam vestibulum morbi blandit cursus. Dolor magna eget est lorem. Dolor purus non enim praesent elementum facilisis leo vel fringilla. Facilisis volutpat est velit egestas. Eget egestas purus viverra accumsan in nisl. Pellentesque nec nam aliquam sem. Enim praesent elementum facilisis leo vel fringilla est. Est ullamcorper eget nulla facilisi etiam dignissim diam quis enim. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus. Faucibus ornare suspendisse sed nisi lacus. Leo vel orci porta non pulvinar neque laoreet suspendisse interdum. Placerat vestibulum lectus mauris ultrices eros. Facilisis volutpat est velit egestas dui id ornare arcu odio. Tortor condimentum lacinia quis vel eros donec ac.

Consectetur a erat nam at lectus. Vivamus at augue eget arcu dictum varius. Malesuada proin libero nunc consequat interdum varius. Placerat vestibulum lectus mauris ultrices eros in cursus. Lacus sed turpis tincidunt id aliquet risus feugiat in. At quis risus sed vulputate odio ut. Semper feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Aliquam sem fringilla ut morbi tincidunt augue interdum velit. Diam ut venenatis tellus in metus vulputate eu. Nisi lacus sed viverra tellus. Parturient montes nascetur ridiculus mus mauris vitae ultricies leo integer. Massa id neque aliquam vestibulum morbi blandit cursus risus at. Amet justo donec enim diam vulputate ut pharetra sit. Vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam. Amet massa vitae tortor condimentum lacinia quis vel eros. Sit amet nulla facilisi morbi tempus. Tortor vitae purus faucibus ornare suspendisse sed. Arcu cursus vitae congue mauris rhoncus aenean. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Ligula ullamcorper malesuada proin libero nunc consequat interdum varius sit.

Habitant morbi tristique senectus et netus et. Quis eleifend quam adipiscing vitae proin sagittis. Porta non pulvinar neque laoreet. Egestas pretium aenean pharetra magna ac placerat vestibulum lectus mauris. Pulvinar mattis nunc sed blandit libero volutpat sed. Interdum varius sit amet mattis vulputate enim. Praesent tristique magna sit amet purus gravida quis blandit turpis. Fermentum odio eu feugiat pretium. Egestas congue quisque egestas diam in arcu. Metus aliquam eleifend mi in. Vivamus arcu felis bibendum ut tristique et. Aliquam ultrices sagittis orci a. At in tellus integer feugiat. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum. Vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet. Urna porttitor rhoncus dolor purus non. Ut diam quam nulla porttitor. Dolor sit amet consectetur adipiscing elit pellentesque habitant. Sed viverra tellus in hac.

Ut faucibus pulvinar elementum integer enim. Sit amet volutpat consequat mauris nunc congue nisi. Cursus mattis molestie a iaculis at erat pellentesque adipiscing. Pulvinar etiam non quam lacus suspendisse. Libero justo laoreet sit amet cursus sit. Vivamus at augue eget arcu dictum varius. Vestibulum lorem sed risus ultricies tristique nulla. Vel fringilla est ullamcorper eget nulla. Purus sit amet volutpat consequat mauris nunc congue nisi. In hendrerit gravida rutrum quisque non. Vel pretium lectus quam id. Suscipit adipiscing bibendum est ultricies integer. Morbi tempus iaculis urna id volutpat lacus laoreet non curabitur. Consectetur a erat nam at lectus urna duis convallis convallis.

Enim lobortis scelerisque fermentum dui faucibus in ornare. Eget gravida cum sociis natoque. Enim ut sem viverra aliquet eget. Mattis rhoncus urna neque viverra justo nec ultrices dui sapien. Eget nunc scelerisque viverra mauris in aliquam sem. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Auctor augue mauris augue neque gravida in fermentum et. Aliquet bibendum enim facilisis gravida. In hac habitasse platea dictumst vestibulum rhoncus. Nibh nisl condimentum id venenatis a condimentum vitae sapien pellentesque.
`;

const withoutFirstLevelHeadline = `---
Keywords:
- VSCode
seo_title: Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet fsdfdsfdsfsdfsdfdsf
seo_description: It's challenging to sell software development services. Let's explore how to build trust with clients to grow your business sustainably over the long-term.
title: This and That with VSCode
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim tortor at auctor urna nunc id. Nibh sed pulvinar proin gravida hendrerit. Dolor magna eget est lorem ipsum dolor sit amet. Massa id neque aliquam vestibulum morbi blandit cursus. Dolor magna eget est lorem. Dolor purus non enim praesent elementum facilisis leo vel fringilla. Facilisis volutpat est velit egestas. Eget egestas purus viverra accumsan in nisl. Pellentesque nec nam aliquam sem. Enim praesent elementum facilisis leo vel fringilla est. Est ullamcorper eget nulla facilisi etiam dignissim diam quis enim. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus. Faucibus ornare suspendisse sed nisi lacus. Leo vel orci porta non pulvinar neque laoreet suspendisse interdum. Placerat vestibulum lectus mauris ultrices eros. Facilisis volutpat est velit egestas dui id ornare arcu odio. Tortor condimentum lacinia quis vel eros donec ac.

Consectetur a erat nam at lectus. Vivamus at augue eget arcu dictum varius. Malesuada proin libero nunc consequat interdum varius. Placerat vestibulum lectus mauris ultrices eros in cursus. Lacus sed turpis tincidunt id aliquet risus feugiat in. At quis risus sed vulputate odio ut. Semper feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Aliquam sem fringilla ut morbi tincidunt augue interdum velit. Diam ut venenatis tellus in metus vulputate eu. Nisi lacus sed viverra tellus. Parturient montes nascetur ridiculus mus mauris vitae ultricies leo integer. Massa id neque aliquam vestibulum morbi blandit cursus risus at. Amet justo donec enim diam vulputate ut pharetra sit. Vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam. Amet massa vitae tortor condimentum lacinia quis vel eros. Sit amet nulla facilisi morbi tempus. Tortor vitae purus faucibus ornare suspendisse sed. Arcu cursus vitae congue mauris rhoncus aenean. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Ligula ullamcorper malesuada proin libero nunc consequat interdum varius sit.

## This and That

Habitant morbi tristique senectus et netus et. Quis eleifend quam adipiscing vitae proin sagittis. Porta non pulvinar neque laoreet. Egestas pretium aenean pharetra magna ac placerat vestibulum lectus mauris. Pulvinar mattis nunc sed blandit libero volutpat sed. Interdum varius sit amet mattis vulputate enim. Praesent tristique magna sit amet purus gravida quis blandit turpis. Fermentum odio eu feugiat pretium. Egestas congue quisque egestas diam in arcu. Metus aliquam eleifend mi in. Vivamus arcu felis bibendum ut tristique et. Aliquam ultrices sagittis orci a. At in tellus integer feugiat. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum. Vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet. Urna porttitor rhoncus dolor purus non. Ut diam quam nulla porttitor. Dolor sit amet consectetur adipiscing elit pellentesque habitant. Sed viverra tellus in hac.

Ut faucibus pulvinar elementum integer enim. Sit amet volutpat consequat mauris nunc congue nisi. Cursus mattis molestie a iaculis at erat pellentesque adipiscing. Pulvinar etiam non quam lacus suspendisse. Libero justo laoreet sit amet cursus sit. Vivamus at augue eget arcu dictum varius. Vestibulum lorem sed risus ultricies tristique nulla. Vel fringilla est ullamcorper eget nulla. Purus sit amet volutpat consequat mauris nunc congue nisi. In hendrerit gravida rutrum quisque non. Vel pretium lectus quam id. Suscipit adipiscing bibendum est ultricies integer. Morbi tempus iaculis urna id volutpat lacus laoreet non curabitur. Consectetur a erat nam at lectus urna duis convallis convallis.

## Also to Consider

Enim lobortis scelerisque fermentum dui faucibus in ornare. Eget gravida cum sociis natoque. Enim ut sem viverra aliquet eget. Mattis rhoncus urna neque viverra justo nec ultrices dui sapien. Eget nunc scelerisque viverra mauris in aliquam sem. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Auctor augue mauris augue neque gravida in fermentum et. Aliquet bibendum enim facilisis gravida. In hac habitasse platea dictumst vestibulum rhoncus. Nibh nisl condimentum id venenatis a condimentum vitae sapien pellentesque.
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

        test('returns empty list if frontmatter keywords list is empty', () => {
            const keywords = extractKeywords(emptyKeywords);
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
                const errors = results.filter(result => result.title === frontmatterConfiguration.titleField);
                assert.ok(errors.length === 0);
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
                const errors = results.filter(result => result.title === frontmatterConfiguration.titleField);
                assert.strictEqual(errors.length, 0);
            });

            test('does not complain about second keyword in seo_title when more than keyword is present', () =>{
                const results = runAnalysis(keywordMatchesPartiallyInHeadline, frontmatterConfiguration);
                const error = results.find(result => result.title === frontmatterConfiguration.titleField);
                assert.ok(error === undefined);
            });

            test('does return a validation error for an extra-long headline', () => {
                const results = runAnalysis(extraLongHeadline, frontmatterConfiguration);
                const error = results.find(result => result.title === frontmatterConfiguration.titleField);
                assert.ok(error);
            });

            test('does return an error for an extra-long paragraph', () => {
                const results = runAnalysis(extraLongParagraph, frontmatterConfiguration);
                const error = <ParagraphError> results.find(result => result.title === 'Paragraph');
                assert.ok(error);
                assert.ok(error.loc);
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

            test('Returns one Header error for each first-level headline', () => {
                const results = runAnalysis(withIncorrectHeadersMultipleKeywords, frontmatterConfiguration);
                const headerError = results.filter(result => result.title === 'Header' && result.message.startsWith('Inconsistent Header Structure.'));
                assert.strictEqual(headerError.length, 2);
            });

            test('Does not return an error when first-level headline is missing and title is configured in Frontmatter', () => {
                const results = runAnalysis(withoutFirstLevelHeadline, frontmatterConfiguration);
                const headerError = results.filter(error => error.title === 'Article Title' && error.message === 'Not found');
                assert.strictEqual(headerError.length, 0);
            });
        });

        describe('Without matching keywords and missing frontmatter keys', () => {
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

        describe('Article length', () => {
            test('complains about article length if less than 300 words', () => {
                const results = runAnalysis(articleTooShort, frontmatterConfiguration);
                const validationResult = results.filter(result =>
                    result.title === 'Article Length'
                );

                assert.strictEqual(validationResult.length, 1);
                assert.strictEqual(validationResult[0].resultType, ResultType.body);
            });

            test('passes with at least 300 words', () => {
                const results = runAnalysis(articleLengthAtLeast300Words, frontmatterConfiguration);
                const validationResult = results.filter(result =>
                    result.title === 'Article Length'
                );

                assert.strictEqual(validationResult.length, 0);
            });
        });

        describe('With Empty Keyword List', () => {
            test('does not add keyword-related validation errors', () => {
                /*
                    Sometimes, we might want to write a blog post where we haven't performed any keyword
                    research and in those cases we don't want any complaints about missing keywords in article
                */
                const results = runAnalysis(emptyKeywords, frontmatterConfiguration);
                assert.strictEqual(results.length, 0);
            });
        });
    });
});