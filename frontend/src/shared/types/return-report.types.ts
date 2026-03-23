export interface ReturnMonthlyReportData {
  reportByTotal: {
    curCount: number
    preCount: number
    difRate: number
  }
  reportByStatus: Array<{
    status: string
    curCount: number
    preCount: number
    difRate: number
  }>
}
