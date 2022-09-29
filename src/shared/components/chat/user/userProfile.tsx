import { blankAvatar } from "@/assets"
import { UserRes } from "@/models"
import moment from "moment"
import Image from "next/image"
import React from "react"

interface UserProfileProps {
  data: UserRes
}

export const UserProfile = ({ data }: UserProfileProps) => {
  return (
    <div>
      <div className="flex-center mb-24">
        <div className="mb-12 w-[80px] h-[80px] rounded-[50%] overflow-hidden">
          <Image
            src={data.avatar?.thumbnail_url || blankAvatar}
            layout="fill"
            alt=""
            objectFit="cover"
          />
        </div>
        <p className="text-lg font-semibold mb-16">{data.user_name}</p>
        <button className="bg-bg h-[32px] rounded-[5px] text-sm font-semibold">Nhắn tin</button>
      </div>

      <div className="p-16">
        <p className="text-base font-semibold">Thông tin cá nhân</p>

        <ul>
          <li className="flex items-start mb-12">
            <p className="text-xs w-[100px]">Bio</p>
            <p className="text-sm">{data?.bio || "Chưa có thông tin"}</p>
          </li>
          <li className="flex items-start mb-12">
            <p className="text-xs w-[100px]">Điện thoại</p>
            <p className="text-sm">{data?.phone || ""}</p>
          </li>
          <li className="flex items-start">
            <p className="text-xs w-[100px]">Giới tính</p>
            <p className="text-sm">
              {data?.gender === "female" ? "Nữ" : data.gender === "male" ? "Nam" : "Khác"}
            </p>
          </li>
          <li className="flex items-start">
            <p className="text-xs w-[100px]">Ngày sinh</p>
            <p className="text-sm">
              {data?.date_of_birth ? moment(data.date_of_birth) : "Chưa có thông tin"}
            </p>
          </li>
        </ul>
      </div>
    </div>
  )
}
