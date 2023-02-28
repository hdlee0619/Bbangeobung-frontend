import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Btn from "../components/Btn";
import Navbar from "../components/Navbar";
import NavWrapper from "../components/NavWrapper";
import CommentList from "../components/comment/CommentList";
import CommentInput from "../components/comment/CommentInput";
import { FiChevronLeft, FiArrowUp } from "react-icons/fi";
import { MdOutlineReport } from "react-icons/md";
import KakaoMapScript from "../util/KakaoMapScript";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteStore,
  showDetailStore,
  postComment,
  showComment,
  postReport,
  editingComment,
} from "../api/api";
import Cookies from "js-cookie";

function Detail() {
  const navigate = useNavigate();
  const token = Cookies.get("access_token");
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data } = useQuery(
    ["showDetail", id],
    () => showDetailStore({ id, token }),
    { staleTime: 1000 * 50 }
  );
  const { data: commentList } = useQuery("showPostComment", () =>
    showComment(id)
  );
  const [modal, setModal] = useState(false);
  const [comment, setComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [report, setReport] = useState("");
  const [edit, setEdit] = useState(true);
  const [ids, setIds] = useState("");

  useEffect(() => {
    KakaoMapScript(data?.longitude, data?.latitude);
  }, [data?.latitude, data?.longitude]);

  const dlelteStoreItem = useMutation(deleteStore, {
    onSuccess: () => {
      navigate("/");
    },
  });

  const postingComment = useMutation(postComment, {
    onSuccess: () => {
      queryClient.invalidateQueries("showPostComment");
    },
  });

  const postingReport = useMutation(postReport, {
    onSuccess: () => {},
  });

  const editsComment = useMutation(editingComment, {
    onSuccess: () => {
      queryClient.invalidateQueries("showPostComment");
    },
  });

  const commentHandler = (e) => {
    e.preventDefault();
    const commentInfo = { comment: comment, storeId: Number(id) };
    postingComment.mutate({ token, commentInfo });
  };

  function commentSet(e) {
    setComment(e.target.value);
  }

  function onDelete() {
    dlelteStoreItem.mutate({ token: token, id: id });
  }

  const clickReport = () => {
    setModal(!modal);
  };

  function onChangeReport(e) {
    setReport(e.target.value);
  }

  function submitReport(e) {
    e.preventDefault();
    postingReport.mutate({ token: token, storeId: id, reason: report });
    setModal(false);
  }

  function editHandler(id) {
    setEdit(!edit);
    setIds(id);
  }

  function changeEdit(e) {
    setEditComment(e.target.value);
  }

  function editForm(e) {
    e.preventDefault();
    const editBody = {
      comment: editComment,
      storeId: id,
    };
    editsComment.mutate({ token: token, commentId: ids, body: editBody });
  }

  return (
    <DetailBox>
      <NavWrapper>
        <Navbar>
          <Link to={"/"}>
            <FiChevronLeft size={40}></FiChevronLeft>
          </Link>
        </Navbar>
        <Navbar>
          <ReportIcon onClick={clickReport} size={37}></ReportIcon>
        </Navbar>
      </NavWrapper>
      <DetailContentBox>
        <KakaoMap id="mymap"></KakaoMap>
        <ContentName>
          <ContentNameText>
            <ContentNameTextTitle>
              {data?.content} : {data?.itemList[0]?.name}
            </ContentNameTextTitle>
            가격: {data?.itemList[0]?.price}원
          </ContentNameText>
        </ContentName>
        <ImageAndContentsBox>
          <ImageSize src={data?.imageURL} />
        </ImageAndContentsBox>
        <CommentListWrapper>
          {commentList?.map((item) => {
            return (
              <CommentList
                key={item.id}
                edithand={editHandler}
                item={item}
              ></CommentList>
            );
          })}
        </CommentListWrapper>
        {edit ? (
          <CommentForm onSubmit={commentHandler}>
            <CommentInput
              value={comment}
              onChange={commentSet}
              placeholder="리뷰를 입력해주세요."
            />
            <Btn commentBtn>
              <FiArrowUp size={33} />
            </Btn>
          </CommentForm>
        ) : (
          <CommentForm onSubmit={editForm}>
            <CommentInput
              value={editComment}
              onChange={changeEdit}
              placeholder="수정할 내용을 입력해주세요."
            />
            <SubmitButton commentBtn>
              <FiArrowUp size={33} />
            </SubmitButton>
          </CommentForm>
        )}

        <DeleteContain>
          <Btn
            deleteItem={onDelete}
            mainDelete
            children={"이 붕어빵은 작성자만 삭제가능해요."}
          ></Btn>
        </DeleteContain>
        {modal ? (
          <Madalback>
            <ModalContents>
              <ModalTitleBox>
                <ModalClose onClick={clickReport}>닫기</ModalClose>
                <ModalTitle>신고 사유를 입력해주세붕어.</ModalTitle>
              </ModalTitleBox>
              <ModalTextAreaDiv>
                <form onSubmit={submitReport}>
                  <ModalTextArea
                    value={report}
                    onChange={onChangeReport}
                    type="text"
                  />
                  <Btn small report children={"제출하기"}></Btn>
                </form>
              </ModalTextAreaDiv>
            </ModalContents>
          </Madalback>
        ) : null}
      </DetailContentBox>
    </DetailBox>
  );
}

const KakaoMap = styled.div`
  margin-top: 50px;
  height: 300px;
  width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.25rem;
`;

const DetailBox = styled.div`
  //border: 1px solid red;
  overflow: auto;
  height: 100%;
`;

const ReportIcon = styled(MdOutlineReport)`
  cursor: pointer;
`;

const DetailContentBox = styled.div`
  //border: 1px solid blue;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;
  margin-bottom: 3.125rem;
`;

const ContentName = styled.div`
  border: 3px solid white;
  border-radius: 30px;
  width: 300px;
  height: 50px;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "KCC-Ganpan";
`;

const ContentNameText = styled.div`
  //border: 1px solid blue;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ContentNameTextTitle = styled.div`
  margin-bottom: 5px;
`;

const ImageAndContentsBox = styled.div`
  //border: 2px solid black;
  height: 18.75rem;
  width: 21.875rem;
  margin-top: 3.125rem;
  margin-bottom: 2.5rem;
`;

const ImageSize = styled.img`
  height: 18.75rem;
  width: 21.875rem;
  border-radius: 20px;
`;

const DeleteContain = styled.div`
  //border: 0.0625rem solid black;
  margin-top: 1.875rem;
`;

const CommentListWrapper = styled.div`
  width: 450px;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.color.item_bg};
`;

const CommentForm = styled.form`
  //border: 0.0625rem solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 450px;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    border-radius: 15px;
  }
`;

const SubmitButton = styled(Btn)`
  background-color: ${({ theme }) => theme.color.btn_danger};
`;

const Madalback = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 11;
`;

const ModalTitleBox = styled.div`
  //border: 0.0625rem solid black;
  font-family: "KCC-Ganpan";
`;

const ModalClose = styled.span`
  position: relative;
  top: 10px;
  left: 10px;
  cursor: pointer;
  :hover {
    color: ${({ theme }) => theme.color.btn_danger};
  }
`;

const ModalTitle = styled.span`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

const ModalContents = styled.div`
  width: 400px;
  height: 350px;
  z-index: 999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.color.btn_success};
  border-radius: 10px;
`;

const ModalTextAreaDiv = styled.div`
  height: 100%;
  form {
    margin-top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
`;

const ModalTextArea = styled.textarea`
  width: 300px;
  height: 150px;
  resize: none;
  border-radius: 10px;
  outline: none;
`;

export default Detail;
