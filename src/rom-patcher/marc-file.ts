/* MODDED VERSION OF MarcFile.js v20230202 - Marc Robledo 2014-2023 - http://www.marcrobledo.com/license */
import {saveAs} from "file-saver";


export class MarcFile {
    public littleEndian: boolean;
    public offset: number;
    private _lastRead: any;
    public fileName: string;
    public fileType: string;
    public fileSize: number;
    private _u8array: Uint8Array;


    public static async fromFile(source: File): Promise<MarcFile> {
        if (typeof window.FileReader !== 'function')
            throw new Error('Incompatible Browser');
        return new Promise((resolve, reject) => {

            const fileReader = new FileReader();
            fileReader.addEventListener('load', function () {
                const result = fileReader.result as ArrayBuffer | null;
                if (result == null) {
                    reject(Error("FileReader result was null"));
                    return;
                }
                resolve(new MarcFile(source.name, source.type, source.size, new Uint8Array(result)))
            }, false);

            fileReader.readAsArrayBuffer(source);
        })


    }

    public static fromMarcFile(source: MarcFile) {
        const result = new MarcFile(
            source.fileName,
            source.fileType,
            source.fileSize,
            new Uint8Array(source.fileSize)
        )
        source.copyToFile(result, 0);
        return result;
    }

    public static fromTypedArray(source: Uint8Array) {
        return new MarcFile(
            'file.bin',
            'application/octet-stream',
            source.byteLength,
            source
        )
    }

    public static fromArrayBuffer(source: ArrayBuffer): MarcFile {
        return MarcFile.fromTypedArray(new Uint8Array(source));
    }

    public static alloc(amount: number): MarcFile {
        return new MarcFile(
            'file.bin',
            'application/octet-stream',
            amount,
            new Uint8Array(amount)
        )
    }

    private constructor(fileName: string, fileType: string, fileSize: number, u8Array: Uint8Array) {
        this.littleEndian = false;
        this.offset = 0;
        this._lastRead = null;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this._u8array = u8Array;
    }

    static IS_MACHINE_LITTLE_ENDIAN = (function () {	/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView#Endianness */
        const buffer = new ArrayBuffer(2);
        new DataView(buffer).setInt16(0, 256, true /* littleEndian */);
        // Int16Array uses the platform's endianness.
        return new Int16Array(buffer)[0] === 256;
    })();

    seek(offset: number) {
        this.offset = offset;
    }

    skip(nBytes: number) {
        this.offset += nBytes;
    }

    isEOF() {
        return !(this.offset < this.fileSize)
    }

    slice(offset: number, len: number) {
        len = len || (this.fileSize - offset);

        let newFile;

        if (typeof this._u8array.buffer.slice !== 'undefined') {
            newFile = MarcFile.alloc(0);
            newFile.fileSize = len;
            newFile._u8array = new Uint8Array(this._u8array.buffer.slice(offset, offset + len));
        } else {
            newFile = MarcFile.alloc(len);
            this.copyToFile(newFile, offset, len, 0);
        }
        newFile.fileName = this.fileName;
        newFile.fileType = this.fileType;
        newFile.littleEndian = this.littleEndian;
        return newFile;
    }

    copyToFile(target: MarcFile, offsetSource: number, len?: number, offsetTarget?: number) {
        if (typeof offsetTarget === 'undefined')
            offsetTarget = offsetSource;

        len = len || (this.fileSize - offsetSource);

        for (var i = 0; i < len; i++) {
            target._u8array[offsetTarget + i] = this._u8array[offsetSource + i];
        }
    }

    save() {
        const blob = new Blob([this._u8array], {type: this.fileType});
        saveAs(blob, this.fileName);
    }

    getExtension() {
        const ext = this.fileName ? this.fileName.toLowerCase().match(/\.(\w+)$/) : '';

        return ext ? ext[1] : '';
    }

    readU8() {
        this._lastRead = this._u8array[this.offset];

        this.offset++;
        return this._lastRead
    }

