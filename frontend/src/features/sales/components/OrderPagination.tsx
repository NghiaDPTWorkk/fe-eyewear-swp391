import React from 'react'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import { Button } from '@/components'

interface OrderPaginationProps {
  total: number
  currentPage: number
  pageSize: number
}

export const OrderPagination: React.FC<OrderPaginationProps> = ({
  total,
  currentPage,
  pageSize
}) => {
  return (
    <div className="flex items-center justify-between px-2 mt-6 text-sm text-gray-500">
      <span>
        Showing 1-{Math.min(pageSize, total)} of {total} orders
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          colorScheme="neutral"
          size="sm"
          className="px-2 border-neutral-200"
          disabled={currentPage === 1}
        >
          <IoChevronBackOutline />
        </Button>
        <Button
          colorScheme="primary"
          size="sm"
          className="min-w-[32px] px-2 font-semibold text-white"
        >
          1
        </Button>
        <Button
          variant="outline"
          colorScheme="neutral"
          size="sm"
          className="min-w-[32px] px-2 text-neutral-400 border-neutral-100"
        >
          2
        </Button>
        <Button
          variant="outline"
          colorScheme="neutral"
          size="sm"
          className="min-w-[32px] px-2 text-neutral-400 border-neutral-100"
        >
          3
        </Button>
        <span className="px-1 text-neutral-300">...</span>
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
  )
}
