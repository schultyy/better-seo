export interface Position {
    line: number;
    column: number;
}

export interface Location {
    start: Position;
    end: Position;
}

export interface AstChild {
    type: string;
    value: string;
    raw: string;
    depth?: number;
    loc: Location;
    children?: Array<AstChild>;
}