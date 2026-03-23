/**
 * bộ lọc one euro - bộ lọc thông thấp thích ứng.
 *
 * đặc tính: lọc nhiễu tốt khi tín hiệu ổn định,
 *           độ trễ thấp khi tín hiệu thay đổi nhanh.
 */

// bộ lọc thông thấp cơ bản

class LowPassFilter {
  private y: number | null = null
  private s: number | null = null

  /** trả về giá trị đã lọc */
  filter(value: number, alpha: number): number {
    if (this.y === null || this.s === null) {
      this.y = value
      this.s = value
      return value
    }
    this.y = alpha * value + (1 - alpha) * this.y
    this.s = alpha * value + (1 - alpha) * this.s
    return this.y
  }

  lastValue(): number {
    return this.y ?? 0
  }

  reset(): void {
    this.y = null
    this.s = null
  }
}

// bộ lọc 1€

export interface OneEuroFilterConfig {
  /** tần số cắt (hz) khi tín hiệu ổn định - càng thấp càng mượt */
  minCutoff?: number
  /** hệ số tốc độ - càng cao càng ít trễ khi di chuyển nhanh */
  beta?: number
  /** tần số cắt cho bộ ước tính đạo hàm (hz) */
  dCutoff?: number
}

const DEFAULT_CONFIG: Required<OneEuroFilterConfig> = {
  minCutoff: 1.0,
  beta: 0.007,
  dCutoff: 1.0
}

function smoothingFactor(te: number, cutoff: number): number {
  const r = 2 * Math.PI * cutoff * te
  return r / (r + 1)
}

export class OneEuroFilter {
  private minCutoff: number
  private beta: number
  private dCutoff: number
  private xFilter = new LowPassFilter()
  private dxFilter = new LowPassFilter()
  private lastTimestamp: number | null = null

  constructor(config?: OneEuroFilterConfig) {
    const c = { ...DEFAULT_CONFIG, ...config }
    this.minCutoff = c.minCutoff
    this.beta = c.beta
    this.dCutoff = c.dCutoff
  }

  /**
   * nạp giá trị thô mới.
   * @param value     mẫu mới
   * @param timestamp mốc thời gian tính bằng giây
   */
  filter(value: number, timestamp: number): number {
    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp
      return this.xFilter.filter(value, 1.0)
    }

    const dt = timestamp - this.lastTimestamp
    // phòng ngừa lỗi mốc thời gian trùng hoặc sai thứ tự
    const te = dt > 0 ? dt : 1 / 120
    this.lastTimestamp = timestamp

    // ước tính đạo hàm
    const dx = (value - this.xFilter.lastValue()) / te
    const edx = this.dxFilter.filter(dx, smoothingFactor(te, this.dCutoff))

    // tần số cắt thích ứng
    const cutoff = this.minCutoff + this.beta * Math.abs(edx)
    return this.xFilter.filter(value, smoothingFactor(te, cutoff))
  }

  reset(): void {
    this.xFilter.reset()
    this.dxFilter.reset()
    this.lastTimestamp = null
  }
}

// bộ lọc cấp ma trận (16 phần tử)

export class OneEuroMatrixFilter {
  private filters: OneEuroFilter[]

  constructor(config?: OneEuroFilterConfig) {
    this.filters = Array.from({ length: 16 }, () => new OneEuroFilter(config))
  }

  /** lọc toàn bộ mảng ma trận 16 phần tử và trả về bản sao đã lọc */
  filter(matrix: number[], timestamp: number): number[] {
    const out = new Array(16)
    for (let i = 0; i < 16; i++) {
      out[i] = this.filters[i].filter(matrix[i], timestamp)
    }
    return out
  }

  reset(): void {
    this.filters.forEach((f) => f.reset())
  }
}
