import { ListQuery, TimeType } from "./common"

export interface SavePromotionParams {
  promotion_id: number
}

export interface GetDetailPromotionParams {
  promotion_id: number
}

export interface ApplyPromotionCustomerParams {
  promotion_id: number
  compounding_car_customer_id: number
}

export interface ApplyPromotionDriverParams {
  promotion_id: number
  compounding_car_id: number
}

export interface SearchPromotionParams extends ListQuery {
  promotion_code: string
}

export interface CancelPromotionCustomerParams {
  compounding_car_customer_id: number
}

export interface CancelPromotionDriverParams {
  compounding_car_id: number
}

export type PromotionType = "percentage" | "fixed"

export interface PromotionDuration {
  time_value: number
  time_type: TimeType
}

export interface PromotionRes {
  promotion_id: number
  promotion_code: string
  promotion_name: string
  promotion_type: PromotionType
  promotion_value: {
    value: number
    unit: string
  }
  promotion_brief: string
  saved_promotion: boolean
  date_start: string
  date_end: string
  duration_start: PromotionDuration
  duration_end: PromotionDuration
  promotion_image_url: {
    image_id: number
    image_url: string
  }
}

export type PromotionDetailRes = Pick<
  PromotionRes,
  | "promotion_id"
  | "promotion_code"
  | "duration_start"
  | "duration_end"
  | "promotion_value"
  | "promotion_name"
  | "promotion_type"
  | "saved_promotion"
  | "date_end"
  | "date_start"
> & {
  promotion_image_url: {
    image_id: string
    image_url: string
  }
  description: false
  special_time: {
    is_specific_time: boolean
    time_start: number
    time_end: number
  }
  promotion_process: {
    used_promo: number
    total_promo: number
  }
}
