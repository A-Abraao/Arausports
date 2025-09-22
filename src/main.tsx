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
    --font-principal: 'Poppins', sans-serif;
    --gradient-hero: linear-gradient(135deg, hsl(25 95% 53%), hsl(200 95% 60%));
    --ring: #f3740dff;
    --gradient-primary: linear-gradient(135deg, hsl(25 95% 53%), hsl(35 95% 60%));
    --gradient-secondary: linear-gradient(135deg, hsl(200 95% 60%), hsl(210 90% 65%));
    --cinza: #F5F5DC	;
    --sidebar-ring: hsl(217.2 91.2% 59.8%);
    --secondary: hsl(200 95% 60%);
     --background: hsl(35 100% 98%);
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
  time, mark, audio, video, button {
    font-family: var(--font-principal);
    word-break: break-word;
    overflow-wrap: anywhere;
    margin: 0;
    padding: 0;
    border: 0;
    font-weight: 450;
    vertical-align: baseline;
  }
  
  #root {
    background: var(--background);
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
