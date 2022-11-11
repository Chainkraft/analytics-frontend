import {green, grey, red} from '@mui/material/colors';
import {createTheme} from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#1a1a2e"
        },
        secondary: {
            main: "#f9A822"
        },
        warning: {
            main: red[500]
        },
        success: {
            main: green[500]
        },
        background: {
            default: "#13131e",
            paper: "#1a1a2e"
        },
        text: {
            primary: "#ffffff",
            secondary: grey[400],
            disabled: grey[600]
        }
    },
    status: {
        danger: red[500],
    },
    typography: {
        button: {
            textTransform: 'none'
        }
    }
});

declare module '@mui/material' {
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}

export default theme;