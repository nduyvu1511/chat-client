import {
  CertificateInspectionFormKey,
  CompoundingCarCustomerFilterKey,
  CompoundingCarCustomerState,
  CompoundingCarDriverState,
  CompoundingCarFilterKey,
  CompoundingOrderField,
  CompoundingType,
  ContactFormKey,
  DriverFormKey,
  DrivingLicenseClassType,
  DrivingLicenseFormKey,
  DrivingLicenseKeyType,
  FilledDataFieldsKey,
  HourWaitTimeType,
  IdCardKeyType,
  IdCardName,
  NewPasswordFormKeys,
  OptionModel,
  UserInfoFormKey,
  UserInforFormAddressKey,
  VehicleDetailFormKey,
  VehicleInsuranceFormKey,
} from "@/models"

interface PasswordFormDataProps {
  label: string
  name: "password" | "newPassword" | "reNewPassword"
}

export const passwordFormData: PasswordFormDataProps[] = [
  {
    label: "Mật khẩu cũ",
    name: "password",
  },
  {
    label: "Mật khẩu mới",
    name: "newPassword",
  },
  {
    label: "Xác nhận mật khẩu",
    name: "reNewPassword",
  },
]

export const createNewPasswordFormFields: {
  name: "password" | "re_password"
  label: string
}[] = [
  { label: "Mật khẩu mới", name: "password" },
  { label: "Xác nhận mật khẩu mới", name: "re_password" },
]

export const hoursBackList: { label: string; value: HourWaitTimeType }[] = [
  {
    label: "1 Giờ",
    value: "01_hour",
  },
  {
    label: "2 Giờ",
    value: "02_hour",
  },
  {
    label: "3 Giờ",
    value: "03_hour",
  },
  {
    label: "4 Giờ",
    value: "04_hour",
  },
  {
    label: "5 Giờ",
    value: "05_hour",
  },
  {
    label: "6 Giờ",
    value: "06_hour",
  },
  {
    label: "7 Giờ",
    value: "07_hour",
  },
  {
    label: "8 Giờ",
    value: "08_hour",
  },
  {
    label: "9 Giờ",
    value: "09_hour",
  },
  {
    label: "10 Giờ",
    value: "10_hour",
  },
  {
    label: "11 Giờ",
    value: "11_hour",
  },
  {
    label: "12 Giờ",
    value: "12_hour",
  },
]

export const drivingClassList: {
  label: string
  value: DrivingLicenseClassType
}[] = [
  {
    label: "Bằng B1",
    value: "b1",
  },

  {
    label: "Bằng B2",
    value: "b2",
  },

  {
    label: "Bằng C",
    value: "c",
  },

  {
    label: "Bằng D",
    value: "d",
  },

  {
    label: "Bằng E",
    value: "e",
  },
  {
    label: "Bằng F",
    value: "f",
  },
]

export const idCardFormFields: {
  name: IdCardName
  type: IdCardKeyType
  placeholder: string
  isRequired: boolean
}[] = [
  {
    name: "front_identity_card_image_url",
    type: "file",
    placeholder: "Mặt Trước",
    isRequired: true,
  },
  {
    name: "back_identity_card_image_url",
    type: "file",
    placeholder: "Mặt Sau",
    isRequired: true,
  },
  {
    name: "identity_number",
    type: "text",
    placeholder: "Số CMND / Thẻ Căn Cước / Hộ Chiếu",
    isRequired: true,
  },
  {
    name: "date_of_issue",
    type: "date",
    placeholder: "Ngày Cấp",
    isRequired: true,
  },
  {
    name: "date_of_expiry",
    type: "date",
    placeholder: "Ngày Hết Hạn",
    isRequired: false,
  },
  {
    name: "place_of_issue",
    type: "select",
    placeholder: "Nơi Cấp",
    isRequired: true,
  },
  {
    name: "address",
    type: "text",
    placeholder: "Địa chỉ trong CMND / Thẻ Căn Cước / Hộ Chiếu",
    isRequired: true,
  },
]

export const driverFormFields: {
  heading: string
  child: {
    route: string
    label: string
    isRequired: boolean
    key: DriverFormKey
    name: FilledDataFieldsKey
  }[]
}[] = [
  {
    heading: "Thông tin cá nhân",

    child: [
      {
        route: "bio_details",
        label: "Họ & Tên",
        isRequired: true,
        key: "info",
        name: "user_information",
      },
      {
        route: "identity_card_details",
        label: "CMND / Thẻ Căn Cước / Hộ Chiếu",
        isRequired: true,
        key: "idCard",
        name: "identity_card",
      },
      {
        route: "driving_license_details",
        label: "Bằng Lái xe",
        isRequired: true,
        key: "license",
        name: "car_driving_license",
      },
    ],
  },

  {
    heading: "Thông tin phương tiện di chuyển ",
    child: [
      {
        route: "vehicle_details",
        label: "Giấy Đăng Ký Xe",
        isRequired: true,
        key: "vehicleRegistration",
        name: "car_registration_certificate",
      },
      {
        route: "registration_certificate",
        label: "Giấy Đăng Kiểm",
        isRequired: true,
        key: "registrationCertificate",
        name: "periodical_inspection_certificate",
      },
      {
        route: "vehicle_insurance",
        label: "Bảo Hiểm Xe",
        isRequired: true,
        key: "vehicleInsuranceImages",
        name: "compulsory_car_insurance",
      },
    ],
  },
]

