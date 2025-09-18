import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createGlobalStyle } from 'styled-components'
import { HashRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AlertProvider } from './components/Login/Alerta/AlertProvider.tsx';
import App from './App.tsx'

const GlobalStyle = createGlobalStyle`

  :root {
    --font-principal: "Montserrat", sans-serif;
    --gradient-hero: linear-gradient(135deg, hsl(25 95% 53%), hsl(200 95% 60%));
    --ring: rgb(243, 116, 13);
  }

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    font-family: var(--font-principal);
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;

    vertical-align: baseline;
  }
  

  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
`

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider theme={theme}>
        <GoogleOAuthProvider clientId="912477332805-51cp3chm479l1v5lin174b4fravp7okg.apps.googleusercontent.com">
          <AlertProvider>
            <CssBaseline />
            <GlobalStyle />
            <App />
          </AlertProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>
)
