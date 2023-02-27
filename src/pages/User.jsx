import React from "react";
import styled from "styled-components";
import NavWrapper from "../components/NavWrapper";
import Navbar from "../components/Navbar";
import { FiChevronLeft } from "react-icons/fi";
import DefaultImage from "../components/DefaultImage";

function user() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <>
      <NavWrapper>
        <Navbar>
          <FiChevronLeft size={40}></FiChevronLeft>
        </Navbar>
      </NavWrapper>
      <UserInfoContainer>
        <DefaultImage></DefaultImage>
        <UserInfoWrapper>
          <UserTextBox>
            <h2>닉네임</h2>
            <h2>{userInfo.userName}</h2>
          </UserTextBox>
          <UserTextBox>
            <h2>이메일</h2>
            <h2>{userInfo.userEmail}</h2>
          </UserTextBox>
          <h2>내가 쓴 목록</h2>
          <UserPostList></UserPostList>
        </UserInfoWrapper>
      </UserInfoContainer>
    </>
  );
}

const UserInfoContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: auto;
  padding-bottom: 20px;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserTextBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  :first-child {
    margin-top: 20px;
  }
  h2:last-child {
    padding: 20px 30px;
    background-color: ${({ theme }) => theme.color.item_bg};
    border-radius: 17px;
  }
`;

const UserPostList = styled.div`
  margin-top: 20px;
  width: 400px;
  height: 400px;
  background-color: ${({ theme }) => theme.color.item_bg};
  border-radius: 17px;
  h2 {
  }
`;

export default user;
