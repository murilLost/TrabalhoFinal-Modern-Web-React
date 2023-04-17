import styled from "styled-components";

interface PropsFab {
  position: string;
}

export const FabButtonStyled = styled.button<PropsFab>`
  //position: absolute;
  ${(props) => (props.position === "left" ? "left: 5px;" : "right: 5px;")}
  //top: 5px;
  color: white;
  align-items: center;

  background-color: #ed145b ;
  color: var(--white);
  font-size: 12px;
  font-weight: bold;

  width: 25px;
  height: 25px;
  border-radius: 25px;  
  border: 0px;

  box-shadow: 2px 4px 4px #0009;
  transition: 0.2s; 
  cursor: pointer;

  :hover {
    font-weight: normal;
    color: var(--white);
    background-color:  #b1184b;
    box-shadow: 2px 10px 10px #0009;
    ${(props) => (props.position === "left" ? "transform: scale(2) translateX(5px) translateY(5px);" : "transform: scale(2) translateX(-5px) translateY(5px);")}
  }

  span {
    font-size: 12px;
  }
`;
