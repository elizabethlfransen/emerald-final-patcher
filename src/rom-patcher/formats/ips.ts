/* IPS module for Rom Patcher JS v20220417 - Marc Robledo 2016-2022 - http://www.marcrobledo.com/license */
/* File format specification: http://www.smwiki.net/wiki/IPS_file_format */

import {MarcFile} from "../marc-file.ts";

const IPS_MAGIC='PATCH';
const IPS_RECORD_RLE=0x0000;
const IPS_RECORD_SIMPLE=0x01;

export class IPS {
    records: any[]
    truncate: number
    constructor() {

        this.records=[];
        this.truncate=0;
    }
    addSimpleRecord(o: number, d: number[]){
        this.records.push({offset:o, type:IPS_RECORD_SIMPLE, length:d.length, data:d})
    }
    addRLERecord(o: number, l: number, b: number){
        this.records.push({offset:o, type:IPS_RECORD_RLE, length:l, byte:b})
    }
    toString(){
        let nSimpleRecords=0;
        let nRLERecords=0;
        for(let i=0; i<this.records.length; i++){
            if(this.records[i].type===IPS_RECORD_RLE)
                nRLERecords++;
            else
                nSimpleRecords++;
        }
        let s = 'Simple records: ' + nSimpleRecords;
        s+='\nRLE records: '+nRLERecords;
        s+='\nTotal records: '+this.records.length;
        if(this.truncate)
            s+='\nTruncate at: 0x'+this.truncate.toString(16);
        return s
    }
    export(fileName: string){
        let i;
        let patchFileSize = 5; //PATCH string
        for(i = 0; i<this.records.length; i++){
            if(this.records[i].type===IPS_RECORD_RLE)
                patchFileSize+=(3+2+2+1); //offset+0x0000+length+RLE byte to be written
            else
                patchFileSize+=(3+2+this.records[i].data.length); //offset+length+data
        }
        patchFileSize+=3; //EOF string
        if(this.truncate)
            patchFileSize+=3; //truncate

        let tempFile=MarcFile.alloc(patchFileSize);
        tempFile.fileName=fileName+'.ips';
        tempFile.writeString(IPS_MAGIC);
        for(i = 0; i<this.records.length; i++){
            const rec = this.records[i];
            tempFile.writeU24(rec.offset);
            if(rec.type===IPS_RECORD_RLE){
                tempFile.writeU16(0x0000);
                tempFile.writeU16(rec.length);
                tempFile.writeU8(rec.byte);
            }else{
                tempFile.writeU16(rec.data.length);
                tempFile.writeBytes(rec.data);
            }
        }

        tempFile.writeString('EOF');
        if(this.truncate)
            tempFile.writeU24(this.truncate);


        return tempFile
    }
    apply(romFile: MarcFile): MarcFile{
        let i, tempFile;
        if(this.truncate){
            if(this.truncate>romFile.fileSize){ //expand (discussed here: https://github.com/marcrobledo/RomPatcher.js/pull/46)
                tempFile=MarcFile.alloc(this.truncate);
                romFile.copyToFile(tempFile, 0, romFile.fileSize, 0);
            }else{ //truncate
                tempFile=romFile.slice(0, this.truncate);
                // nothing happens here??
            }
        }else{
            //calculate target ROM size, expanding it if any record offset is beyond target ROM size
            let newFileSize = romFile.fileSize;
            for(i = 0; i<this.records.length; i++){
                const rec = this.records[i];
                if(rec.type===IPS_RECORD_RLE){
                    if(rec.offset+rec.length>newFileSize){
                        newFileSize=rec.offset+rec.length;
                    }
                }else{
                    if(rec.offset+rec.data.length>newFileSize){
                        newFileSize=rec.offset+rec.data.length;
                    }
                }
            }

            if(newFileSize===romFile.fileSize){
                tempFile=romFile.slice(0, romFile.fileSize);
            }else{
                tempFile=MarcFile.alloc(newFileSize);
                romFile.copyToFile(tempFile,0);
            }
        }


        romFile.seek(0);

        for(i = 0; i<this.records.length; i++){
            tempFile.seek(this.records[i].offset);
            if(this.records[i].type===IPS_RECORD_RLE){
                for(let j=0; j<this.records[i].length; j++)
                    tempFile.writeU8(this.records[i].byte);
            }else{
                tempFile.writeBytes(this.records[i].data);
            }
        }

        return tempFile
    }
    static parseIPSFile(file: MarcFile){
        const patchFile = new IPS();
        file.seek(5);

        while(!file.isEOF()){
            const offset = file.readU24();

            if(offset===0x454f46){ /* EOF */
                if(file.isEOF()){
                    break;
                }else if((file.offset+3)===file.fileSize){
                    patchFile.truncate=file.readU24();
                    break;
                }
            }

            const length = file.readU16();

            if(length===IPS_RECORD_RLE){
                patchFile.addRLERecord(offset, file.readU16(), file.readU8());
            }else{
                patchFile.addSimpleRecord(offset, file.readBytes(length));
            }
        }
        return patchFile;
    }

}