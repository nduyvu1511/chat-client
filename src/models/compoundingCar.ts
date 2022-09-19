import { PaymentMethod } from "./checkout"
import { ListQuery, OptionModel } from "./common"
import { FromLocation, ProvinceId, StationId, StationParams, StationPickUpParams } from "./location"
import { PromotionRes } from "./promotion"
import { RatingRes } from "./rating"
import { CarAccountType, CarDriverId, GenderType, UserInfo } from "./user"

export type HourWaitTimeType =
  | "01_hour"
  | "02_hour"
  | "03_hour"
  | "04_hour"
  | "05_hour"
  | "06_hour"
  | "07_hour"
  | "08_hour"
  | "09_hour"
  | "10_hour"
  | "11_hour"
  | "12_hour"
export type QualityCarType = "5_star" | "4_star" | "3_star"
export type CompoundingType = "one_way" | "two_way" | "compounding" | "convenient"
export type CompoundingCarDriverState =
  | "draft" //danh cho tien chuyen
  | "waiting_deposit" //cho dat coc
  | "waiting"
  | "confirm_deposit" //dat coc xong
  | "confirm" //xac nhan cho don tien chuyen
  | "start_running"
  | "stop_picking"
  | "done" // hoan thanh
  | "cancel" //huy chuyen di
export type CompoundingCarCustomerState =
  | "draft"
  | "confirm"
  | "deposit"
  | "waiting" //dang cho tai xe
  | "assign" //dang tim tai xe
  | "in_process" //dang di chuyen
  | "done" //hoan thanh
  | "customer_pay" //thanh toan online
  | "confirm_paid" //thanh toan het
  | "cancel" //huy
  | "waiting_customer"

export interface VehicleTypeParams {
  car_id: number
  name: string
  number_seat: number
}

export interface CarId extends VehicleTypeParams {}

export interface VehicleBrandRes {
  icon: {
    icon_id: number
    icon_url: string
  }
  brand_id: number
  brand_name: string
}

export interface ActivityCarId extends CarId {
  icon: {
    icon_id: string
    icon_url: string
  }
}

export interface GetPriceUnitParams {
  from_province_id: number
  to_province_id: number
  car_id: number
  quality_car?: QualityCarType
}

export interface CarIdType {
  label: string
  value: number
  number_seat: number
}

export interface CreateCommonCompoundingForm {
  from_location: FromLocation
  to_location: FromLocation
  car_id: OptionModel
  note?: string
  expected_going_on_date: string
  distance: number
  duration?: number
  is_checked_policy: boolean
}

export interface CreateOneWayCompoundingCarForm extends CreateCommonCompoundingForm {
  price?: number
}

export interface CreateCommonCompoundingForm {
  from_location: FromLocation
  to_location: FromLocation
  car_id: OptionModel
  note?: string
  expected_going_on_date: string
  distance: number
  is_checked_policy: boolean
  price?: number
}

export interface DriverActivityRes {
  compounding_car_id: number
  compounding_car_code: string
  compounding_car_name: string
  car_driver_id: CarDriverId
  compounding_type: CompoundingType
  from_province: ProvinceId
  to_province: ProvinceId
  expected_going_on_date: string
  expected_picking_up_date: string
  car: ActivityCarId
  quality_car: VehicleTypeParams
  number_seat_in_car: number
  number_available_seat: number
  state: CompoundingCarDriverState
  price_unit: PriceUnit
  note: string
  second_remains: number
  is_a_day_tour: boolean
  hour_of_wait_time: HourWaitTimeType
}

export interface CustomerActivityRes {
  compounding_car_id: number
  compounding_car_name: string
  compounding_car_customer_id: number
  compounding_type: CompoundingType
  expected_going_on_date: string
  expected_picking_up_date: string
  car: ActivityCarId
  from_province: ProvinceId
  from_pick_up_station: StationPickUpParams
  is_picking_up_from_start: boolean
  from_address: string
  from_longitude: string
  from_latitude: string
  to_province: ProvinceId
  to_pick_up_station: StationPickUpParams
  is_taking_to_final_destination: boolean
  to_address: string
  to_longitude: string
  to_latitude: string
  is_a_day_tour: string
  hour_of_wait_time: string
  distance: number
  number_seat: number
  amount_total: number
  down_payment: DownPayment
  amount_due: number
  state: CompoundingCarCustomerState
  second_remains: number
}

