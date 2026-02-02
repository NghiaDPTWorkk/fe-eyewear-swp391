import { Button } from '@/components'
export const Newsletter = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-heading font-bold text-white">Join Our Mailing List</h2>
          <p className="text-primary-100 text-lg">
            Subscribe to get special offers, free giveaways, and exclusive deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl border-2 border-white bg-white/10 text-white placeholder-white/70 focus:outline-none focus:bg-white/20 transition-all"
            />
            <Button className="px-8 py-4 bg-white text-primary-500 font-semibold rounded-xl hover:bg-mint-200 transition-all duration-300 whitespace-nowrap">
              Subscribe
            </Button>
          </div>
          <p className="text-primary-100 text-sm">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
