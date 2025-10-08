import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createGlobalStyle } from 'styled-components'
import { HashRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AlertProvider } from './components/Alerta/AlertProvider.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import App from './App.tsx'

const GlobalStyle = createGlobalStyle`

  :root {
    --font-principal: 'Poppins', sans-serif;
    --gradient-hero: linear-gradient(135deg, hsl(25 95% 53%), hsl(200 95% 60%));
    --ring: #f3740dff;
    --gradient-primary: linear-gradient(135deg, hsl(25 95% 53%), hsl(35 95% 60%));
    --gradient-secondary: linear-gradient(135deg, hsl(200 95% 60%), hsl(210 90% 65%));
    --cinza: rgba(245, 245, 220, 1)	;
    --sidebar-ring: hsl(217.2 91.2% 59.8%);
    --accent: hsl(140 85% 55%);
    --secondary: hsl(200 95% 60%);
    --accent-foreground: hsl(0 0% 100%);
    --background: hsl(35 100% 98%);
    --muted-foreground: hsl(210 15% 45%);
    --google-gradient: linear-gradient( to-right, hsl(217, 89%, 61%) 0%, hsl(4, 83%, 57%) 25%, hsl(48, 96%, 58%) 50%, hsl(142, 54%, 47%) 75%, hsl(217, 89%, 61%) 100% );
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
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <GoogleOAuthProvider clientId="912477332805-51cp3chm479l1v5lin174b4fravp7okg.apps.googleusercontent.com">
            <AlertProvider>
              <CssBaseline />
              <GlobalStyle />
              <App />
            </AlertProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>
)
