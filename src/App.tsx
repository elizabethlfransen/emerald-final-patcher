import '@fontsource/inter'
import {Box, Button, Card, CardActions, CardContent, CssVarsProvider, extendTheme, LinearProgress} from "@mui/joy";
import {THEME} from "./theme.ts";
import {VersionBar} from "./components/VersionBar.tsx";
import {ToolBar} from "./components/ToolBar.tsx";
import {PatchForm} from "./components/PatchForm.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {AppFormData, DEFAULT_FORM_DATA} from "./form.tsx";
import {useCallback, useMemo} from "react";
import {FileDropzoneType, FileDropzoneValue, RomFile} from "./components/FileDropzone.tsx";
import {saveAs} from "file-saver";
import {IPS} from "./rom-patcher/formats/ips.ts";
import {MarcFile} from "./rom-patcher/marc-file.ts";
import {PatchProvider} from "./components/PatchProvider.tsx";
import {useGitHubPatchProvider} from "./rom-patcher/github-patch-provider.ts";

const ROOT_URL = "https://raw.githubusercontent.com/elizabethlfransen/emerald-final-patches/main/7.4.1/";


async function applyVariant(data: AppFormData, romData: RomFile) {
    if (data.base == "legacy" && data.variant == "newWilds") {
        const url = ROOT_URL + ["Legacy Variant", "Legacy v7.41 - New Wilds.ips"]
            .map(x => encodeURIComponent(x))
            .join("/");

        const data = new Uint8Array(await (await fetch(url)).arrayBuffer());
        const ips = IPS.parseIPSFile(MarcFile.fromTypedArray(data));
        ips.apply(MarcFile.fromTypedArray(romData.data)).copyToFile(MarcFile.fromTypedArray(romData.data), 0);
        // console.log(data);

    }
}

function FormCard() {
    const methods = useForm({
        defaultValues: DEFAULT_FORM_DATA
    });
    const {handleSubmit, watch} = methods;
    const romFile = watch("romFile") as FileDropzoneValue | null;
    const validFile = useMemo(() => romFile !== null && (romFile.type === FileDropzoneType.INVALID_HASH || romFile.type == FileDropzoneType.LOADED), [romFile]);
    const patch = useCallback((data: AppFormData) => {
        const romFile = data.romFile as FileDropzoneValue | null;
        if (romFile == null || !(romFile.type === FileDropzoneType.INVALID_HASH || romFile.type == FileDropzoneType.LOADED)) return;
        (async () => applyVariant(data, romFile.value))().then(() => {
            saveAs(new Blob([romFile.value.data]), "Emerald Final.gba");
        });

        // resolve the base patch

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
    const patchProvider = useGitHubPatchProvider("elizabethlfransen/emerald-final-patches/dev")

    return (
        <CssVarsProvider theme={theme}>
            <PatchProvider provider={patchProvider}>
                <header>
                    <ToolBar/>
                </header>
                <main>
                    <FormCard/>
                </main>
                <footer>
                    <VersionBar/>
                </footer>
            </PatchProvider>
        </CssVarsProvider>
    );
}

export default App