export interface DownPayment {
  total: number
  percent: number
}

export interface CompoundingCarRes extends DriverActivityRes {
  from_pick_up_station: RideStation
  from_address: string
  from_longitude: string
  from_latitude: string
  to_pick_up_station: RideStation
  to_address: string
  to_longitude: string
  to_latitude: string
  distance: number
  duration?: number
  rating_ids: RatingRes[]
  rating_state: RatingState
  car_driver_deposit_percentage: number
  cancel_reason?: CancelReason
  amount_return?: number
  down_payment?: DownPayment
  amount_total?: number
  deposit_date?: string
}

export interface CompoundingCarDriverRes
  extends Omit<CompoundingCarRes, "state" | "rating" | "partner"> {
  compounding_car_customers: CompoundingCarCustomer[]
  state: CompoundingCarDriverState
  rating_ids: RatingRes[]
  car_driver_deposit_percentage: number
  amount_total?: number
  down_payment?: DownPayment
  promotion?: PromotionRes
  discount_after_tax?: number
  amount_undiscounted?: number
}

export interface PriceUnit {
  name: string
  price_unit: number
}

export type RatingState =
  | "no_rating" //chua danh gia co quyền đánh giá
  | "rated" // đã đánh giá, có quyên chỉnh sửa
  | "un_rating" // không có quyền sửa tạo

export interface CancelReason {
  cancel_reason_id: number
  reason: string
}

export interface CompoundingCarCustomer {
  compounding_car_id: number
  compounding_car_customer_id: number
  from_province: ProvinceId
  from_pick_up_station: StationParams
  is_picking_up_from_start: boolean
  from_address: string
  from_longitude: string
  from_latitude: string
  to_province: ProvinceId
  to_pick_up_station: StationParams
  is_taking_to_final_destination: false
  to_address: string
  to_longitude: string
  to_latitude: string
  partner: PartnerCompoundingCar
  number_seat: number
  fee_final_destination: number
  sale_order_id: SaleOrderCompoundingCar
  amount_total: number
  down_payment: DownPayment
  payment_method: PaymentMethod
  amount_due: number
  state: CompoundingCarCustomerState
  price_unit: PriceUnit
  compounding_type: CompoundingType
  expected_going_on_date: string
  expected_picking_up_date: string
  car: CarId
  car_driver_id: CarDriverId
  distance: number
  note: string
  hour_of_wait_time: HourWaitTimeType
  is_a_day_tour: boolean
  second_remains: number
  number_available_seat: number
  duration: number
  rating_state: RatingState
  rating?: RatingRes
  second_waiting_remains: number
  customer_deposit_percentage: number
  cancel_reason?: CancelReason
  paid_date?: string
  cancel_date?: string
  amount_return?: number
  confirm_date?: string
  payment_amount?: number
  deposit_date?: string
  promotion?: PromotionRes
  amount_undiscounted?: number
  discount_after_tax?: number
}

export interface PartnerCompoundingCar {
  partner_id: number
  partner_name: string
  avatar_url: {
    image_id: number
    image_url: string
  }
  phone: string
  car_account_type: boolean
  gender: GenderType
  date_of_birth: string
  description: string
}

export interface OrderLineProductCompounding {
  product_id: number
  product_name: string
  representation_image: { image_id: string; image_url: string }
  image_urls: string[]
}

export interface SaleOrderCompoundingCar {
  sale_id: number
  sale_name: string
  partner: PartnerCompoundingCar
  order_line: CompoundingOrderLine[]
  amount_total: number
}

export interface CompoundingOrderLine {
  line_id: number
  line_name: string
  line_product: OrderLineProductCompounding
  line_product_uom: {
    uom_id: number
    uom_name: string
  }
  line_product_qty: number
}

export interface CreateCommonCompounding {
  compounding_type: CompoundingType
  from_province_id: number
  to_province_id: number
  car_id: number
  note?: string
  from_address: string
  to_address: string
  from_longitude: string
  from_latitude: string
  to_latitude: string
  to_longitude: string
  expected_going_on_date: string
  distance: number
  duration?: number
}

export interface CreateOneWayCompoundingCar extends CreateCommonCompounding {}

export interface FormModeType {
  mode: "update" | "create"
}

