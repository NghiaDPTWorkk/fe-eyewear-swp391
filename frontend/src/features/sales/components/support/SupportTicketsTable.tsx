/**
 * SupportTicketsTable Component
 * Displays support tickets with status and actions
 */
import { Card, Button } from '@/components'
import {
  IoChevronForward,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoFilter
} from 'react-icons/io5'

interface SupportTicketsTableProps {
  onRowClick: (id: string) => void
}

const TICKETS = [
  {
    id: 'TKT-001',
    subject: 'Order not received',
    customer: 'John Doe',
    email: 'john.d@example.com',
    priority: 'High',
    priorityColor: 'bg-red-50 text-red-600 border-red-100',
    status: 'Open',
    statusColor: 'bg-orange-50 text-orange-600 border-orange-100',
    created: 'Jan 28, 2026'
  },
  {
    id: 'TKT-002',
    subject: 'Wrong prescription',
    customer: 'Jane Smith',
    email: 'jane.s@example.com',
    priority: 'Medium',
    priorityColor: 'bg-amber-50 text-amber-600 border-amber-100',
    status: 'In Progress',
    statusColor: 'bg-blue-50 text-blue-600 border-blue-100',
    created: 'Jan 27, 2026'
  },
  {
    id: 'TKT-003',
    subject: 'Return request',
    customer: 'Mike Johnson',
    email: 'mike.j@example.com',
    priority: 'Low',
    priorityColor: 'bg-neutral-50 text-neutral-600 border-neutral-100',
    status: 'Resolved',
    statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    created: 'Jan 26, 2026'
  }
]

export default function SupportTicketsTable({ onRowClick }: SupportTicketsTableProps) {
  return (
    <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex gap-3">
          <Button size="sm" variant="outline" colorScheme="neutral" leftIcon={<IoFilter />}>
            Filter
          </Button>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button className="px-3 py-1 text-xs font-medium bg-white shadow-sm rounded-md text-gray-800">
              All
            </button>
            <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-800">
              Open
            </button>
            <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-800">
              Resolved
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500">Showing 1-10 of 142 tickets</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                Ticket ID
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                Subject
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                Customer
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle">
                Priority
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle">
                Status
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                Created
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {TICKETS.map((ticket) => (
              <tr
                key={ticket.id}
                className="hover:bg-gray-50/50 cursor-pointer group"
                onClick={() => onRowClick(ticket.id)}
              >
                <td className="px-6 py-4 text-sm text-emerald-500 font-semibold align-middle tracking-tight">
                  #{ticket.id}
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-900">{ticket.subject}</div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-900">{ticket.customer}</div>
                  <div className="text-[11px] text-gray-400 font-medium">{ticket.email}</div>
                </td>
                <td className="px-6 py-4 align-middle text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${ticket.priorityColor}`}
                  >
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 align-middle text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${ticket.statusColor}`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-600">{ticket.created}</div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 h-9 w-9 text-neutral-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRowClick(ticket.id)
                    }}
                  >
                    <IoChevronForward size={18} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
        <span>Displaying 3 of 142 tickets</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            colorScheme="neutral"
            size="sm"
            className="px-2 border-neutral-200"
          >
            <IoChevronBackOutline />
          </Button>
          <Button
            variant="solid"
            colorScheme="primary"
            size="sm"
            className="min-w-[32px] px-2 font-bold"
          >
            1
          </Button>
          <Button
            variant="outline"
            colorScheme="neutral"
            size="sm"
            className="px-2 border-neutral-200"
          >
            <IoChevronForwardOutline />
          </Button>
        </div>
      </div>
    </Card>
  )
}
