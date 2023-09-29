import {extendTheme} from "@mui/joy";

export const THEME = extendTheme({
    breakpoints: {
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400
    },
    "colorSchemes": {
        "light": {
            "palette": {
                "primary": {
                    "50": "#ecfdf5",
                    "100": "#d1fae5",
                    "200": "#a7f3d0",
                    "300": "#6ee7b7",
                    "400": "#34d399",
                    "500": "#10b981",
                    "600": "#059669",
                    "700": "#047857",
                    "800": "#065f46",
                    "900": "#064e3b"
                }
            }
        },
        "dark": {
            "palette": {
                "primary": {
                    "50": "#ecfdf5",
                    "100": "#d1fae5",
                    "200": "#a7f3d0",
                    "300": "#6ee7b7",
                    "400": "#34d399",
                    "500": "#10b981",
                    "600": "#059669",
                    "700": "#047857",
                    "800": "#065f46",
                    "900": "#064e3b"
                }
            }
        }
    }
})