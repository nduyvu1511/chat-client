import { AttachmentRes, IAttachment, OptionModel, QueryCommonParams } from "./common"

export interface LoginFormParams {
  phone: string
  password: string
}

export interface LoginRes {
  car_account_type: CarAccountType
}

export interface UserInfo {
  partner_id: number
  partner_name: string
  avatar_url: {
    image_id: number
    image_url: string
  }
  email: string
  gender: GenderType
  date_of_birth: string
  car_account_type: CarAccountType
  verified_car_driver_account: DriverAccountStatus
  verified_account_date: string
  description: string
  car_information: any
  phone: string
  address: string
  country_id: { country_id: number; country_name: string }
  province_id: { province_id: number; province_name: string }
  district_id: { district_id: number; district_name: string }
  ward_id: { ward_id: number; ward_name: string }
  street: string
  identity_card_id?: IdentityCardRes
  rating_number?: number
}

export type UserInfoFormKey = keyof UserInfoFormParams
export type VehicleKeyType = "brand" | "model" | "type" | "desc"
export type IdCardKeyType = "text" | "select" | "date" | "file"
export type DrivingLicenseKeyType = "text" | "select" | "file" | "date"
export type IdCardName = keyof IdCardParams

export type NewPasswordFormKeys = "password" | "re_password" | "old_password"
export type DriverFormKey =
  | "idCard"
  | "info"
  | "license"
  | "vehicleInsuranceImages"
  | "vehicleRegistration"
  | "registrationCertificate"

export type DrivingLicenseFormKey =
  | "front_license_image_url"
  | "back_license_image_url"
  | "identity_number"
  | "license_class"
  | "date_of_issue"
  | "date_of_expiry"
export type CarAccountType = "customer" | "car_driver"
export type VehicleDetailFormKey =
  | "car_brand_id"
  | "car_id"
  | "car_name"
  | "front_car_image_url"
  | "back_car_image_url"
  | "license_plates"
  | "year_of_issue"
export type VehicleInsuranceFormKey =
  | "front_insurance_image_url"
  | "back_insurance_image_url"
  | "identity_number"
  | "date_of_issue"
  | "date_of_expiry"
export type VehicleImageKeyType = "frontImage" | "backImage"
export type CertificateInspectionFormKey =
  | "back_inspection_certificate_image_url"
  | "front_inspection_certificate_image_url"
  | "identity_number"
  | "date_of_expiry"
export type GenderType = "male" | "female" | "no_info"
export type DriverAccountStatus = "inactive_account" | "active_account" | "blocked_account"
export type DrivingLicenseClassType = "b1" | "b2" | "c" | "d" | "e" | "f"

// Interfaces
export interface Auth {
  firebase_access_token?: string
  google_access_token?: string
  type?: string
  facebook_access_token?: string
  data_in_token?: any
}

export interface NewPasswordParams {
  password: string
  re_password: string
}

export interface ChangePasswordParams extends NewPasswordParams {
  old_password: string
}

export interface ResetPasswordParams {
  firebase_access_token: string
  password: string
  re_password: string
}

export interface UserEdit {
  email: string
  name: string
  gender: "male" | "female" | ""
  image?: string
}

export interface LoginForm {
  phone: string
  password: string
}

export interface ChangePasswordFormParams extends NewPasswordParams {
  old_password: string
}

export interface CreatePasswordFormParams extends NewPasswordParams {}

export interface LoginRes {
  car_account_type: CarAccountType
}

export interface UserInfoFormAddress {
  country_id?: OptionModel
  province_id: OptionModel
  district_id: OptionModel
  ward_id: OptionModel
  street: string
}

export type UserInfoFormAddressOptional = Partial<UserInfoFormAddress>

export type UserInforFormAddressKey = keyof UserInfoFormAddress

// User form
export interface UserInfoFormParams {
  date_of_birth: string
  description?: string
  avatar_attachment_id: number
  name: string
  email?: string
  gender: GenderType
  country_id?: OptionModel
  province_id?: OptionModel
  district_id?: OptionModel
  ward_id?: OptionModel
  street?: string
  identity_number?: string
}

