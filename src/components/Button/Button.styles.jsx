import styled from "styled-components";

export const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background-color: transparent;
  border: none;
  &::after {
    content: "❌";
  }
  &:hover {
    cursor: pointer;
  }
`;

export const DefaultButton = styled.button.attrs((props) => ({
  type: props.type ?? "button",
}))`
  color: var(--text-color);
  height: 100%;
  border-radius: 10px;
  border: 2px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1rem;
  font-weight: var(--font-medium);
  font-family: inherit;
  background-color: var(--background-color-darker);
  cursor: pointer;
  transition: border-color 0.25s;

  &:hover {
    border-color: var(--emphasis-color);
  }

  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`;

export const ThemedButton = styled(DefaultButton)`
  background-color: var(--backgound-color-user-input);
  box-shadow: 1px 1px 15px -2px var(--shadow-color);
  border-radius: 0;
  color: var(--text-color-inactive);
  outline: none;
  border: none;

  &:hover {
    color: var(--text-color);
    border: none;
  }

  &:disabled {
    color: var(--text-color-inactive);
    border: none;
    cursor: not-allowed;
  }

  &:focus,
  &:focus-visible {
    outline: none;
  }
`;
