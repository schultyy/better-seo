import { Location } from "./ast";

export enum ResultType {
    frontmatter,
    body
}

export abstract class AnalyzerResult {
    constructor(public title: string, public message: string, public resultType: ResultType) {}
}

export class AnalyzerError extends AnalyzerResult {
    constructor(public title: string, public message: string, public resultType: ResultType) {
        super(title, message, resultType);
    }
}

export class ParagraphError extends AnalyzerError {
    constructor(
        public title: string,
        public loc: Location,
        public message: string,
        public resultType: ResultType) {
            super(title, message, resultType);
    }
}

export class HeaderError extends AnalyzerError {
    constructor(
        public title: string,
        public loc: Location,
        public message: string,
        public resultType: ResultType) {
            super(title, message, resultType);
        }
}