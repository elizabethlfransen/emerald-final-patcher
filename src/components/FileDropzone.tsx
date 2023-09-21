import {ReactNode, useCallback, useRef} from "react";
import {Box, FormControl, FormLabel, Typography, styled, Alert, CircularProgress} from "@mui/joy";
import {Upload} from "@mui/icons-material";

export interface FileDropzoneProps {
    label: ReactNode,
    fullWidth?: boolean
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

export function FileDropzone({label, fullWidth}: FileDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleClick = useCallback(() => {
        inputRef.current?.click();
    }, [])
    return (
        <FormControl size={"lg"}>
            <FormLabel htmlFor={"romFile"} sx={{
                cursor: "pointer"
            }}>{label}</FormLabel>
            <VisuallyHiddenInput ref={inputRef} id={"romFile"} type="file"/>
            <Box onClick={handleClick}
                 sx={{
                     cursor: "pointer",
                     display: fullWidth ? 'flex' : 'inline-flex',
                     border: "1px dashed",
                     borderColor: "neutral.500",
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
            <Alert color={"neutral"} sx={{mb: 2}}>
                <CircularProgress size={"sm"} color={"neutral"}/>
                Some File was Selected
            </Alert>

        </FormControl>
    )
}