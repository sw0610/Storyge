import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin-top: 80px;
`;

export const Alarm = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

export const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;


export const Img = styled.div`
  height: 40px;
  width: 40px;
  background-image: url(${(props) => props.profile});
  background-size: cover;
  border-radius: 50%;
  margin: 0px 20px 0px 20px;
`;

export const Text = styled.p`
  font-family: "S-CoreDream-5Medium";
  font-size: 14px;
  justify-content: center;
  align-items: center;
  color: black;
`;