export const drivingLicenseFormFields: {
  name: DrivingLicenseFormKey
  type: DrivingLicenseKeyType
  placeholder: string
  isRequired: boolean
}[] = [
  {
    name: "front_license_image_url",
    type: "file",
    placeholder: "Mặt Trước",
    isRequired: true,
  },
  {
    name: "back_license_image_url",
    type: "file",
    placeholder: "Mặt Sau",
    isRequired: true,
  },
  {
    name: "identity_number",
    type: "text",
    placeholder: "Số Bằng Lái Xe",
    isRequired: true,
  },
  {
    name: "license_class",
    type: "select",
    placeholder: "Hạng Bằng Lái",
    isRequired: true,
  },
  {
    name: "date_of_issue",
    type: "date",
    placeholder: "Ngày Cấp",
    isRequired: true,
  },
  {
    name: "date_of_expiry",
    type: "date",
    placeholder: "Ngày Hết Hạn",
    isRequired: true,
  },
]

export const VehicleImagesForm: {
  name: "frontImage" | "backImage"
  placeholder: string
  isRequired: boolean
}[] = [
  {
    name: "frontImage",
    placeholder: "Hình Đầu Xe",
    isRequired: true,
  },
  {
    name: "backImage",
    placeholder: "Hình Đuôi Xe",
    isRequired: true,
  },
]

export const vehicleInsuranceForm: {
  name: VehicleInsuranceFormKey
  placeholder: string
  isRequired: boolean
  type: "text" | "date" | "file"
}[] = [
  {
    name: "front_insurance_image_url",
    placeholder: "Mặt Trước",
    isRequired: true,
    type: "file",
  },
  {
    name: "back_insurance_image_url",
    placeholder: "Mặt Sau",
    isRequired: true,
    type: "file",
  },
  {
    name: "identity_number",
    placeholder: "Số Bảo Hiểm",
    isRequired: true,
    type: "text",
  },
  {
    name: "date_of_issue",
    placeholder: "Ngày Cấp",
    isRequired: true,
    type: "date",
  },
  {
    name: "date_of_expiry",
    placeholder: "Ngày Hết Hạn",
    isRequired: true,
    type: "date",
  },
]

export const vehicleDetailFormFields: {
  name: VehicleDetailFormKey
  placeholder: string
  type: "file" | "text" | "select" | "date"
  isRequired: boolean
  options?: OptionModel[]
}[] = [
  {
    name: "front_car_image_url",
    placeholder: "Hình Đầu Xe",
    isRequired: true,
    type: "file",
  },
  {
    name: "back_car_image_url",
    placeholder: "Hình Đuôi Xe",
    isRequired: true,
    type: "file",
  },
  {
    name: "car_id",
    placeholder: "Loại Xe",
    isRequired: true,
    type: "select",
  },
  {
    name: "car_brand_id",
    placeholder: "Hãng Xe",
    isRequired: true,
    type: "select",
  },
  {
    name: "car_name",
    placeholder: "Tên Xe",
    isRequired: true,
    type: "text",
  },

  {
    name: "license_plates",
    placeholder: "Biển Số Xe",
    isRequired: true,
    type: "text",
  },

  {
    name: "year_of_issue",
    placeholder: "Năm Sản Xuất Xe",
    isRequired: true,
    type: "text",
  },
]

export const genderList: {
  value: "male" | "female"
  label: string
}[] = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
]

export const userInfoFormfields: {
  name: UserInfoFormKey
  placeholder: string
  type: "file" | "text" | "date" | "textarea" | "radio" | "address"
  isRequired: boolean
}[] = [
  {
    name: "avatar_attachment_id",
    isRequired: true,
    placeholder: "Chọn ảnh đại diện",
    type: "file",
  },
  {
    name: "name",
    isRequired: true,
    placeholder: "Họ Tên",
    type: "text",
  },
  {
    name: "identity_number",
    isRequired: false,
    placeholder: "CMND / Thẻ Căn Cước / Hộ Chiếu",
    type: "text",
  },
  {
    name: "date_of_birth",
    isRequired: true,
    placeholder: "Ngày sinh",
    type: "date",
  },
  {
    name: "gender",
    isRequired: true,
    placeholder: "Giới tính",
    type: "radio",
  },
  {
    name: "email",
    isRequired: false,
    placeholder: "Email",
    type: "text",
  },
  {
    name: "street",
    isRequired: false,
    placeholder: "Địa chỉ cụ thể",
    type: "address",
  },
  {
    name: "description",
    isRequired: false,
    placeholder: "Mô tả bản thân",
    type: "textarea",
  },
]

