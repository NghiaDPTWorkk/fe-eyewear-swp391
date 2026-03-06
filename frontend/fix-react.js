const fs = require('fs')
const path = require('path')

const files = [
  'src/components/layout/staff/operationstaff/checkorderlistfrominvoice/InvoiceInformationItem.tsx',
  'src/components/layout/staff/operationstaff/operationprocesspacking/OrderScanner.tsx',
  'src/pages/manager/components/product-create/ProductBaseInfoSection.tsx',
  'src/pages/manager/components/product-create/ProductFrameSpecSection.tsx',
  'src/pages/manager/components/product-create/ProductJsonPreview.tsx',
  'src/pages/manager/components/product-create/ProductLensSpecSection.tsx',
  'src/pages/manager/components/product-create/ProductTypeSection.tsx',
  'src/pages/manager/components/product-create/ProductVariantsSection.tsx',
  'src/pages/manager/ManagerAddAttributePage.tsx',
  'src/shared/components/staff/operation-staff/packing-checklist/CheckItem.tsx',
  'src/shared/components/staff/operation-staff/scan-section/SanSection.tsx',
  'src/shared/components/staff/operation-staff/shipping-label/ShippingLabel.tsx',
  'src/shared/components/staff/staff-core/order-summary/OrderSumary.tsx',
  'src/shared/components/ui/contactsupportteam/ContactSupportTeam.tsx',
  'src/shared/components/ui/faqsection/FAQSection.tsx',
  'src/shared/components/ui/packingchecklist/CheckItem.tsx',
  'src/shared/components/ui/scansection/SanSection.tsx'
]

for (const file of files) {
  const fullPath = path.join(
    'd:/FOR_LEARN/FPT/LEARN/SEMESTER_5/SWP391-ThinhDP/FE_Eyewear_Project/frontend',
    file
  )
  try {
    let content = fs.readFileSync(fullPath, 'utf8')
    content = content.replace("import React from 'react'\n", '')
    content = content.replace("import React from 'react'\r\n", '')
    fs.writeFileSync(fullPath, content)
    console.log(`Replaced in ${file}`)
  } catch (e) {
    console.log(`Failed for ${file}: `, e.message)
  }
}
