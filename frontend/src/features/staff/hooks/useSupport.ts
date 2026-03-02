import { useQuery } from '@tanstack/react-query'
import { supportService } from '../services/support.service'

export const useSupportTickets = () => {
  return useQuery({
    queryKey: ['reportTickets'],
    queryFn: () => supportService.getReportTickets(),
    select: (response) => response.data.reportTicketList
  })
}

export const useSupportHistory = () => {
  return useQuery({
    queryKey: ['reportHistory'],
    queryFn: () => supportService.getMyHistory(),
    select: (response) => response.data.reportTicketList
  })
}
