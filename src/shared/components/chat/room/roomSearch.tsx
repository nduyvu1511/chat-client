import { InputSearch, Spinner } from "@/components/common"
import { RootState } from "@/core/store"
import { useQueryList } from "@/hooks"
import { ListRes, RoomRes } from "@/models"
import { addRoomHistory, deleteRoomHistory } from "@/modules"
import { chatApi } from "@/services"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useDispatch, useSelector } from "react-redux"
import { RoomItem } from "./roomItem"

interface RoomSearchProps {
  onOpen?: Function
  onClose?: Function
  onSelectRoom?: (_: RoomRes) => void
  currentRoomSelected?: string
}

export const RoomSearch = ({
  onClose,
  onOpen,
  onSelectRoom,
  currentRoomSelected,
}: RoomSearchProps) => {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState<string>()
  const roomHistory = useSelector((state: RootState) => state.roomHistory.data)
  const { data, isValidating, filterList, offset } = useQueryList<ListRes<RoomRes[]>>({
    initialData: undefined,
    fetcher: chatApi.getRoomList,
    key: "get_room_list_search",
  })

  useEffect(() => {
    ;(document.querySelector(".room-search-input .form-input") as HTMLInputElement)?.focus()
  }, [])

  return (
    <>
      <div className="h-[48px] flex items-center">
        <InputSearch
          className="room-search-input"
          onFocus={() => onOpen?.()}
          onChange={(search_term) => {
            setSearchTerm(search_term)
            if (search_term) {
              filterList(chatApi.getRoomList({ offset, search_term }))
            }
          }}
          attributes={{ placeholder: "Tìm kiếm" }}
        />

        <button
          onClick={() => onClose?.()}
          className="px-8 py-4 hover:bg-bg text-sm font-semibold rounded-[5px] ml-12"
        >
          Đóng
        </button>
      </div>

      <div className="mt-24">
        {searchTerm ? (
          data?.data ? (
            <InfiniteScroll
              className="mt-16"
              hasMore={data?.hasMore}
              dataLength={data.data.length}
              loader={<Spinner />}
              next={() => {}}
            >
              <p className="text-sm font-semibold mb-8">Kết quả tìm kiếm ({data.total})</p>
              {data.data.map((item) => (
                <RoomItem
                  isActive={currentRoomSelected === item.room_id}
                  type="search"
                  data={item}
                  onSelectRoom={(val) => {
                    onSelectRoom?.(val)
                    if (!roomHistory?.some((item) => item.room_id === val.room_id)) {
                      dispatch(addRoomHistory(item))
                    }
                    console.log(val)
                  }}
                  key={item.room_id}
                />
              ))}
            </InfiniteScroll>
          ) : null
        ) : (
          <>
            <p className="text-sm font-semibold mb-8">Tìm gần đây</p>
            {roomHistory.map((item) => (
              <RoomItem
                isActive={currentRoomSelected === item.room_id}
                onDeleteHistory={({ room_id }) => dispatch(deleteRoomHistory(room_id))}
                type="history"
                data={item}
                onSelectRoom={(val) => {
                  onSelectRoom?.(val)
                }}
                key={item.room_id}
              />
            ))}
          </>
        )}
      </div>
    </>
  )
}
