import {MarcFile} from "../marc-file.ts";

export interface PatchFormat {
    apply(romFile: MarcFile): MarcFile
}