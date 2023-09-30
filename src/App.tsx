import '@fontsource/inter'
import {Box, Button, Card, CardActions, CardContent, CssVarsProvider, extendTheme, LinearProgress} from "@mui/joy";
import {THEME} from "./theme.ts";
import {VersionBar} from "./components/VersionBar.tsx";
import {ToolBar} from "./components/ToolBar.tsx";
import {PatchForm} from "./components/PatchForm.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {DEFAULT_FORM_DATA} from "./form.tsx";



function FormCard() {
    const methods = useForm({
        defaultValues: DEFAULT_FORM_DATA
    });
    const {handleSubmit} = methods;



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
            onSubmit={handleSubmit((d) => console.log(d))}
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
                        <Button type={"submit"} variant="solid" color="primary">
                            Patch
                        </Button>
                    </Box>
                </CardActions>
            </Box>
            <LinearProgress value={0}  thickness={2} variant={"soft"} sx={{borderRadius: 0, visibility: "hidden"}}/>
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
