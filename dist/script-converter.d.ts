import { Script } from "./model";
/**
 * TODO:
 * - parse and convert restrictions
 */
export declare class ScriptConverter {
    parseScript(scriptStr: string): Script;
    generateScript(script: Script): string;
    protected scriptToObject(scriptStr: string): Record<string, any>;
    protected coerceTypes(obj: Record<string, any>): Record<string, any>;
    protected parseGroups(obj: Record<string, any>): Script;
    protected convertGroups(scriptObj: Record<string, any>): Record<string, any>;
    protected stringifyScriptObj(obj: Record<string, any>, depth?: number): string;
}
