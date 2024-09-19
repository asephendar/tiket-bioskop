import type { FC } from 'react';

import { CacheProvider } from '@emotion/react';

import type { LayoutWrapperProps } from '@nxweb/react';
import { createEmotionCache, Head } from '@nxweb/react';

import { app } from '@config/app.js';

import '@styles/index.scss';

const clientEmotionCache = createEmotionCache();

const App: FC<LayoutWrapperProps> = ({
  children = null, emotionCache = clientEmotionCache
}) => {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{app.title}</title>
        <meta content={`${app.name} — ${app.description}`} name="description" />
        <meta content={app.keywords.join(',')} name="keywords" />
        <meta content="initial-scale=1, width=device-width" name="viewport" />
      </Head>
      {children}
    </CacheProvider>
  );
};

App.displayName = 'App';

export { App };