    readU16() {
        if (this.littleEndian)
            this._lastRead = this._u8array[this.offset] + (this._u8array[this.offset + 1] << 8);
        else
            this._lastRead = (this._u8array[this.offset] << 8) + this._u8array[this.offset + 1];

        this.offset += 2;
        return this._lastRead >>> 0
    }

    readU24() {
        if (this.littleEndian)
            this._lastRead = this._u8array[this.offset] + (this._u8array[this.offset + 1] << 8) + (this._u8array[this.offset + 2] << 16);
        else
            this._lastRead = (this._u8array[this.offset] << 16) + (this._u8array[this.offset + 1] << 8) + this._u8array[this.offset + 2];

        this.offset += 3;
        return this._lastRead >>> 0
    }

    readU32() {
        if (this.littleEndian)
            this._lastRead = this._u8array[this.offset] + (this._u8array[this.offset + 1] << 8) + (this._u8array[this.offset + 2] << 16) + (this._u8array[this.offset + 3] << 24);
        else
            this._lastRead = (this._u8array[this.offset] << 24) + (this._u8array[this.offset + 1] << 16) + (this._u8array[this.offset + 2] << 8) + this._u8array[this.offset + 3];

        this.offset += 4;
        return this._lastRead >>> 0
    }

    readBytes(len: number) {
        this._lastRead = new Array(len);
        for (var i = 0; i < len; i++) {
            this._lastRead[i] = this._u8array[this.offset + i];
        }

        this.offset += len;
        return this._lastRead
    }

    readString(len: number) {
        this._lastRead = '';
        for (var i = 0; i < len && (this.offset + i) < this.fileSize && this._u8array[this.offset + i] > 0; i++)
            this._lastRead = this._lastRead + String.fromCharCode(this._u8array[this.offset + i]);

        this.offset += len;
        return this._lastRead
    }

    writeU8(u8: number) {
        this._u8array[this.offset] = u8;

        this.offset++;
    }

    writeU16(u16: number) {
        if (this.littleEndian) {
            this._u8array[this.offset] = u16 & 0xff;
            this._u8array[this.offset + 1] = u16 >> 8;
        } else {
            this._u8array[this.offset] = u16 >> 8;
            this._u8array[this.offset + 1] = u16 & 0xff;
        }

        this.offset += 2;
    }

    writeU24(u24: number) {
        if (this.littleEndian) {
            this._u8array[this.offset] = u24 & 0x0000ff;
            this._u8array[this.offset + 1] = (u24 & 0x00ff00) >> 8;
            this._u8array[this.offset + 2] = (u24 & 0xff0000) >> 16;
        } else {
            this._u8array[this.offset] = (u24 & 0xff0000) >> 16;
            this._u8array[this.offset + 1] = (u24 & 0x00ff00) >> 8;
            this._u8array[this.offset + 2] = u24 & 0x0000ff;
        }

        this.offset += 3;
    }

    writeU32(u32: number) {
        if (this.littleEndian) {
            this._u8array[this.offset] = u32 & 0x000000ff;
            this._u8array[this.offset + 1] = (u32 & 0x0000ff00) >> 8;
            this._u8array[this.offset + 2] = (u32 & 0x00ff0000) >> 16;
            this._u8array[this.offset + 3] = (u32 & 0xff000000) >> 24;
        } else {
            this._u8array[this.offset] = (u32 & 0xff000000) >> 24;
            this._u8array[this.offset + 1] = (u32 & 0x00ff0000) >> 16;
            this._u8array[this.offset + 2] = (u32 & 0x0000ff00) >> 8;
            this._u8array[this.offset + 3] = u32 & 0x000000ff;
        }

        this.offset += 4;
    }

    writeBytes(a: number[]) {
        for (let i = 0; i < a.length; i++)
            this._u8array[this.offset + i] = a[i]

        this.offset += a.length;
    }

    writeString(str: string, len?: number) {
        let i;
        len = len || str.length;
        for (i = 0; i < str.length && i < len; i++)
            this._u8array[this.offset + i] = str.charCodeAt(i);

        for (; i < len; i++)
            this._u8array[this.offset + i] = 0x00;

        this.offset += len;
    }
}