export interface CreateTwoWayCompoundingCarForm extends CreateCommonCompoundingForm {
  is_a_day_tour: boolean
  hour_of_wait_time?: OptionModel
  expected_picking_up_date?: string
  price?: number
}

export interface CreateTwoWayCompoundingCar extends CreateCommonCompounding {
  is_a_day_tour: boolean
  hour_of_wait_time?: HourWaitTimeType | false
  expected_picking_up_date?: string | false
}

export interface CreateCarpoolingCompoundingCar extends CreateCommonCompounding {
  from_pick_up_station_id: number
  to_pick_up_station_id: number
  number_seat: number
  is_picking_up_from_start: boolean
  price_per_passenger?: number
  compounding_car_id?: number
}

export interface RideStation {
  station_name: string
  station_id: number
  station_image: {
    id: number
    url: string
  }
  latitude: string
  longitude: string
}

export interface CreateCarpoolingCompoundingForm {
  car_id: OptionModel & { number_seat: number }
  price_per_passenger?: number
  number_seat: OptionModel
  from_station: StationId
  to_station: StationId
  from_location?: FromLocation
  note?: string
  expected_going_on_date: string
  distance: number
  is_checked_policy: boolean
  duration: number
}

export type CreateCompoundingCarParams =
  | CreateCarpoolingCompoundingCar
  | CreateTwoWayCompoundingCar
  | CreateOneWayCompoundingCar

export interface ConfirmCompoundingCar {
  compounding_car_customer_id: number
}

export interface ConfirmTransactionParams {
  sale_order_id: number
}

export interface CreateCompoundingCarDriver {
  compounding_type: CompoundingType
  from_province_id: number
  to_province_id: number
  expected_going_on_date: string
  car_id: number
  note?: string
  from_longitude: string
  from_latitude: string
  to_longitude: string
  to_latitude: string
}

export interface UpdateOneWayCompoundingCar extends CreateOneWayCompoundingCar {
  compounding_car_customer_id: number
}

export interface UpdateTwoWayCompoundingCar extends CreateTwoWayCompoundingCar {
  compounding_car_customer_id: number
}

export interface UpdateCarpoolingCompoundingCar extends CreateCarpoolingCompoundingCar {
  compounding_car_customer_id: number
}

export type UpdateCompoundingCar = (
  | UpdateOneWayCompoundingCar
  | UpdateTwoWayCompoundingCar
  | UpdateCarpoolingCompoundingCar
) & { compounding_car_customer_id: number }

export interface CreatePaymentDriverParams {
  acquirer_id: number
  compounding_car_id: number
  returned_url: string
  payment_id: number
}

export interface DriverConfirmCompoundingCarCustomerParams {
  compounding_car_customer_id: number
  customer_id: number
}

export interface CompoundingListDriverParams {
  from_province_id?: number
  to_province_id?: number
  car_id?: number
  from_expected_going_on_date?: string
  to_expected_going_on_date?: string
  compounding_type?: CompoundingType
  sort_by_lowest_price?: boolean
  sort_by_highest_price?: boolean
  sort_by_distance?: boolean
  limit?: number
  offset?: number
  current_latitude?: string
  current_longitude?: string
}

export interface GetCompoundingCarCustomerList extends CompoundingListDriverParams {
  number_seat?: number
}

export interface GetCompoundingCarCustomerStateParams {
  compounding_car_state?: CompoundingCarCustomerState[]
  limit?: number
  offset?: number
  rating_state?: [RatingState]
}

export interface GetCompoundingCarDriverStateParams {
  compounding_car_state?: CompoundingCarDriverState[]
  limit?: number
  offset?: number
}

export interface CreatePaymentParams {
  acquirer_id: number
  compounding_car_customer_id: number
  returned_url: string
}

export interface CreatePaymentMethodParams {
  compounding_car_customer_id: number
  payment_method: PaymentMethod
}

export interface GetDetailCompoundingCustomer {
  compounding_car_customer_id: number
}

export interface ConfirmPayFullCustomerParams {
  compounding_car_customer_id: number
  payment_method: PaymentMethod
}

export interface GetDetailCompounding {
  compounding_car_id: number
}

export interface UpdateCompoundingCarCustomer {
  compounding_car_customer_id: number
}

export interface UpdateCompoundingCarDriver extends CreateCompoundingCarDriver {
  compounding_car_id: number
}

