import { CommonAvatar, ModalSm, UserItem } from "@/components"
import { useAsync } from "@/hooks"
import { AttachmentRes, RoomInfoRes, TopMemberRes, UpdateRoomInfoForm } from "@/models"
import {
  setCurrentProfileId,
  setCurrentRoomId,
  setCurrentRoomInfo,
  updateCurrentRoomInfo,
} from "@/modules"
import { chatApi } from "@/services"
import { useState } from "react"
import { FiEdit3 } from "react-icons/fi"
import { useDispatch } from "react-redux"
import { ModalChangeAvatar } from "./modalChangeRoomAvatar"
import { ModalChangeRoomName } from "./modalChangeRoomName"

interface ModalRoomInfoProps {
  data: RoomInfoRes & { members: TopMemberRes[] }
}

export const ModalRoomInfo = ({ data }: ModalRoomInfoProps) => {
  const { asyncHandler } = useAsync()
  const dispatch = useDispatch()
  const [showModalChangeRoomName, setShowModalChangeRoomName] = useState<boolean>(false)
  const [showModalChangeRoomAvatar, setShowModalChangeRoomAvatar] = useState<boolean>(false)

  const closeModal = () => {
    dispatch(setCurrentRoomInfo(undefined))
  }

  const handleTakeConversation = () => {
    dispatch(setCurrentRoomId(data.room_id))
    document.querySelector(`.room-item-${data.room_id}`)?.scrollIntoView()
    dispatch(setCurrentRoomInfo(undefined))
  }

  const updateRoomAvatar = async (formData: FormData, onSuccess?: (_: AttachmentRes) => void) => {
    asyncHandler<AttachmentRes>({
      fetcher: chatApi.uploadSingleImage(formData),
      config: { showScreenLoading: true, showErrorMsg: true },
      onSuccess: (data) => onSuccess?.(data),
    })
  }

  const updateRoomInfo = async (params: UpdateRoomInfoForm, cb?: Function) => {
    asyncHandler<RoomInfoRes>({
      fetcher: chatApi.updateRoomInfo({
        ...params,
        room_id: data.room_id,
      }),
      config: { showScreenLoading: true, showErrorMsg: true },
      onSuccess: (data) => {
        dispatch(
          updateCurrentRoomInfo({
            room_avatar: data?.room_avatar,
            room_id: data.room_id,
            room_name: data?.room_name || "",
          })
        )
        cb?.()
        // mutate("get_room_list")
        // mutate("get_room_list")
      },
    })
  }

  return (
    <>
      <div className="modal-room-info">
        <ModalSm
          zIndex={2990}
          className="max-w-[350px]"
          onClose={closeModal}
          title="Thông tin nhóm"
        >
          {data ? (
            <div className="overflow-auto max-h-[550px]">
              <div className="p-16 border-b border-border-color border-solid">
                <div className="flex-center flex-col">
                  <CommonAvatar
                    onClick={() => setShowModalChangeRoomAvatar(true)}
                    size={72}
                    url={data?.room_avatar?.thumbnail_url || ""}
                    className="mb-12"
                  />

                  <div className="flex items-center">
                    <p className="text-base flex-1 font-semibold line-clamp-1 word-break mr-8">
                      {data.room_name}
                    </p>

                    <button
                      onClick={() => setShowModalChangeRoomName(true)}
                      className="w-[22px] h-[22px] rounded-[50%] flex-center bg-bg"
                    >
                      <FiEdit3 size={12} />
                    </button>
                  </div>

                  <button
                    onClick={handleTakeConversation}
                    className="bg-bg h-[32px] px-32 py-4 rounded-[5px] text-sm font-semibold mt-16"
                  >
                    Nhắn tin
                  </button>
                </div>
              </div>

              <div className="py-10">
                <p className="text-base font-semibold mb-12 px-16">
                  Thành viên ({data.members?.length || 0})
                </p>
                <div className="r">
                  {data.members?.map((item, index) => (
                    <UserItem
                      onClick={() => dispatch(setCurrentProfileId(item.user_id))}
                      key={item.user_id}
                      data={{
                        avatar: item.user_avatar,
                        user_id: item.user_id,
                        user_name: item.user_name,
                      }}
                      className="hover:bg-bg px-16 py-12"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </ModalSm>
      </div>

      {showModalChangeRoomName ? (
        <ModalChangeRoomName
          avatar={data?.room_avatar?.url || ""}
          initialName={data?.room_name || ""}
          onClose={() => setShowModalChangeRoomName(false)}
          onSubmit={(room_name) =>
            updateRoomInfo({ room_name }, () => {
              setShowModalChangeRoomName(false)
            })
          }
        />
      ) : null}

      {showModalChangeRoomAvatar ? (
        <ModalChangeAvatar
          avatar={data?.room_avatar?.url || ""}
          onClose={() => setShowModalChangeRoomAvatar(false)}
          onSubmit={(data) => {
            updateRoomAvatar(data, (res) => {
              updateRoomInfo({ room_avatar_id: res.attachment_id }, () => {
                setShowModalChangeRoomAvatar(false)
              })
            })
          }}
        />
      ) : null}
    </>
  )
}
