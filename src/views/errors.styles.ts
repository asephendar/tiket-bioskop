import { css } from '@emotion/react';

const styles = css`
&.error {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  .error-message {
    font-size: 3rem;
  }

  .error-code {
    padding: .5rem;
  }

  .error-actions {
    margin-top: 2rem;

    &> button {
      cursor: pointer;

      border: 0 none;
      border-radius: .25rem;

      background-color: #61dafb;
      color: #ffffff;
      padding: .5rem;
    }
  }
}`;

export { styles };
