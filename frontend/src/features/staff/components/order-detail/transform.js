const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, 'OrderDetail.tsx')
let text = fs.readFileSync(file, 'utf8')

text = text
  .replace("'PRE-ORDER PLACED'", "'Pre-order Placed'")
  .replace("'SUPPLIER NOTIFICATION'", "'Supplier Notification'")
  .replace("'ESTIMATED ARRIVAL'", "'Estimated Arrival'")
  .replace("'ORDER CREATED'", "'Order Created'")
  .replace("'CURRENT STAGE'", "'Current Stage'")

text = text.replace(
  '<h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>',
  '<h4 className="text-sm font-bold text-slate-800">{item.title}</h4>'
)

const gridStartPattern = '<div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">'
let beforeGrid = text.substring(0, text.indexOf(gridStartPattern))

const extractBlock = (startStr, endStr) => {
  const start = text.indexOf(startStr)
  const end = text.indexOf(endStr, start)
  if (start === -1 || end === -1) throw new Error('Could not find: ' + startStr)
  return text.substring(start, end)
}

const orderItems = extractBlock('          {}', '          {}')
const activityFlow = extractBlock('          {}', '          {}')
const transactions = extractBlock('          {}', '        </div>\n\n        {}')

const customerInfo = extractBlock('          {}', '          {}')
const fulfillment = extractBlock('          {}', '          {children}')
const childrenStr = extractBlock('          {children}', '          {}')
const staffMemo = extractBlock('          {}', '        </div>\n      </div>\n    </div>\n  )\n}')

const stretchCard = (block, span) => {
  return block.replace(
    /<Card className="([^"]+)">/,
    '<Card className="xl:col-span-' + span + ' h-full flex flex-col $1">'
  )
}

const newGridHtml =
  '<div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">\n' +
  stretchCard(orderItems, 8) +
  stretchCard(customerInfo, '4') +
  stretchCard(activityFlow, 8) +
  stretchCard(fulfillment, 4) +
  '          <div className="xl:col-span-12 w-full">\n' +
  childrenStr +
  '          </div>\n' +
  stretchCard(transactions, 8) +
  stretchCard(staffMemo, 4) +
  '      </div>\n    </div>\n  )\n}'

text = beforeGrid + newGridHtml

fs.writeFileSync(file, text)
console.log('Transform completed successfully!')
