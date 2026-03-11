export interface NumBoundaries {
    min?: number;
    max?: number;
    exclusiveMin?: boolean;
    exclusiveMax?: boolean;
}
export declare const checkBoundaries: (value: unknown, { min, max, exclusiveMax, exclusiveMin }?: NumBoundaries) => boolean;
