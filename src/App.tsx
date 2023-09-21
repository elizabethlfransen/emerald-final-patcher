import '@fontsource/inter'
import {
    Box,
    Button,
    CssVarsProvider, extendTheme,
    FormControl,
    FormLabel,
    Input,
    Link,
    Sheet,
    Typography,
    useColorScheme
} from "@mui/joy";
import {useEffect, useMemo, useState} from "react";
import {THEME} from "./theme.ts";
import {DarkMode, LightMode} from "@mui/icons-material";
import PackageDetails from "../package.json";


function ModeToggle() {
    const {mode, setMode} = useColorScheme();
    const [mounted, setMounted] = useState(false);

    // necessary for server-side rendering
    // because mode is undefined on the server
    useEffect(() => {
        setMounted(true);
    }, []);
    const title = useMemo(() => mode === 'light' ? 'Turn dark' : 'Turn light', [mode]);

    if (!mounted) {
        return null;
    }

    return (
        <Button
            sx={{
                borderRadius: "50%",
                padding: 1.5
            }}
            color={"neutral"}
            aria-label={title}
            title={title}
            variant="plain"
            onClick={() => {
                setMode(mode === 'light' ? 'dark' : 'light');
            }}
        >
            {mode === 'light' ? <DarkMode/> : <LightMode/>}
        </Button>
    );
}

function ToolBar() {
    return (
        <Sheet sx={{
            px: 1,
            py: 2,
            borderLeft: 'none',
            borderRight: 'none',
            borderTop: 'none',
            display: 'flex',
            alignItems: 'center'
        }} variant={"outlined"}>
            <Box px={2}>
                <Typography level={"title-lg"} color={"primary"} mr={2}>Emerald Final Patcher</Typography>
            </Box>
            <Box sx={{
                ml: "auto",
                px: 2
            }}>
                <ModeToggle/>
            </Box>
        </Sheet>
    );
}

function VersionBar() {
    return (
        <Sheet variant={"outline"} sx={{
            p: 1,
            display: 'flex',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'none',
        }}>
            <Typography mr={2}>
                <Typography color="neutral" level={"title-sm"} mr={1}>
                    Patcher Version
                </Typography>
                <Typography color="primary" level={"title-sm"}>
                    {PackageDetails.version}
                </Typography>
            </Typography>

            <Typography>
                <Typography color="neutral" level={"title-sm"} mr={1}>
                    Patch Version
                </Typography>
                <Typography color="primary" level={"title-sm"}>
                    N/A
                </Typography>
            </Typography>
        </Sheet>
    );
}

function App() {

    const theme = extendTheme(THEME);

    return (
        <CssVarsProvider theme={theme}>
            <header>
                <ToolBar/>
            </header>
            <main>
                <Sheet
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
                        py: 3, // padding top & bottom
                        px: 2, // padding left & right
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        borderRadius: 'sm',
                        boxShadow: 'md',
                        [theme.breakpoints.down('md')]: {
                            m: 0,
                            border: 'none',
                            borderRadius: 0,
                            height: "100%"
                        }
                    })}
                    variant="outlined"
                >
                    <Box>
                        <div>
                            <Typography level="h4" component="h1">
                                <b>Welcome!</b>
                            </Typography>
                            <Typography level="body-sm">Sign in to continue.</Typography>
                        </div>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input
                                // html input attribute
                                name="email"
                                type="email"
                                placeholder="johndoe@email.com"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input
                                // html input attribute
                                name="password"
                                type="password"
                                placeholder="password"
                            />
                        </FormControl>

                        <Button sx={{mt: 1 /* margin top */}}>Log in</Button>
                        <Typography
                            endDecorator={<Link href="/sign-up">Sign up</Link>}
                            fontSize="sm"
                            sx={{alignSelf: 'center'}}
                        >
                            Don&apos;t have an account?
                        </Typography>
                    </Box>
                </Sheet>
            </main>
            <footer>
                <VersionBar/>
            </footer>
        </CssVarsProvider>
    );
}

export default App
