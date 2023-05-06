import '@/src/common/styles/globalStyles.css';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';

/**
 * MUI Imports and Configs
 */
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '@/src/config/theme';
import createEmotionCache from '@/src/config/createEmotionCache';
import { useMediaQuery } from '@mui/material';
import React, { useMemo } from 'react';

const clientSideEmotionCache = createEmotionCache();

export default function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const customTheme = useMemo(
    () =>
      createTheme({
        ...theme,
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light'
        }
      }),
    [prefersDarkMode]
  );

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Component {...pageProps} />
        <Toaster />
        <Analytics />
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired
};
