export declare class ResponseExtras {
    transfers: Transferable[];
    addTransfer(...transfers: Transferable[]): void;
}
export interface HistogramInfo {
    name?: string;
    id: number;
}
/**
 * Defines a request and optionally a corresponding response messages.
 */
export interface RequestDef {
    name: string;
    request?: unknown;
    response?: unknown;
    histogram?: HistogramInfo;
}
export interface InterfaceDef {
    name: string;
    methods: readonly RequestDef[];
    methodMap?: Map<string, RequestDef>;
}
export type InterfaceDefMethods<I extends InterfaceDef> = {
    [M in I['methods'][number] as M['name']]: M;
};
export declare function defMessage<T extends (CheckStructuredClonable<T> extends never ? unknown : never)>(): T;
export declare function defInterface<const T extends InterfaceDef>(def: T): T;
export type ValidateRequestMap<T extends {
    [K in keyof T]: RequestDef;
}> = T;
type AllValues<T> = T[keyof T];
type ArrayElement<ArrayType extends unknown[]> = ArrayType extends Array<infer ElementType> ? ElementType : never;
type TransferableTypes = ArrayBuffer | Blob;
type StructuredClonableBasicType = string | boolean | number | void | undefined | null | Date;
export type CheckStructuredClonable<T> = T extends StructuredClonableBasicType ? never : T extends unknown[] ? CheckStructuredClonable<ArrayElement<T>> : T extends Map<infer K, infer V> ? (CheckStructuredClonable<K> & CheckStructuredClonable<V>) : T extends Function ? [
    'Function not structured cloneable',
    T
] : T extends Promise<unknown> ? ['Promise not structured cloneable', T] : CheckStructuredClonableObject<T>;
export type CheckStructuredClonableObject<T> = T extends TransferableTypes ? never : AllValues<{
    [K in keyof T]-?: CheckStructuredClonable<T[K]>;
}>;
export type ReplaceProperties<A, B> = {
    [K in keyof A | keyof B]: K extends keyof B ? B[K] : K extends keyof A ? A[K] : never;
};
export type RequestPayload<M, T extends keyof M> = M[T] extends {
    request: infer R;
} ? R : undefined;
export type ResponsePayload<M, T extends keyof M> = M[T] extends {
    response: infer R;
} ? R : void;
type Promisify<T> = T extends void ? void : Promise<T>;
export type MessageHandlerInterface<I extends InterfaceDef> = {
    [Property in keyof InterfaceDefMethods<I>]: (payload: RequestPayload<InterfaceDefMethods<I>, Property>, extras: ResponseExtras) => Promisify<ResponsePayload<InterfaceDefMethods<I>, Property>>;
};
export declare function assertNever<_T extends never>(): void;
export {};
