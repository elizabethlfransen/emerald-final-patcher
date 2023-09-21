import {Box} from "@mui/joy";
import {FileDropzone} from "./FileDropzone.tsx";

export function PatchForm() {
    return (
        <Box>
            <FileDropzone label={"Pokemon Emerald Rom"}/>
        </Box>
    )
}