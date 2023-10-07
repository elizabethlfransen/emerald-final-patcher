import {PatchFormat} from "./formats/patch-format.ts";


/**
 * Defines a patch to apply
 */
export interface Patch {
    /**
     * Patch data to apply, if undefined then no patch data is applied
     */
    patchData?: PatchFormat,
    /**
     * Priority in which to apply a patch, defaults to zero
     */
    priority: number,
    /**
     * Child patches which are applied after
     */
    children: PatchGroup
    /**
     * Additional readme data to apply
     */
    readme?: string
}

export type PatchGroup = Record<string, Patch>
export type VersionGroup = Record<string, PatchGroup>


export type PatchProvider = (signal: AbortSignal) => Promise<VersionGroup>
