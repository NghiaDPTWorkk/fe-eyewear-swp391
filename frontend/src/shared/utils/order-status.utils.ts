export const getOrderProgressStep = (
  orderStatus?: string,
  _orderType?: string,
  invoiceStatus?: string
): number => {
  if (invoiceStatus === 'DELIVERED') {
    return 5
  }

  if (invoiceStatus === 'DELIVERING') {
    return 4
  }

  if (invoiceStatus === 'READY_TO_SHIP' || invoiceStatus === 'COMPLETED') {
    return 3
  }

  if (orderStatus === 'COMPLETED') {
    return 5
  }

  switch (orderStatus) {
    case 'PACKAGED':
    case 'PACKAGING':
    case 'PACKING':
      return 2
    case 'MAKING':
      return 1
    case 'PENDING':
    case 'VERIFIED':
    case 'APPROVED':
    case 'ASSIGNED':
      return 0
    default:
      return 0
  }
}
