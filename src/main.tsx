import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createGlobalStyle, ThemeProvider as StyledThemeProvider } from 'styled-components'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AlertProvider } from './components/Alerta/AlertProvider.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import App from './App.tsx'

const GlobalStyle = createGlobalStyle`
  :root {
    --font-principal: 'Poppins', sans-serif;
    --gradient-hero: linear-gradient(135deg, hsl(25 95% 53%), hsl(200 95% 60%));
    --ring: #f3740dff;
    --secondary: hsl(200 95% 60%);
    --gradient-primary: linear-gradient(135deg, hsl(25 95% 53%), hsl(35 95% 60%));
    --gradient-secondary: linear-gradient(135deg, hsl(200 95% 60%), hsl(210 90% 65%));
    --background: hsl(35 100% 98%);
  }

  * {
    box-sizing: border-box;
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
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
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

  html, body, #root {
    min-height: 100vh;
    width: 100%;
    font-family: var(--font-principal);
    background: var(--background);
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  img, picture, svg, video, iframe {
    max-width: 100%;
    height: auto;
    display: block;
  }
`

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <StyledThemeProvider theme={theme}>
            <GoogleOAuthProvider clientId="912477332805-51cp3chm479l1v5lin174b4fravp7okg.apps.googleusercontent.com">
              <AlertProvider>
                <CssBaseline />
                <GlobalStyle />
                <App />
              </AlertProvider>
            </GoogleOAuthProvider>
          </StyledThemeProvider>
        </ThemeProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>
)
