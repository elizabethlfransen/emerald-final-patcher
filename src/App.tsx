import '@fontsource/inter'
import {Box, Button, Card, CardActions, CardContent, CssVarsProvider, extendTheme, LinearProgress} from "@mui/joy";
import {THEME} from "./theme.ts";
import {VersionBar} from "./components/VersionBar.tsx";
import {ToolBar} from "./components/ToolBar.tsx";
import {PatchForm} from "./components/PatchForm.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {AppFormData, DEFAULT_FORM_DATA} from "./form.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import {FileDropzoneType, FileDropzoneValue, RomFile} from "./components/FileDropzone.tsx";
import {saveAs} from "file-saver";
import {patchRom} from "./patchRom.ts";





function FormCard() {
    const methods = useForm({
        defaultValues: DEFAULT_FORM_DATA
    });
    const [patchAction, setPatchAction] = useState<(signal: AbortSignal) => Promise<RomFile>>();
    useEffect(() => {
        if(!patchAction) return;
        let abort = new AbortController();
        (async () => {
            const romFile = await patchAction(abort.signal);
            abort.abort();
            if(abort.signal.aborted) return;
            saveAs(new Blob([romFile.data]),"Emerald Final.gba");
        })();
        return () => abort.abort();
    }, [patchAction])
    const {handleSubmit, watch} = methods;
    const romFile = watch("romFile") as FileDropzoneValue | null;
    const validFile = useMemo(() => romFile !== null && (romFile.type === FileDropzoneType.INVALID_HASH || romFile.type == FileDropzoneType.LOADED), [romFile]);
    const patch = useCallback((data: AppFormData) => {
        const romFile = data.romFile as FileDropzoneValue | null;
        if(romFile == null || !(romFile.type === FileDropzoneType.INVALID_HASH || romFile.type == FileDropzoneType.LOADED)) return;
        setPatchAction(() => async (signal: AbortSignal)=> {
            await patchRom(data, signal);
            return romFile.value;
        });

    }, []);

    return (<FormProvider {...methods}>
        <Card
            component={"form"}
            sx={(theme) => ({
                boxSizing: "border-box",
                width: {
                    xs: "100%",
                    lg: "960px",
                    xl: "1140px",
                    xxl: "1320px",
                },
                mx: 'auto', // margin left & right
                my: 4, // margin top & bottom
                p: 0,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'md',
                overflow: 'auto',
                [theme.breakpoints.down('md')]: {
                    m: 0,
                    border: 'none',
                    borderRadius: 0,
                    height: "100%"
                }
            })}
            variant="outlined"
            onSubmit={handleSubmit(patch)}
        >
            <Box sx={{
                px: 2, // padding left & right
                pb: 1
            }}>
                <CardContent sx={{
                    py: 3
                }}>
                    <PatchForm/>
                </CardContent>
                <CardActions>
                    <Box>
                        <Button type={"submit"} variant="solid" color="primary" disabled={!validFile}>
                            Patch
                        </Button>
                    </Box>
                </CardActions>
            </Box>
            <LinearProgress value={0} thickness={2} variant={"soft"} sx={{borderRadius: 0, visibility: "hidden"}}/>
        </Card>
    </FormProvider>);
}

function App() {

    const theme = extendTheme(THEME);

    return (
        <CssVarsProvider theme={theme}>
            <header>
                <ToolBar/>
            </header>
            <main>
                <FormCard/>
            </main>
            <footer>
                <VersionBar/>
            </footer>
        </CssVarsProvider>
    );
}

export default App
