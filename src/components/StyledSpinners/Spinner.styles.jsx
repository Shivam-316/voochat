import styled, { keyframes } from "styled-components";

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
`;

export const Spinner = styled.div`
  width: ${(props) => props.side || "2rem"};
  height: ${(props) => props.side || "2rem"};
  border: 5px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: ${rotate} 0.8s linear infinite;
`;
