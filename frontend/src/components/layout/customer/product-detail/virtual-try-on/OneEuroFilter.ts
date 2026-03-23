/**
 * One Euro Filter — Adaptive low-pass filter.
 *
 * Property: near-zero jitter when the signal is stable,
 *           near-zero latency when the signal changes fast.
 *
 * Paper: "1€ Filter: A Simple Speed-based Low-pass Filter for Noisy Input in
 *         Interactive Systems" — Casiez, Roussel, Vogel (2012)
 *
 * This implementation works on individual scalar values.  Composite types
 * (Vector3, Quaternion, Matrix4) should instantiate one filter per channel.
 */

// ─── Low-pass filter primitive ─────────────────────────────────────────────────

class LowPassFilter {
  private y: number | null = null
  private s: number | null = null

  /** Return filtered value */
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

// ─── 1€ filter ─────────────────────────────────────────────────────────────────

export interface OneEuroFilterConfig {
  /** Cut-off frequency (Hz) when the signal is stable — lower = smoother */
  minCutoff?: number
  /** Speed coefficient — higher = less latency when moving fast */
  beta?: number
  /** Cut-off frequency for the derivative estimator (Hz) */
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
   * Feed a new raw value.
   * @param value     New sample
   * @param timestamp Monotonic timestamp in **seconds**
   */
  filter(value: number, timestamp: number): number {
    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp
      return this.xFilter.filter(value, 1.0)
    }

    const dt = timestamp - this.lastTimestamp
    // Guard against duplicate / out-of-order timestamps
    const te = dt > 0 ? dt : 1 / 120
    this.lastTimestamp = timestamp

    // Estimate derivative
    const dx = (value - this.xFilter.lastValue()) / te
    const edx = this.dxFilter.filter(dx, smoothingFactor(te, this.dCutoff))

    // Adaptive cut-off
    const cutoff = this.minCutoff + this.beta * Math.abs(edx)
    return this.xFilter.filter(value, smoothingFactor(te, cutoff))
  }

  reset(): void {
    this.xFilter.reset()
    this.dxFilter.reset()
    this.lastTimestamp = null
  }
}

// ─── Matrix-level filter (16 elements) ─────────────────────────────────────────

export class OneEuroMatrixFilter {
  private filters: OneEuroFilter[]

  constructor(config?: OneEuroFilterConfig) {
    this.filters = Array.from({ length: 16 }, () => new OneEuroFilter(config))
  }

  /** Filter a 16-element column-major matrix array in-place and return it. */
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
