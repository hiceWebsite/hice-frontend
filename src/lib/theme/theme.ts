import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#00AEEF",
    },
    secondary: {
      main: "#0C2E6E",
    },
  },

  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        contained: {
          background: "linear-gradient(90deg, #00AEEF 0%, #0C2E6E 100%)",
          color: "#fff",
          "&:hover": {
            background: "linear-gradient(90deg, #0C2E6E 0%, #00AEEF 100%)",
          },
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: "lg",
      },
    },
  },
  typography: {
    fontFamily: "Noto Sans, sans-serif",
    body1: {
      color: "#0B1134CC",
    },
  },
});

theme.shadows[1] = "0px 5px 22px lightgray";
