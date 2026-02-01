import type { Order } from '../types'

export const mapApiOrderToFrontend = (o: any): Order => {
  const types = Array.isArray(o.type) ? o.type : [o.type]

  let frontendStatus = o.status
  if (o.status === 'PENDING') frontendStatus = 'WAITING_ASSIGN'
  else if (['MAKING', 'PACKAGING', 'ASSIGNED'].includes(o.status)) {
    frontendStatus = 'PROCESSING'
  } else if (o.status === 'COMPLETE' || o.status === 'COMPLETED') {
    frontendStatus = 'COMPLETED'
  }

  const isRx = types.includes('MANUFACTURING')
  // const isPreOrder = types.includes('PRE-ORDER')

  const firstProduct = o.products?.[0]
  const productName = firstProduct?.product?.sku || 'Product'
  const lensName = firstProduct?.lens?.sku ? ` + ${firstProduct.lens.sku}` : ''

  return {
    ...o,
    id: o.orderCode || o._id,
    realId: o._id,
    status: frontendStatus,
    isPrescription: isRx,
    orderType: types[0] || 'NORMAL',
    productName: `${productName}${lensName}`,
    customerName:
      o.customerName || (o.invoiceId ? `Customer (${o.invoiceId.slice(-4)})` : 'Customer'),
    totalAmount: o.price,
    lensParameter: firstProduct?.lens?.parameters
  }
}

export const filterOrdersByStatus = (orders: Order[]) => {
  const rxOrders = orders.filter(
    (o) => o.isPrescription && (o.status === 'WAITING_ASSIGN' || o.status === 'PROCESSING')
  )
  const pendingOrders = orders.filter((o) => o.isPrescription && o.status === 'WAITING_ASSIGN')
  const processedOrders = orders.filter((o) => !o.isPrescription || o.status !== 'WAITING_ASSIGN')

  return { rxOrders, pendingOrders, processedOrders }
}
