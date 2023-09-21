import {Box, Button, Sheet, Typography, useColorScheme} from "@mui/joy";
import {useEffect, useMemo, useState} from "react";
import {DarkMode, LightMode} from "@mui/icons-material";

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

export function ToolBar() {
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