/**
 * Mapping of order status to process tracker step index (0-4)
 * 0: Pending (Time icon)
 * 1: Processing (Construct icon)
 * 2: Packaging (Cube icon)
 * 3: Ready for Pickup (Cube icon)
 * 4: Shipping (Car icon)
 */

export const getOrderProgressStep = (
  orderStatus?: string,
  _orderType?: string,
  invoiceStatus?: string
): number => {
  // 1. Check Invoice Status (highest priority for shipping stages)
  if (invoiceStatus === 'DELIVERED') {
    return 5 // All steps completed
  }
  
  if (invoiceStatus === 'DELIVERING') {
    return 4 // In Shipping stage
  }

  if (invoiceStatus === 'READY_TO_SHIP' || invoiceStatus === 'COMPLETED') {
    return 3 // Ready for Pickup
  }

  // 2. Check Order Status
  if (orderStatus === 'COMPLETED') {
    return 5 // All steps completed
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