export type UserInfoFormSubmit = Pick<
  UserInfoFormParams,
  | "avatar_attachment_id"
  | "date_of_birth"
  | "description"
  | "avatar_attachment_id"
  | "name"
  | "gender"
  | "email"
> & {
  country_id?: number
  province_id?: number
  district_id?: number
  ward_id?: number
  street?: string
}

export interface CreateUserFormParams {
  date_of_birth: string
  description?: string
  car_account_type: CarAccountType
  avatar_attachment_id: number
  name: string
  gender: GenderType
}

export type UpdateUserInfoParams = Partial<CreateUserFormParams>

export interface RegisterParams {
  token: string
  car_account_type: CarAccountType
}

export interface IdCardParams {
  front_identity_card_image_url: number
  back_identity_card_image_url: number
  identity_number: string
  date_of_issue: string
  date_of_expiry: string
  place_of_issue: string
  address: string
}

export interface IdCardUpdateParams extends IdCardParams {
  identity_card_id: number
}

export interface DrivingLicenseParams {
  front_license_image_url: number
  back_license_image_url: number
  identity_number: string
  license_class: string
  date_of_issue: string
  date_of_expiry: string
}

export interface UpdateDrivingLicenseParams extends DrivingLicenseParams {
  car_driving_license_id: number
}

export interface VehicleDetailFormParams {
  car_brand_id: number
  car_id: number
  car_name: string
  year_of_issue: string
  license_plates: string
  front_car_image_url: number
  back_car_image_url: number
}

export interface RegistrationCertificateRes {
  car_registration_certificate_id: number
  car: { car_id: number; name: string; car_type: string }
  car_name: string
  year_of_issue: string
  license_plates: string
  front_car_image: { id: number; url: string }
  back_car_image: {
    id: number
    url: string
  }
  car_brand: {
    brand_id: number
    brand_name: string
    brand_icon: { icon_id: number; icon_url: string }
  }
}

export interface UpdateVehicleDetailFormParams extends VehicleDetailFormParams {
  car_registration_certificate_id: number
}

export interface VehicleInsuranceParams {
  front_insurance_image_url: number
  back_insurance_image_url: number
  identity_number: string
  date_of_issue: string
  date_of_expiry: string
}

export interface VehicleInsuranceRes {
  compulsory_car_insurance_id: number
  partner: number
  front_insurance_image_url: {
    id: number
    url: string
  }
  back_insurance_image_url: {
    id: number
    url: string
  }
  identity_number: string
  date_of_issue: string
  date_of_expiry: string
}

export interface UpdateVehicleInsuranceParams extends VehicleInsuranceParams {
  compulsory_car_insurance_id: number
}

export interface CertificateInspectionParams {
  front_inspection_certificate_image_url: number
  back_inspection_certificate_image_url: number
  identity_number: string
  date_of_expiry: string
}

export interface CertificateInspectionRes {
  periodical_inspection_certificate_id: number
  front_inspection_certificate_image: {
    id: number
    url: string
  }
  back_inspection_certificate_image: {
    id: number
    url: string
  }
  identity_number: string
  date_of_expiry: string
}

export interface UpdateCertificateInspectionParams extends CertificateInspectionParams {
  periodical_inspection_certificate_id: number
}

export interface AttachmentItem {
  attachment_id: number
  attachment_url: string
}

export interface DriverLicenseForm {
  frontCard: string
  backCard: string
  driversLicenseNumber: string
  driversLicenseClass: string
}

export interface CreateNewPasswordParams extends NewPasswordParams {}

export interface UserInfoParams {
  car_account_type: CarAccountType | false
  name: string
  date_of_birth: string
  gender: GenderType
  description: string
  avatar_attachment_id: number
}

export interface AttachmentChildParams {
  file: string
  type: "image" | "video"
}

export interface AttachmentParams {
  attachments: AttachmentChildParams[]
}

export interface DrivingLicenseFormParams {
  front_license_image_url: number
  back_license_image_url: number
  identity_number: string
  license_class: string
  date_of_issue: string
  date_of_expiry: string
}

