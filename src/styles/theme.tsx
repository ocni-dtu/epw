import { createTheme } from "@mui/material";

declare module '@mui/material/styles' {
  interface Palette {
    gridLines: string;
    backgroundColor: string;
    countryColor: string;
  }
  interface PaletteOptions {
    gridLines: string
    backgroundColor: string
    countryColor: string
  }
  interface ThemeOptions {
    gridLines?: string
    backgroundColor?: string
    countryColor?: string
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2e2e2eff',
    },
    backgroundColor: "#f9f7e8",
    countryColor: "#5a714a",
    gridLines: "#2121210d"
  }
});
