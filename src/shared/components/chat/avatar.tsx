import { blankAvatar } from "@/assets"
import Image from "next/image"

interface RoomAvatarProps {
  avatar: string
  isOnline?: boolean
  avatarGroup?: string[]
  isGroup: boolean
  memberCount?: number
}

export const Avatar = ({
  avatar,
  isOnline,
  avatarGroup,
  isGroup,
  memberCount = 2,
}: RoomAvatarProps) => {
  return (
    <div className="w-[46px] h-[46px] rounded-[50%] relative">
      {isGroup && !avatar ? (
        <div className="flex-center flex-wrap">
          <>
            {avatarGroup?.slice(0, memberCount <= 4 ? 4 : 3)?.map((item, index) => (
              <div
                key={index}
                style={{
                  left: index === 0 || index === 2 ? 2 : -2,
                  top: index === 0 || index === 1 ? 2 : -2,
                }}
                className={`relative w-[23px] h-[23px] rounded-[50%] overflow-hidden border border-solid border-border-color-2 bg-white-color`}
              >
                <Image
                  src={item || blankAvatar}
                  alt=""
                  className="rounded-[50%]"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}

            {memberCount > 4 ? (
              <div
                className={`relative top-[-2px] left-[-2px] w-[23px] h-[23px] rounded-[50%] overflow-hidden border border-solid border-border-color-2 bg-bg flex-center text-[11px] text-gray-color-4 font-semibold`}
              >
                {memberCount - 3}
              </div>
            ) : null}
          </>
        </div>
      ) : (
        <Image
          src={avatar || blankAvatar}
          alt=""
          className="rounded-[50%]"
          layout="fill"
          objectFit="cover"
        />
      )}
      {isOnline ? (
        <span className="absolute right-0 bottom-[4px] w-[8px] h-[8px] bg-[#22DF64] shadow-shadow-1 rounded-[50%] z-10"></span>
      ) : null}
    </div>
  )
}
