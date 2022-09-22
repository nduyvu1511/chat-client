import { KeyedMutator } from "swr"
import { AxiosPromise } from "axios"
import { NextPage } from "next"
import { AppProps } from "next/app"
import { ForwardedRef, ReactChild, ReactElement, ReactNode } from "react"
import { UserRole } from "./user"

export interface HasChildren {
  children: ReactChild
}

export interface LayoutProps {
  children: ReactNode
}

export type NextPageWithLayout = NextPage & {
  Layout?: (props: LayoutProps) => ReactElement
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export interface PayloadType<T> {
  payload: T
}

export interface UseParams<T, U> {
  params: T
  onSuccess?: (params: U) => void
  onError?: Function
  config?: FetcherConfig
}

export interface HasChildren {
  children: ReactChild
}

export interface LayoutProps {
  children: ReactNode
}

export interface PayloadBoolean {
  payload: boolean
}

export interface PayloadString {
  payload: string
}

export interface PayloadNumber {
  payload: number
}

export interface OptionModel {
  label: string
  value: string | number
}

export interface NumberSeatOptionModel {
  label: string
  value: number
  number_seat: number
}

export type AttachmentRouteType = "common" | "avatar"

export interface SidebarItem {
  path: string
  label: string
  icon: ReactNode
  child?: { path: string; label: string; icon?: ReactNode }[]
}

export type TimeType = "day" | "second" | "hour" | "minute" | "year" | "month" | "week"

export interface ResponseType<T> {
  status_code: 200 | 400 | 401 | 404 | 409
  success: boolean
  message: string
  data: T
}

export type AuthModalType =
  | "login"
  | "resetPassword"
  | "sms"
  | "register"
  | "updateProfile"
  | undefined
export type OnForwaredResetForm = ForwardedRef<{ onReset: Function }>

export interface ActivityItem<T> {
  label: string
  value: T
  color: string
}

export interface AccountLayoutProps {
  children: ReactNode
  title?: string
  desc?: string
  showHeaderMobile?: boolean
}

export interface BookingLayoutProps {
  children: ReactNode
  title?: string
  rightNode: ReactNode
  showLoading?: boolean
  topNode?: ReactNode
  stickyRight?: boolean
  onBackBtnClick?: Function
  className?: string
  showHeaderOnMobile?: boolean
  showHeaderDesktop?: boolean
  overflowHidden?: boolean
}

declare module "axios" {
  export interface AxiosResponse<T> {
    message: string
    success: boolean
    status_code: 200 | 400 | 401 | 404 | 409
    data: T
  }
}

export interface ListQuery {
  limit?: number
  offset?: number
}

export type TransitionDirection = "up" | "down" | "right" | "left"

export interface CalcDistanceRes {
  distance: number
  duration: number
}

export interface FetcherConfig {
  showScreenLoading?: boolean
  errorMsg?: string
  successMsg?: string
  showErrorMsg?: boolean
  toggleOverFlow?: boolean
}

export interface UseQueryListRes<T> {
  isValidating: boolean
  hasMore: boolean
  filterList: (fetcher: AxiosPromise, cb?: Function, err?: Function) => void
  fetchMoreItem: (fetcher: AxiosPromise, cb?: Function, err?: Function) => void
  isFetchingMore: boolean
  offset: number
  data: T | undefined
  error: any
  isInitialLoading: boolean
  mutate: KeyedMutator<any>
}

export interface ContactParams {
  name: string
  phone: string
  email?: string
  description?: string
  receive_news?: boolean
}

export type ContactFormKey = keyof ContactParams

export interface QueryCommonParams {
  limit: number
  offset: number
}

export interface ListParams<T> {
  limit: number
  offset: number
  total: number
  data: T
}

export interface ListRes<T> {
  hasMore: boolean
  limit: number
  offset: number
  total: number
  data: T
}

export interface Lnglat {
  lng: string
  lat: string
}

type AttachmentType = "image" | "video" | "voice"

export interface IAttachment {
  _id: string
  url: string
  thumbnail_url: string
  desc: string
  attachment_type: AttachmentType
  created_at: Date
  updated_at: Date
}

export type AttachmentRes = Pick<IAttachment, "thumbnail_url" | "url" | "attachment_type"> & {
  attachment_id: string
}

export interface AttachmentId {
  attachment_id: string
  url: string
}

export interface ServiceQueryListRes<T> {
  total: number
  data: T
}

export interface ITag {
  _id: string
  text: string
  role: UserRole
  created_at: Date
  updated_at: Date
}

export interface TagRes {
  tag_id: string
  text: string
}

export type CreateAttachment = Pick<IAttachment, "attachment_type" | "url" | "thumbnail_url"> & {
  desc?: string
}

export type UpdateAttachment = Partial<
  Pick<IAttachment, "attachment_type" | "url" | "thumbnail_url" | "desc" | "updated_at">
> & {
  attachment_id: string
}

export interface CreateTagMessage {
  role: UserRole
  text: string
}

export type UpdateTagMessage = Partial<CreateTagMessage> & {
  tag_id: string
}

export type OnResetParams = {
  onReset: () => void
}

export interface ImageWithId {
  id: string
  url: string
}

export interface AttachmentResult {
  formData: FormData
  previewImages: ImageWithId[]
}
