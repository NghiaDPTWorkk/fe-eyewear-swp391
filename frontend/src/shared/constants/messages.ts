/**
 * Centralized message system for the Eyewear Project.
 * Organized by role and category to avoid hardcoded strings throughout the app.
 */

export const MESSAGES = {
  // Shared messages used across different roles
  COMMON: {
    SUCCESS: 'Thao tác thành công',
    ERROR: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền.',
    SERVER_ERROR: 'Lỗi hệ thống từ phía server. Vui lòng thử lại sau.',
    UNAUTHORIZED: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.',
    FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
    NOT_FOUND: 'Không tìm thấy dữ liệu yêu cầu.',
    INVALID_DATA: 'Dữ liệu không hợp lệ.',
    LOADING: 'Đang xử lý...',
    UNKNOWN_ERROR: 'Lỗi không xác định.',
    ACTION_PENDING_APPROVAL: 'Yêu cầu của bạn đã được ghi nhận và đang chờ quản trị viên phê duyệt.'
  },

  // Customer-specific messages
  CUSTOMER: {
    AUTH: {
      LOGIN_SUCCESS: 'Chào mừng bạn quay trở lại!',
      REGISTER_SUCCESS: 'Đăng ký tài khoản thành công!',
      UPDATE_PROFILE_SUCCESS: 'Cập nhật thông tin cá nhân thành công!',
      CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công!',
      PASSWORD_MISMATCH: 'Mật khẩu mới và xác nhận mật khẩu không khớp',
      PASSWORD_TOO_SHORT: 'Mật khẩu phải có ít nhất 8 ký tự',
      NAME_REQUIRED: 'Vui lòng nhập họ và tên',
      INFO_REQUIRED: 'Vui lòng nhập đầy đủ thông tin'
    },
    CART: {
      ADD_SUCCESS: 'Đã thêm sản phẩm vào giỏ hàng',
      REMOVE_SUCCESS: 'Đã xóa sản phẩm khỏi giỏ hàng',
      UPDATE_SUCCESS: 'Cập nhật giỏ hàng thành công',
      OUT_OF_STOCK: 'Sản phẩm này hiện đang hết hàng',
      MIN_QUANTITY: 'Số lượng tối thiểu là 1'
    },
    ORDER: {
      PLACE_SUCCESS: 'Đặt hàng thành công. Cảm ơn bạn đã mua sắm!',
      RETURN_REQUEST_SUCCESS: 'Yêu cầu đổi trả đã được gửi thành công.',
      CANCEL_SUCCESS: 'Đã hủy đơn hàng thành công.',
      ADDRESS_REQUIRED: 'Vui lòng nhập đầy đủ địa chỉ giao hàng',
      EMPTY_CART: 'Giỏ hàng chưa chọn sản phẩm nào',
      PAYMENT_LINK_FAILED:
        'Không thể tạo liên kết thanh toán. Vui lòng thử lại trong Lịch sử đơn hàng.'
    },
    PRESCRIPTION: {
      SAVE_SUCCESS: 'Đã lưu đơn thuốc thành công.',
      DELETE_SUCCESS: 'Đã xóa đơn thuốc thành công.',
      LOAD_FAILED: 'Không thể tải danh sách đơn thuốc.'
    },
    WISHLIST: {
      ADD_SUCCESS: 'Đã thêm vào danh sách yêu thích',
      REMOVE_SUCCESS: 'Đã xóa khỏi danh sách yêu thích'
    }
  },

  // Staff (Sale-staff, Staff generic) specific messages
  STAFF: {
    AUTH: {
      LOGIN_SUCCESS: 'Đăng nhập hệ thống nhân viên thành công!',
      LOGOUT_SUCCESS: 'Đã đăng xuất khỏi hệ thống nhân viên.'
    },
    ORDER: {
      UPDATE_SUCCESS: 'Cập nhật trạng thái đơn hàng thành công',
      CANCEL_SUCCESS: 'Hủy đơn hàng thành công',
      VERIFY_SUCCESS: 'Xác minh đơn hàng thành công'
    },
    PRESCRIPTION: {
      VERIFY_SUCCESS: 'Đã xác nhận đơn thuốc',
      REJECT_SUCCESS: 'Đã từ chối đơn thuốc'
    },
    CHAT: {
      SEND_SUCCESS: 'Gửi tin nhắn thành công',
      LOAD_FAILED: 'Không thể tải lịch sử trò chuyện'
    }
  },

  // Operation Staff specific messages
  OPERATIONS: {
    INVENTORY: {
      IMPORT_SUCCESS: 'Nhập kho sản phẩm thành công',
      UPDATE_SUCCESS: 'Cập nhật trạng thái nhập kho thành công'
    },
    PRODUCTION: {
      START_SUCCESS: 'Bắt đầu quá trình sản công kính',
      COMPLETE_SUCCESS: 'Hoàn tất quá trình gia công kính'
    }
  },

  // Manager specific messages
  MANAGER: {
    POLICY: {
      UPDATE_SUCCESS: 'Cập nhật chính sách thành công'
    },
    PRICING: {
      UPDATE_SUCCESS: 'Cập nhật bảng giá thành công'
    },
    REPORT: {
      EXPORT_SUCCESS: 'Xuất báo cáo thành công'
    }
  },

  // Admin specific messages
  ADMIN: {
    ACCOUNT: {
      CREATE_SUCCESS: 'Tạo tài khoản quản trị thành công',
      UPDATE_SUCCESS: 'Cập nhật tài khoản thành công',
      DELETE_SUCCESS: 'Đã xóa tài khoản thành công',
      CREATE_FAILED: 'Tạo tài khoản thất bại',
      DELETE_FAILED: 'Xóa tài khoản thất bại'
    },
    SYSTEM: {
      CONFIG_SUCCESS: 'Cập nhật cấu hình hệ thống thành công'
    }
  }
} as const

// Legacy support (to be refactored gradually)
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không chính xác',
    LOGIN_FAILED: 'Đăng nhập thất bại. Vui lòng thử lại.',
    REGISTER_FAILED: 'Đăng ký thất bại. Vui lòng thử lại.',
    UNAUTHORIZED: 'Phiên hết hạn. Vui lòng đăng nhập lại.',
    PASSWORD_COMPLEXITY:
      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.'
  },
  HTTP: MESSAGES.COMMON
} as const

export const SUCCESS_MESSAGES = {
  AUTH: MESSAGES.CUSTOMER.AUTH,
  CART: MESSAGES.CUSTOMER.CART
} as const
