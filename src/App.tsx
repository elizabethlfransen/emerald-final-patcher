import '@fontsource/inter'
import {
    Box,
    Button,
    CssVarsProvider,
    extendTheme,
    FormControl,
    FormLabel,
    Input,
    Link,
    Sheet,
    Typography
} from "@mui/joy";
import {THEME} from "./theme.ts";
import {VersionBar} from "./components/VersionBar.tsx";
import {ToolBar} from "./components/ToolBar.tsx";


function FormCard() {
    return (<Sheet
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
    </Sheet>);
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
