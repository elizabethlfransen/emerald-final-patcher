import {ChangeEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Box, FormControl, FormLabel, Typography, styled, Alert, CircularProgress, Tooltip} from "@mui/joy";
import {CheckCircle, Error, Upload, Warning,} from "@mui/icons-material";
import {lib, SHA256} from "crypto-js";

const {WordArray} = lib;

export interface FileDropzoneProps {
    label: ReactNode,
    fullWidth?: boolean,
    value: FileDropzoneValue,
    expectedHash?: string,

    onChange(newValue: FileDropzoneValue): void
}

export interface RomFile {
    file: File
    name: string
    data: Uint8Array
    sha256: string
}

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;


async function createRomFile(file: File): Promise<RomFile> {
    const buf = await file.arrayBuffer();
    const data = new Uint8Array(buf);
    const arr = WordArray.create(data);
    const sha256 = SHA256(arr);
    return {
        data,
        sha256: sha256.toString(),
        file,
        name: file.name
    }
}

export enum FileDropzoneType {
    NO_FILE,
    LOADING,
    LOADED,
    ERROR,
    INVALID_HASH
}

interface HasFile {
    file: File
}


export interface NoFileDropzoneValue {
    type: FileDropzoneType.NO_FILE
}

export interface LoadingFileDropzoneValue {
    type: FileDropzoneType.LOADING
    file: File
    value: Promise<RomFile>
}

export interface LoadedFileDropzoneValue {
    type: FileDropzoneType.LOADED
    value: RomFile
    file: File
}

export interface ErrorFileDropzoneValue {
    type: FileDropzoneType.ERROR
    file: File
    error: Error
}

export interface InvalidHashFileDropzoneValue {
    type: FileDropzoneType.INVALID_HASH
    value: RomFile
    file: File
}

export type FileDropzoneValue =
    NoFileDropzoneValue
    | LoadingFileDropzoneValue
    | LoadedFileDropzoneValue
    | ErrorFileDropzoneValue
    | InvalidHashFileDropzoneValue;

function FileLabel({value: {file, type}}: { value: FileDropzoneValue & HasFile }) {
    const color = useMemo(() => {
        switch (type) {
            case FileDropzoneType.ERROR:
                return "error";
            case FileDropzoneType.INVALID_HASH:
                return "warning";
            case FileDropzoneType.LOADED:
                return "success";
            default:
                return "neutral";
        }
    }, [type])
    const icon = useMemo(() => {
        switch(type) {
            case FileDropzoneType.ERROR:
                return <Tooltip title={"Unable to load file."} variant={"soft"}><Error/></Tooltip>;
            case FileDropzoneType.INVALID_HASH:
                return <Tooltip title={"Invalid checksum."} variant={"soft"}><Warning/></Tooltip>;
            case FileDropzoneType.LOADED:
                return <CheckCircle/>;
            default:
                return <CircularProgress size={"sm"} color={"neutral"}/>;
        }
    },[type]);

    return (
        <Alert color={color} sx={{mb: 2}}>
            {icon}

            {file.name}
        </Alert>
    );
}

export function FileDropzone({label, fullWidth, value, onChange, expectedHash}: FileDropzoneProps) {
    const [dragging, setDragging] = useState(false);
    useEffect(() => {
        if (value.type !== FileDropzoneType.LOADING) return;
        const abortController = new AbortController();
        (async () => {
            try {
                const file = await value.value;
                if (abortController.signal.aborted) return;
                onChange({
                    type: expectedHash === undefined || file.sha256 == expectedHash ? FileDropzoneType.LOADED : FileDropzoneType.INVALID_HASH,
                    file: value.file,
                    value: file
                })
            } catch (e: Error) {
                if (abortController.signal.aborted) return;
                onChange({
                    type: FileDropzoneType.ERROR,
                    file: value.file,
                    error: e
                })
            }

        })();
        return () => abortController.abort();
    }, [value, onChange, expectedHash]);

    const inputRef = useRef<HTMLInputElement>(null);
    const handleClick = useCallback(() => {
        inputRef.current?.click();
    }, []);
    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.item(0);
        if (file == null) {
            onChange({
                type: FileDropzoneType.NO_FILE
            });
            return;
        }
        onChange({
            type: FileDropzoneType.LOADING,
            file,
            value: createRomFile(file)
        })
    }, [onChange]);
    const preventDrag = useCallback((e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
    });
    const stopDragging = useCallback(() => {
        setDragging(false);
    }, []);
    const handleDrop = useCallback((e: DragEvent) => {
        const file = e.dataTransfer.files[0];
        if (file !== undefined) {
            onChange({
                type: FileDropzoneType.LOADING,
                file: file,
                value: createRomFile(file),
            });
        }

        preventDrag(e);
        stopDragging();
    }, [preventDrag, stopDragging, onChange]);

    const startDragging = useCallback(() => {
        setDragging(true);
    }, []);

    return (
        <FormControl size={"lg"}>
            <FormLabel htmlFor={"romFile"} sx={{
                cursor: "pointer"
            }}>{label}</FormLabel>
            <VisuallyHiddenInput ref={inputRef} id={"romFile"} type="file" onChange={handleFileChange}/>
            <Box onClick={handleClick}
                 onDragOver={preventDrag}
                 onDragEnter={startDragging}
                 onDragLeave={stopDragging}
                 onDragEnd={stopDragging}
                 onDrop={handleDrop}
                 sx={{
                     cursor: "pointer",
                     display: fullWidth ? 'flex' : 'inline-flex',
                     borderWidth: "2px",
                     borderStyle: dragging ? "solid" : "dashed",
                     borderColor: dragging ? "primary.500" : "neutral.500",
                     borderRadius: 4,
                     p: 2,
                     justifyContent: 'center',
                     alignItems: 'center',
                     mb: 2
                 }}>
                <Upload sx={{mr: 1}}/>
                <Typography>
                    Drop rom here or <Typography fontWeight={"bold"}>Click to Browse files</Typography>
                </Typography>
            </Box>
            {"file" in value && <FileLabel value={value}/>}
        </FormControl>
    )
}