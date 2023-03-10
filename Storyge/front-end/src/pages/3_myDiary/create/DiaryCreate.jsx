import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Clock from "react-live-clock";
import Modal from "../Modal";
import * as S from "./DiaryCreateStyle";
import * as G from "styles/index";
import Switch from "react-switch";
import { OpenAI } from "../../../openai/OpenAI";

import { BiLockAlt, BiLockOpenAlt } from "react-icons/bi";

import { getCount } from "api/diary/getCount";

export default function Creatediary() {
  const navigate = useNavigate();
  const contentRef = useRef();
  const [count, setCount] = useState(0);
  const [content, setContent] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [info, setInfo] = useState(["emotion", "분석 건너뜀"]);
  const [spinner, setSpinner] = useState(false);
  const [checked, setChecked] = useState(false);
  const [num, setNum] = useState(0);

  useEffect(() => {
    async function getDiaryCount() {
      const response = await getCount();
      setCount(response);
    }
    getDiaryCount();
  }, [count]);

  async function getInfo(content, setModalOpen) {
    await OpenAI({ input: content, type: 1 })
      .then((data1) => {
        OpenAI({ input: data1[1], type: 2 })
          .then((data2) => {
            setSpinner(false);
            setModalOpen(true);
            setInfo([data1[0], data2]);
          })
          .catch((err) => {
            console.log(err);
            setNum(1);
            setModalOpen(true);
          });
      })
      .catch((err) => {
        console.log(err);
        setNum(1);
        setModalOpen(true);
      });
  }

  function onChange(e) {
    setContent(e.target.value);
    if (content.length > 99) {
      alert("일기는 100자 이하로 입력 가능합니다.");
      setContent(content.substr(0, 99));
    }
  }
  async function isWritten() {
    if (content.length === 0) {
      alert("일기 내용을 입력해주세요.");
    } else if (content.length > 100) {
    } else {
      // 일기를 작성 할 수 있는 횟수 검사
      if (count < 24) {
        setSpinner(true);
        const test = await getInfo(content, setModalOpen);
        setInfo(test);
      } else {
        alert("하루 작성 가능 24개의 일기를 모두 작성하셨습니다.");
      }
    }
  }

  useEffect(() => {
    if (content.length !== 0) {
      // 새로고침과 타 사이트 이동 방지
      window.onbeforeunload = function(e) {
        return "페이지 나감?";
      };
    }
  }, []);

  function goback() {
    if (content.length === 0) {
      navigate(-1);
    } else {
      const check = window.confirm(
        "작성중인 글이 있습니다. 페이지를 나가면 변경사항이 저장되지 않을 수 있습니다. 이전 페이지로 가시겠습니까?"
      );

      if (check) {
        navigate(-1);
      }
    }
  }

  return (
    <>
      <S.Container>
        <h1>일기 작성 페이지</h1>

        <S.DateContainer>
          <div style={{ color: "var(--color-grey-dark)", fontSize: "12px" }}>
            &nbsp;작성날짜&nbsp;
          </div>
          <div style={{ fontFamily: "S-CoreDream-5Medium" }}>
            <Clock format={"YYYY.MM.DD"} ticking={true} />
          </div>
          <div style={{ color: "var(--color-grey-dark)", fontSize: "12px" }}>
            &nbsp;작성시간&nbsp;
          </div>
          <div style={{ fontFamily: "S-CoreDream-5Medium" }}>
            <Clock format={"HH:mm"} ticking={true} />
          </div>
        </S.DateContainer>

        <S.card backgroundColor="var(--color-white)">
          <S.TextBox
            type="text"
            placeholder="현재의 상황을 입력해주세요."
            ref={contentRef}
            value={content}
            onChange={onChange}
          />
          <S.CardFoot height="30px" backgroundColor="var(--color-white)">
            <S.CountDiary>{content.length} / 100</S.CountDiary>

            {!checked ? (
              <div
                style={{ display: "flex", marginRight: "20px" }}
                onClick={() => {
                  setChecked(!checked);
                }}
              >
                <BiLockOpenAlt fontSize="20px" color="var(--color-primary)" />
              </div>
            ) : (
              <div
                style={{ display: "flex", marginRight: "20px" }}
                onClick={() => {
                  setChecked(!checked);
                }}
              >
                <BiLockAlt font-size="20px" color="var(--color-warning)" />
              </div>
            )}
          </S.CardFoot>
        </S.card>
        <div>
          <S.Middle>
            <div>오늘 남은 일기 : {24 - count}</div>
          </S.Middle>
          <div>
            <G.longBtnDefault onClick={isWritten}>
              감정분석하기
            </G.longBtnDefault>
          </div>
          <G.longBtnBorder onClick={goback}>취소</G.longBtnBorder>
        </div>
      </S.Container>
      {modalOpen && (
        <Modal
          setModalOpen={setModalOpen}
          diary={content}
          content={info}
          num={num}
          classify="create"
          scope={checked ? 0 : 1}
        />
      )}
      {spinner && (
        <Modal setModalOpen={setModalOpen} content={info} num={2}>
          여긴가?
        </Modal>
      )}
    </>
  );
}