export type CompoundingOrderField =
  | "sort_by_lowest_price"
  | "sort_by_highest_price"
  | "sort_by_distance"

export type CompoundingCarCustomerFilterKey = keyof CompoundingCarCustomerFilterParams
export type CompoundingCarFilterKey = keyof CompoundingCarFilterParams

export interface DefaultCompoundingCarFilterFormParams {
  order_by?: CompoundingOrderField
  from_province_id?: OptionModel
  to_province_id?: OptionModel
  car_id?: OptionModel & { number_seat: number }
  from_expected_going_on_date?: string
  to_expected_going_on_date?: string
  compounding_type?: CompoundingType
  current_latitude?: string
  current_longitude?: string
  number_seat?: OptionModel
}

export type DefaultCompoundingCarFilterKey = keyof DefaultCompoundingCarFilterFormParams

export type CreateCompoundingCar =
  | CreateCarpoolingCompoundingCar
  | CreateOneWayCompoundingCar
  | CreateTwoWayCompoundingCar

export interface CompoundingCarFilterParams {
  order_by?: CompoundingOrderField
  from_province_id?: number
  to_province_id?: number
  car_id?: number
  from_expected_going_on_date?: string
  to_expected_going_on_date?: string
  compounding_type?: CompoundingType
  current_latitude?: string
  current_longitude?: string
}

export interface CompoundingCarCustomerFilterParams extends CompoundingCarFilterParams {
  number_seat?: number
}

export type CompoundingFilterParams = CompoundingCarCustomerFilterParams &
  CompoundingCarFilterParams

export interface DepositCompoundingCarDriverRes {
  payment_id: number
  payment_type: string
  partner_type: string
  partner_id: UserInfo
  amount: number
  state: "draft" | "confirm_depost" | string
  date: string
  compounding_car: {
    compounding_car_id: number
    compounding_car_name: string
  }
  second_remains: number
  amount_total: number
  down_payment: DownPayment
  amount_due: number
  amount_undiscounted?: number
  discount_after_tax?: number
}

export interface DepositCompoundingCarDriverFailureRes {
  message: string
  data: DepositCompoundingCarDriverRes[]
}

export type CompoundingCarCustomerWithState = Pick<
  CompoundingCarCustomer,
  "compounding_car_customer_id" | "state"
>

export interface CancelRideParams {
  cancel_reason_id?: number
  cancel_reason_other?: string
}

export interface CancelCompoundingCarParams extends CancelRideParams {
  compounding_car_customer_id: number
}

export interface CancelCompoundingCarDriverParams extends CancelRideParams {
  compounding_car_id: number
}

export interface CancelCompoundingFormParams extends CancelRideParams {}

export type ReasonsCancelCompoundingCarParams = {
  compounding_car_customer_state?: string
  compounding_car_state?: string
  car_account_type?: CarAccountType
} & ListQuery

export interface ReasonCancelCompoundingCarRes {
  cancel_reason_id: number
  reason: string
  compounding_car_customer_state: string
}

export interface CompoundingCancelCar extends CompoundingCarCustomer {
  amount_total: number
  amount_due: number
  confirm_date: string
  cancel_date: string
  paid_date: string
}

export interface CustomerInvoice extends CompoundingCarCustomer {
  amount_total: number
  payment_amount: number
  paid_date: string
}

export interface DriverCompoundingCarInvoiceRes {
  compounding_car_id: number
  compounding_car_code: string
  compounding_car_name: string
  car_driver_id: UserInfo
  compounding_type: CompoundingType
  from_province: ProvinceId
  to_province: ProvinceId
  expected_going_on_date: string
  expected_picking_up_date: string
  car: CarId
  number_seat_in_car: number
  is_a_day_tour: true
  hour_of_wait_time: HourWaitTimeType
  distance: number
  duration: number
  state: CompoundingCarDriverState
  customer_invoice: CustomerInvoice[]
  amount_total: number
  vat: {
    percent: number
    total: number
  }
  service_charge: {
    percent: number
    total: number
  }
  pit: {
    percent: number
    total: number
  }
  down_payment: DownPayment
  cash: number
  amount_due: number
  income_before_pit: number
}

export interface IDepositSummary {
  amount_undiscounted: number
  discount_after_tax: number
  amount_total: number
  down_payment: DownPayment
  amount_due: number
}

export type IDepositSummaryOptional = Partial<IDepositSummary>
