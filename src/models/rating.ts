import { TimeType } from "./common"

export type RatingRangePost = 1 | 2 | 3 | 4 | 5
export type RatingRange = 0 | 1 | 2 | 3 | 4 | 5

export interface CreateRatingParams {
  compounding_car_customer_id: number
  rating_number: number
  rating_tag_ids?: number[]
  rating_content: string
}

export interface CreateRatingFormParams {
  rating_number: number
  rating_tag_ids?: number[]
  rating_content: string
}

export type UpdateRatingParams = Partial<CreateRatingParams> & {
  rating_id: number
}

export interface DeleteRatingParams {
  rating_id: number
}

export interface ReportRatingParams extends ReportRatingFormParams {
  rating_id: number
}

export interface ReportRatingFormParams {
  reported_reason_ids?: number[]
  reported_reason_other?: string
}

export interface RatingTagRes {
  tag_id: number
  tag_content: string
}

export interface RatingRes {
  compounding_car_customer_id: number
  compounding_car_id: number
  compounding_car_customer_name: "Compounding: From TP Đà Nẵng to TP Hồ Chí Minh"
  partner_id: {
    partner_id: number
    partner_name: string
    avatar_url: {
      image_id: number
      image_url: string
    }
  }
  duration: {
    time_value: number
    time_type: TimeType
  }
  rating_id: number
  rating_tag_ids: RatingTagRes[]
  rating_number: RatingRangePost
  rating_content: string
  rating_reported: "waiting" | false | "reported"
  rating_editable: boolean
}

export interface RatingReportReasonRes {
  reason_id: number
  reason_content: string
}
