import { ReactNode } from "react"
import { ListQuery } from "./common"
import { CompoundingCarCustomer } from "./compoundingCar"
import { CarAccountType } from "./user"

export interface PaymentRes {
  acquirer_id: number
  name: string
  provider: "exxe_wallet" | "vnpay"
  state: string
  image_url: {
    id: number
    url: string
  }
  money_in_bank_wallet?: number
  money_in_cash_wallet?: number
  brief: string
}

export interface CreatePaymentRes {
  vnpay_payment_url: string
  vnpay_code: string
}

export interface CreateRechargeMoneyRes extends CreatePaymentRes {
  payment_id: number
}

export type VnpayStatus =
  | "00"
  | "07"
  | "09"
  | "10"
  | "11"
  | "12"
  | "13"
  | "24"
  | "51"
  | "65"
  | "75"
  | "79"
  | "99"

export interface GetTransactionListByWalletParams extends ListQuery {
  journal_id: number
  start_date: string
  end_date: string
}

export interface GetDetailTransactionParams {
  payment_id: number
}

export interface MakeWithdrawingRequestParams {
  journal_id: number
  amount: number
}

export interface WalletUserRes {
  partner_id: number
  partner_name: string
  phone: string
  avatar_url: {
    image_id: number
    image_url: string
  }
}

export interface JournalRes {
  journal_id: number
  journal_name: string
  journal_type: "cash" | "bank"
  wallet_owner: WalletUserRes
  wallet_type: string
  remains_amount: number
}

export type PaymentPurpose =
  | "car_driver_deposit"
  | "passenger_deposit"
  | "return_car_driver_deposit"
  | "return_passenger_deposit"
  | "car_driver_invoice"
  | "car_driver_withdrawing"
  | "car_driver_wallet_recharge"
  | "passenger_wallet_recharge"

export interface JournalUserRes {
  partner_id: number
  partner_name: string
  phone: string
  avatar_url: {
    image_id: number
    image_url: string
  }
}

export type PaymentType = "inbound" | "outbound"

export interface JournalId {
  journal_id: number
  journal_name: string
  journal_type: "cash" | "bank"
  journal_owner_id: JournalUserRes
  wallet_type: false
  remains_amount: number
}

export interface TransactionRes {
  payment_id: number
  date: string
  partner_id: WalletUserRes
  journal_id: JournalRes
  amount: number
  ref: string
  state: "draft" | "posted"
  payment_code: string
  is_make_withdrawing_request: boolean
  payment_type: PaymentType
  partner_type: CarAccountType
  payment_purpose: PaymentPurpose
  compounding_car: {
    compounding_car_id: number
    compounding_car_name: string
  }
}

export interface JournalPaymentRes {
  payment_id: number
  date: string
  partner_id: JournalUserRes
  journal_id: JournalId
  amount: number
  ref: string
  state: string
  is_make_withdrawing_request: boolean
  payment_type: PaymentType
  partner_type: CarAccountType
  payment_purpose: PaymentPurpose
  compounding_car: {
    compounding_car_id: string
    compounding_car_name: string
  }
  payment_code: string
}

export interface JournalDetailCompoundingCarCustomerRes extends JournalDetailRes {
  compounding_car_customer_id: CompoundingCarCustomer
}

export interface JournalDetailRes {
  payment_purpose: PaymentPurpose
  payment_id: JournalPaymentRes
}

export interface JournalFilterDate {
  start_date: string
  end_date: string
}

export type JournalFilterDateOptional = Partial<JournalFilterDate>

export type PaymentMethod = "cash" | "transfer" | "exxe_wallet"

export interface RechargeRequestFormParams {
  amount: number
  acquirer_id: number
}

export interface CreateRechargeRequestParams extends RechargeRequestFormParams {
  journal_id: number
  returned_url: string
}

export interface ConfirmRechargeRequestParams {
  payment_id: number
}

export interface RechargeRequestParamsRes {}

export interface WithdrawFormParams {
  amount: number
}

export type Journal = {
  journal: JournalRes[]
  transaction: TransactionRes[]
}

export interface PaymentMethodItem {
  value: PaymentMethod
  label: string
  icon: ReactNode
  brief: string
}
