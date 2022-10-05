import { InputSearch, Spinner } from "@/components"
import { RootState } from "@/core/store"
import { useRoom } from "@/hooks"
import { RoomFunctionHandler, RoomRes } from "@/models"
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useSelector } from "react-redux"
import { RoomItem } from "./roomItem"
import { RoomSearch } from "./roomSearch"

export type OnForwaredRoomDetail = ForwardedRef<RoomFunctionHandler>

interface RoomProps {
  onSelectRoom?: (room: RoomRes) => void
}

export const Room = forwardRef(function RoomChild(
  { onSelectRoom }: RoomProps,
  ref: OnForwaredRoomDetail
) {
  // const socket = useSelector((state: RootState) => state.chat.socket)
  const roomId = useSelector((state: RootState) => state.chat.currentRoomId) as string
  const [showSearch, setShowSearch] = useState<boolean>()

  const {
    data,
    changeStatusOfRoom,
    messageUnreadhandler,
    increaseMessageUnread,
    changeOrderAndAppendLastMessage,
    appendLastMessage,
    clearMessagesUnreadFromRoom,
    fetchMoreRooms,
    isFetchingMore,
    hasMore,
  } = useRoom(roomId)

  useImperativeHandle(ref, () => ({
    messageUnreadhandler: (mes) => {
      messageUnreadhandler(mes)
    },
    changeStatusOfRoom: (params) => {
      changeStatusOfRoom(params)
    },
    increaseMessageUnread: (params) => {
      if (params.room_id !== roomId) {
        increaseMessageUnread(params)
      }
    },
    changeOrderAndAppendLastMessage: (params) => {
      changeOrderAndAppendLastMessage(params)
    },
    appendLastMessage: (params) => {
      appendLastMessage(params)
    },
  }))

  useEffect(() => {
    if (!data?.data?.length || !roomId) return
    clearMessagesUnreadFromRoom(roomId)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  return (
    <div className="chat-room flex-1 flex flex-col relative">
      {showSearch ? (
        <div className="bg-white-color z-10 flex flex-col flex-1">
          <RoomSearch
            currentRoomSelected={roomId}
            onSelectRoom={onSelectRoom}
            onClose={() => setShowSearch(false)}
            onOpen={() => setShowSearch(true)}
          />
        </div>
      ) : (
        <>
          <div className="h-[48px] lg:pr-12 mb-24">
            <InputSearch
              attributes={{ placeholder: "Tìm kiếm" }}
              onFocus={() => setShowSearch(true)}
            />
          </div>

          {data && data?.data?.length > 0 ? (
            <div className="flex-1 flex flex-col chat-room-list">
              {/* <p className="text-base font-semibold mb-16">Tin nhắn</p> */}
              <div className="flex-1 overflow-y-auto lg:pr-12" id="scrollableDiv">
                <InfiniteScroll
                  scrollableTarget="scrollableDiv"
                  loader={isFetchingMore ? <Spinner /> : null}
                  hasMore={hasMore}
                  next={() => fetchMoreRooms()}
                  dataLength={data?.data?.length}
                >
                  {data.data.map((item) => (
                    <RoomItem
                      isActive={item.room_id === roomId}
                      onSelectRoom={onSelectRoom}
                      key={item.room_id}
                      data={item}
                    />
                  ))}
                </InfiniteScroll>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
})
