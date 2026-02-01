import { Card } from '@/shared/components/ui'

export function FavoritesPage() {
  return (
    <div>
      <h2 className="text-[32px] font-bold text-mint-1200 mb-8">My favorites</h2>
      <Card className="p-10 flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-500 font-medium">Your favorite items will appear here.</p>
      </Card>
    </div>
  )
}
