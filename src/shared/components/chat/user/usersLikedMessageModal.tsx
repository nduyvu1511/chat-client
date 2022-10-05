import { blankAvatar } from "@/assets"
import { ModalSm } from "@/components"
import { MessageReactionType, UserReactionRes, UsersLikedMessageRes } from "@/models"
import { setCurrentMessageEmotionId, setCurrentProfileId } from "@/modules"
import { chatApi } from "@/services"
import { AxiosResponse } from "axios"
import { useState } from "react"
import { useDispatch } from "react-redux"
import useSWR from "swr"
import { MessageReactionIcon } from "../message"
import { UserItem } from "./userItem"

interface Props {
  messageId: string
}

export const UsersLikedMessageModal = ({ messageId }: Props) => {
  const dispatch = useDispatch()
  const { data, error, isValidating } = useSWR<UsersLikedMessageRes | undefined>(
    messageId ? `get_users_liked_message_${messageId}` : null,
    () =>
      chatApi.getUsersLikedMessage(messageId).then((res: AxiosResponse<UsersLikedMessageRes>) => {
        const { data } = res
        setCurrentSelect({ data: data?.["all"] || [], key: "all" })
        return data
      })
  )

  const [currentSelect, setCurrentSelect] = useState<
    { key: string; data: UserReactionRes[] } | undefined
  >()

  const closeModal = () => {
    dispatch(setCurrentMessageEmotionId(undefined))
  }

  const handleChangeReactions = (key: string) => {
    setCurrentSelect({
      key,
      data: data?.[key] || [],
    })
  }

  return (
    <ModalSm
      showLoading={isValidating}
      className="max-w-[440px]"
      onClose={closeModal}
      title="Chi tiết tin nhắn"
    >
      <>
        {data ? (
          <div className="flex-1 bg-gray-05 border-b border-solid border-border-color">
            <div className="flex items-center border-b border-solid border-border-color px-16 w-full overflow-x-auto">
              {Object.entries(data).map(([key]) => (
                <button
                  key={key}
                  onClick={() => handleChangeReactions(key)}
                  className={`mr-16 last:mr-0 relative flex-center py-12 ${
                    currentSelect?.key === key ? "text-primary" : "text-gray-color-3"
                  }`}
                >
                  {key === "all" ? (
                    <p className="text-14 font-semibold whitespace-nowrap">Tất cả</p>
                  ) : (
                    <MessageReactionIcon
                      size={22}
                      emotion_type={key as MessageReactionType}
                      key={key}
                    />
                  )}
                  <span
                    className={`text-12 font-semibold ml-4 ${currentSelect?.key === key ? "" : ""}`}
                  >
                    {data?.[key]?.length || 0}
                  </span>

                  {currentSelect?.key === key ? (
                    <span className="h-1 bg-primary w-full absolute bottom-[-1px] rounded-[20px] left-[-2px]"></span>
                  ) : null}
                </button>
              ))}
            </div>
            {currentSelect?.data?.length ? (
              <div className="px-16 py-8 h-[250px] overflow-y-auto">
                {currentSelect.data.map((item) => (
                  <UserItem
                    onClick={(id) => dispatch(setCurrentProfileId(id))}
                    className="my-10"
                    key={item.user_id}
                    data={{
                      avatar: item?.avatar || blankAvatar,
                      user_id: item.user_id,
                      user_name: item.user_name,
                      reaction: item.reaction,
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </>
    </ModalSm>
  )
}
