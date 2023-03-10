import React, { useEffect, useState } from 'react'
import * as G from '../../../styles/index'
import * as S from './OtherDiaryListStyle'
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb'
import { useLocation, useNavigate } from 'react-router'
import Emoji from 'components/emoji/Emoji'
import dayjs from 'dayjs'
import { getOtherDiaryList } from 'api/diary/getOtherDiaryList'

export default function OtherDiaryList() {
  const location = useLocation()
  const movePage = useNavigate()

  //넘어온 날짜 값
  const [dateInfo, setDateInfo] = useState(location.state.date)
  const [otherId] = useState(location.state.otherId)

  //해당 날짜의 상대방 일기 목록들
  const [ohterDiaryListData, setOtherDiaryListData] = useState([])

  useEffect(() => {
    async function getAndSetOtherDiaryList() {
      const response = await getOtherDiaryList(
        dayjs(dateInfo).format('YYYY-MM-DD'),
        otherId,
      )
      setOtherDiaryListData(response)
    }
    getAndSetOtherDiaryList()
  }, [dateInfo])

  //내 일기 상세 조회 페이지로 이동
  function goDiaryDetail(diaryId) {
    movePage('/diary', { state: { diaryId: diaryId } })
  }

  //년월일 표시
  const headDate = `${dateInfo.getFullYear()}.${
    dateInfo.getMonth() + 1
  }.${dateInfo.getDate()}`

  //일자 감소
  const decreaseDate = () => {
    setDateInfo(
      new Date(
        dateInfo.getFullYear(),
        dateInfo.getMonth(),
        dateInfo.getDate() - 1,
      ),
    )
  }

  //일자 증가
  const increaseDate = () => {
    setDateInfo(
      new Date(
        dateInfo.getFullYear(),
        dateInfo.getMonth(),
        dateInfo.getDate() + 1,
      ),
    )
  }
  return (
    // 날짜 표시 및 날짜이동 부분
    <G.BodyContainer>
      <S.DateContainer>
        <S.ArrowBtn onClick={decreaseDate}>
          <TbChevronLeft color="var(--color-primary)" />
        </S.ArrowBtn>
        <S.DateInfo>{headDate}</S.DateInfo>
        <S.ArrowBtn onClick={increaseDate}>
          <TbChevronRight color="var(--color-primary)" />
        </S.ArrowBtn>
      </S.DateContainer>

      {/* 리스트 부분 */}
      {ohterDiaryListData.length === 0 ? (
        <div>이 날의 작성된 일기가 없어요!</div>
      ) : (
        ohterDiaryListData.map((data, index) => {
          return (
            <S.ListBox key={index} onClick={() => goDiaryDetail(data.diaryId)}>
              <Emoji emotion={data.emoticonName} thisWidth="13%" />
              <S.TimeSummaryContainer>
                <S.Time>{dayjs(data.createdAt).format('HH:mm')}</S.Time>
                <S.Summary>{data.diaryContent}</S.Summary>
              </S.TimeSummaryContainer>
            </S.ListBox>
          )
        })
      )}
    </G.BodyContainer>
  )
}
