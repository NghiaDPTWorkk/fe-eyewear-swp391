import React from 'react'

const products = [
  {
    id: '021231',
    name: 'Kanky Kitadakate (Green)',
    price: '$20.00',
    sales: 3000,
    status: 'Success'
  },
  {
    id: '021231',
    name: 'Kanky Kitadakate (Green)',
    price: '$20.00',
    sales: 2311,
    status: 'Success'
  },
  {
    id: '021231',
    name: 'Kanky Kitadakate (Green)',
    price: '$20.00',
    sales: 2111,
    status: 'Success'
  },
  {
    id: '021231',
    name: 'Kanky Kitadakate (Green)',
    price: '$20.00',
    sales: 1661,
    status: 'Success'
  }
]

export const PopularProducts: React.FC = () => {
  return (
    <div className="p-8 bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-base font-semibold text-gray-900 font-heading tracking-tight">
          Product Popular
        </h3>
        <button className="text-[12px] font-bold text-gray-400 hover:text-mint-600 transition-colors flex items-center gap-1 uppercase tracking-widest">
          Show All <span className="text-xs">↗</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-50/10">
              <th className="pb-4 text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em]">
                Product
              </th>
              <th className="pb-4 text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em]">
                Price
              </th>
              <th className="pb-4 text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em] text-center">
                Sales
              </th>
              <th className="pb-4 text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em] text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/50">
            {products.map((product, idx) => (
              <tr key={idx} className="group hover:bg-neutral-50/50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-neutral-100 group-hover:bg-white transition-colors">
                      <div className="w-8 h-8 bg-gray-200 rounded-sm transform rotate-12 opacity-50" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-0.5">
                        {product.id}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm font-medium text-gray-500">{product.price}</td>
                <td className="py-4 text-sm font-semibold text-gray-900 text-center">
                  {product.sales.toLocaleString()}
                </td>
                <td className="py-4 text-right">
                  <span className="inline-flex items-center px-3 py-1 bg-mint-50 text-mint-600 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-mint-100/50">
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
