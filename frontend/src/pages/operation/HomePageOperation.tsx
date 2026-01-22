import { Container, HeaderStaff } from '@/components'
import { NavActions, NavSearch } from '@/components/common/staff/NavListStaff'
import React from 'react'

export default function HomePageOperation() {
  return (
    <div className="flex min-h-screen w-full bg-neutral-50">
      <aside className="w-[300px] bg-mint-700 text-white shrink-0">
        <div className="p-6 text-xl font-bold">OpticView</div>
      </aside>

      <div className="flex-1 flex flex-col">
        <HeaderStaff containerWidth="1200px" left={<NavSearch />} right={<NavActions />} />

        <main className="p-4">
          <Container>
            <div className=" min-h-[500px] ">
              <h4 className="text-xl font-bold text-primary-800 mb-6">Order Overview</h4>
            </div>
          </Container>
        </main>
      </div>
    </div>
  )
}
