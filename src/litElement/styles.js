import { css } from 'lit-element';

export const styles = css`
  h2 {
    margin: 0;
  }

  button {
    all: inherit;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em 0;
    width: 100%;
  }
  button svg {
    height: 1em;
    margin-left: 0.5em;
  }

  [aria-expanded] .vertical {
    display: none;
  }
`;