export interface DrivingLicenseRes {
  car_driving_license_id: number
  partner: UserInfo
  front_license_image_url: {
    id: number
    url: string
  }
  back_license_image_url: {
    id: number
    url: string
  }
  identity_number: string
  date_of_issue: string
  date_of_expiry: string
  license_class: string
}

export interface IdentityCardRes {
  identity_card_id: number
  partner: UserInfo
  front_identity_card_image_url: {
    id: number
    url: string
  }
  back_identity_card_image_url: {
    id: number
    url: string
  }
  identity_number: string
  date_of_issue: string
  date_of_expiry: string
  place_of_issue: string
  address: string
}

export type FilledDataFieldsKey =
  | "user_information"
  | "identity_card"
  | "car_driving_license"
  | "car_registration_certificate"
  | "periodical_inspection_certificate"
  | "compulsory_car_insurance"

export interface FilledDataFieldsRes {
  user_information: boolean
  identity_card: boolean
  car_driving_license: boolean
  car_registration_certificate: boolean
  periodical_inspection_certificate: boolean
  compulsory_car_insurance: boolean
}

export interface CarDriverId extends UserInfo {
  rating_number: number
}

export interface CheckPhoneExistParams {
  phone: string
  type: "login" | "register" | "resetPassword"
}

export interface PhoneParams {
  phone: string
}

export interface IUser {
  _id: string
  user_name: string
  role: UserRole
  avatar_id?: string
  password: string
  bio?: string
  phone: string
  user_id: number
  date_of_birth?: string
  blocked_user_ids: number[]
  gender?: Gender
  room_joined_ids: string[]
  messages_unread: {
    room_id: string
    message_ids: string[]
  }[]
  message_unread_count: number
  created_at: Date
  updated_at: Date
  is_online: boolean
  offline_at: Date
  room_blocked_noti_ids: string[]
}

export type UserPopulate = Omit<IUser, "avatar_id"> & {
  avatar_id: IAttachment
}

export type UserRes = Pick<
  IUser,
  | "bio"
  | "created_at"
  | "date_of_birth"
  | "gender"
  | "is_online"
  | "offline_at"
  | "role"
  | "phone"
  | "user_name"
  | "updated_at"
> & {
  user_id: string
  avatar: AttachmentRes
}

export type TokenRes = {
  access_token: string
  refresh_token: string
}

export type CreateUserRes = UserRes & TokenRes

export type CreateUserParams = Pick<
  IUser,
  "user_name" | "date_of_birth" | "gender" | "role" | "bio" | "phone" | "user_id"
> & {
  user_id: string
  avatar: string
}

export type UpdateProfile = Partial<
  Pick<IUser, "user_name" | "date_of_birth" | "gender" | "bio"> & {
    avatar: string
  }
>
export type UpdateProfileService = UpdateProfile & { user: IUser }
export type GetTokenParams = Pick<IUser, "user_id" | "phone">
export type UserRole = "customer" | "driver" | "admin"
export type Gender = "male" | "female" | "no_info" | ""
export type UserLoginRes = UserRes & { token: string }
export type changeUserStatusParams = Pick<IUser, "is_online"> & { user_id: string }
export type BlockUserStatus = "block" | "unblock"
export type BlockOrUnBlockUserParams = {
  user_id: string
  partner_id: string
  status: BlockUserStatus
}
export type getUserBlockListParams = Pick<IUser, "blocked_user_ids"> & QueryCommonParams

export interface LoginParams {
  phone: string
  password: string
}

export interface CreatePasswordParams {
  new_password: string
  confirm_new_password: string
}

export interface ChangePasswordParams extends CreatePasswordParams {
  current_password: string
}

export type CreatePasswordServiceParams = CreatePasswordParams & {
  _id: string
}

export type ChangePasswordServiceParams = ChangePasswordParams & {
  _id: string
}

export interface UserData extends UserRes {
  user_chatted_with_ids: string[]
  room_joined_ids: string[]
}

export interface LoginToSocket {
  socket_id: string
  // socket: Socket<any>
}
