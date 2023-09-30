import {Patch} from "./form.tsx";

enum PatchMethod {
    IPS,
    UPS
}

interface PatchToApply {
    key: string,
    method: PatchMethod,
    url: string,
    priority: number,
}

export class Patcher {
    private readonly _basePath: string;
    public currentPath: string[] = [];
    private _patchesToApply: PatchToApply[] = [];

    constructor(basePath?: string) {
        this._basePath = basePath ?? `${import.meta.env.BASE_URL}patches/7.4.1/`
    }

    private resolveFile(fileName: string): string {
        return this._basePath + '/' + [...this.currentPath, fileName].map(x => encodeURIComponent(x)).join("/");
    }

    addIps(fileNameWithoutExtension: string, priority: number, key: string = fileNameWithoutExtension) {
        this._patchesToApply.push({
            method: PatchMethod.IPS,
            url: this.resolveFile(`${fileNameWithoutExtension}.ips`),
            priority,
            key
        });
    }
    pushPath(path: string) {
        this.currentPath.push(path);
    }
    getPatch(key: string): PatchToApply | undefined {
        return this._patchesToApply.find(v => v.key === key);
    }
    removePatch(key: string) {
        this._patchesToApply = this._patchesToApply.filter(v => v.key !== key);
    }
}