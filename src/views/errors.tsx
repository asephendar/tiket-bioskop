import type { FC } from 'react';

import type { RouteProps } from '@nxweb/react';

import { useLib } from './errors.lib.js';
import { styles } from './errors.styles.js';

const RouteError: FC<RouteProps> = () => {
  const { location, navigate } = useLib();

  return (
    <div className="error" css={styles}>
      <div className="error-container">
        <h1 className="error-message">
          <span>ERROR</span>
          <small className="error-code">404</small>
        </h1>

        <p className="error-details">
          The requested url <code>{location.pathname}</code> was not found in this server
        </p>
        { location.pathname !== '/'
          ? <p className="error-actions">
              <button type="button" onClick={() => navigate('/')}>Return Home</button>
            </p>
          : null}
      </div>
    </div>
  );
};

RouteError.displayName = 'RouteError';

export default RouteError;
