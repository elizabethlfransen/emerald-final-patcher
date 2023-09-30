import { AppFormData } from "./form.tsx";
import { IPS } from "./rom-patcher/formats/ips.ts";
import { MarcFile } from "./rom-patcher/marc-file.ts";
import axios from "axios";

const ROOT_URL = "https://raw.githubusercontent.com/elizabethlfransen/emerald-final-patches/main/";

export const VERSION = "7.41"



async function getIPSPatch(path: string[], signal: AbortSignal): Promise<IPS> {
    signal.throwIfAborted();
    const url = ROOT_URL + [VERSION, ...path].map(x => encodeURIComponent(x)).join("/");
    const patchDataResponse = (await axios.get<ArrayBuffer>(url, {
        signal: signal,
        responseType: 'arraybuffer',
    }));
    if (signal.aborted)
        signal.throwIfAborted();
    return IPS.parseIPSFile(MarcFile.fromArrayBuffer(patchDataResponse.data));
}

function getLegacyVariant(data: AppFormData, signal: AbortSignal): Promise<IPS> {
    const root = "Legacy Variant";
    switch(data.variant) {
        case "newWilds":
            return getIPSPatch([root, `Legacy v${VERSION} - New Wilds.ips`], signal);
        case "vanillaWilds":
            return getIPSPatch([root, `Legacy v${VERSION} - Vanilla Wilds.ips`], signal);
        case "vanillaWildsPlus":
            return getIPSPatch([root, `Legacy v${VERSION} - Vanilla Wilds Plus.ips`], signal);
    }
    throw new Error("Invalid variant");
}

function getDeluxeVariant(data: AppFormData, signal: AbortSignal): Promise<IPS> {
    const root = "Deluxe Variant";
    let expShareRoot;
    if(data.expShare) {
        expShareRoot = `Deluxe With Gen VI Exp Share`
    } else {
        expShareRoot = "Deluxe No Gen VI Exp Share"
    }
    const path = [root, expShareRoot];
    // make with lowercase
    expShareRoot.replace("With", "with");
    switch (data.variant) {
        case 'newWilds':
            path.push(`${expShareRoot}.ips`);
            break;
        case 'vanillaWilds':
            path.push(`${expShareRoot} - Vanilla Wilds.ips`);
            break;
        case 'vanillaWildsPlus':
            path.push(`${expShareRoot} - Vanilla Wilds Plus.ips`);
            break;
    }
    return getIPSPatch(path, signal);
}


function getVariant(data: AppFormData, signal: AbortSignal): Promise<IPS> {
    if (data.base == "legacy") {
        return getLegacyVariant(data, signal);
    }
    if (data.base == "deluxe") {
        return getDeluxeVariant(data, signal);
    }
    throw new Error('Invalid variant.');
}

export async function patchRom(data: AppFormData, signal: AbortSignal) {
    // await applyVariant(data, romFile, signal);
    console.log(await getVariant(data, signal));
}