export const changePasswordFormFields: {
  name: NewPasswordFormKeys
  label: string
}[] = [
  { label: "Mật khẩu cũ", name: "old_password" },
  { label: "Mật khẩu mới", name: "password" },
  { label: "Xác nhận mật khẩu mới", name: "re_password" },
]

export const certificatesRegistrationFormFields: {
  type: "text" | "date" | "file"
  name: CertificateInspectionFormKey
  isRequired: boolean
  label: string
}[] = [
  {
    type: "file",
    name: "front_inspection_certificate_image_url",
    isRequired: true,
    label: "Ảnh Mặt Trước",
  },
  {
    type: "file",
    name: "back_inspection_certificate_image_url",
    isRequired: true,
    label: "Ảnh Mặt Sau",
  },
  {
    type: "text",
    name: "identity_number",
    isRequired: true,
    label: "Số Đăng kiểm",
  },
  {
    type: "date",
    name: "date_of_expiry",
    isRequired: true,
    label: "Ngày Hết Hạn",
  },
]

export const contactFormFields: {
  name: ContactFormKey
  label: string
  isRequired?: boolean
  type: "text" | "textarea" | "checkbox"
}[] = [
  { label: "Họ và tên", name: "name", isRequired: true, type: "text" },
  { label: "Điện thoại", name: "phone", isRequired: true, type: "text" },
  { label: "Email", name: "email", isRequired: false, type: "text" },
  {
    label: "Thông điệp gửi đến chúng tôi ",
    name: "description",
    isRequired: false,
    type: "textarea",
  },
]

export const compoundingTypeFilters: {
  label: string
  value: CompoundingType
}[] = [
  {
    label: "Một Chiều",
    value: "one_way",
  },
  {
    label: "Hai Chiều",
    value: "two_way",
  },
  {
    label: "Đi Ghép",
    value: "compounding",
  },
]

export const compoundingOrderList: {
  value: CompoundingOrderField
  label: string
}[] = [
  { value: "sort_by_lowest_price", label: "Giá thấp đến cao" },
  { value: "sort_by_highest_price", label: "Giá cao đến thấp" },
  { value: "sort_by_distance", label: "Vị trí gần nhất" },
]

export const compoundingCustomerOrderList: {
  value: CompoundingOrderField
  label: string
}[] = [{ value: "sort_by_distance", label: "Vị trí gần nhất" }]

export const CompoundingFilterFormFields: {
  label: string
  name: CompoundingCarCustomerFilterKey | CompoundingCarFilterKey
  type: "select" | "text" | "date"
}[] = [
  { label: "Ngày đi", name: "from_expected_going_on_date", type: "date" },
  { label: "Ngày đến", name: "to_expected_going_on_date", type: "date" },
  { label: "Điểm đón", name: "from_province_id", type: "select" },
  { label: "Điểm đến", name: "to_province_id", type: "select" },
  { label: "Loại xe", name: "car_id", type: "select" },
  { label: "Số khách", name: "number_seat", type: "select" },
]

export const driverActivityFilters: {
  label: string
  value: CompoundingCarDriverState[]
}[] = [
  { label: "Tất cả", value: [] },
  {
    label: "Đang đặt cọc",
    value: ["waiting_deposit"],
  },
  {
    label: "Xác nhận",
    value: ["confirm_deposit", "confirm"],
  },
  {
    label: "Đang di chuyển",
    value: ["start_running", "stop_picking"],
  },
  { label: "Đã hoàn thành", value: ["done"] },
  { label: "Đã hủy", value: ["cancel"] },
]

export const customerActivityFilters: {
  label: string
  value: CompoundingCarCustomerState[]
}[] = [
  { label: "Tất cả", value: [] },
  { label: "Đơn nháp", value: ["draft"] },
  {
    label: "Chờ xử lý",
    value: ["confirm", "waiting", "assign", "deposit"],
  },
  {
    label: "Đang di chuyển",
    value: ["in_process", "done", "customer_pay"],
  },
  { label: "Đã thanh toán", value: ["confirm_paid"] },
  { label: "Đã hủy", value: ["cancel"] },
]

export const userInfoAddressData: {
  type: "select" | "text"
  name: UserInforFormAddressKey
  placeholder: string
}[] = [
  { name: "province_id", type: "select", placeholder: "Chọn Tỉnh/Thành Phố" },
  { name: "district_id", type: "select", placeholder: "Chọn Quận/Huyện" },
  { name: "ward_id", type: "select", placeholder: "Chọn Phường/Xã" },
  { name: "street", type: "text", placeholder: "Địa chỉ cụ thể" },
]
