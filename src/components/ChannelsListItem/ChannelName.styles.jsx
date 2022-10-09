import styled, { css } from "styled-components";

export const StyledName = styled.h3`
  ${(props) =>
    props.clickable &&
    css`
      &:hover {
        color: var(--emphasis-color);
        cursor: pointer;
      }
    `}
`;
