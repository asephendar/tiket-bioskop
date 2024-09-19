import { lazy, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ServiceWorker } from '@nxweb/core/web';
import { BrowserRouter, disableReactDevTools } from '@nxweb/react';

import { App } from '@components/app';
import { layouts } from '@config/layouts';
import { routes } from '@config/routes';
import { Provider } from 'react-redux';
import store from '@models/store';

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

const root = createRoot(document.getElementById('root') as HTMLElement);
const error = lazy(() => import('@views/errors.js'));

root.render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter
        defaultLayout="default"
        error={error}
        layouts={layouts}
        resolvePages={true}
        // root={App}
        routes={routes} />
    </StrictMode>
  </Provider>
);

/**
 * ServiceWorker registration
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below, and set the pwa property to true in .nextweb.ts.
 *
 * Note:
 * This comes with some pitfalls though, make sure you know the implications.
 */

ServiceWorker.unregister();

/**
 * Performance metric reporting
 * If you want your app to send anlytics metrics you can pass a custom
 * handler for processing the metrics below.
 * The `console.debug` is provided as example only.
 *
 * WebVitals.register(console.debug);
 */

/**
 * The default application export
 * If enabled, this will be available as global `NX` object
 *
 * Note:
 * At runtime these could be overwritten by the host application.
 */

export default {};
