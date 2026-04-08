import Link from "next/link"
import {
  ShoppingBag,
  Truck,
  Wallet,
  ChevronRight,
  Sparkles,
  Clock,
  Star,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-100/60 to-amber-50/40 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-rose-100/40 to-orange-50/30 blur-3xl" />
        </div>

        <div className="container py-20 md:py-28 lg:py-36">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto animate-fade-up">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-semibold tracking-wide uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Student Exclusive
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Fresh Food,{" "}
              <span className="text-gradient">Free Delivery</span>
              <br />
              to Your Hostel
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              The Hunters Kitchen brings delicious, home-style meals straight to
              your college hostel door. No delivery fees, ever.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-10">
              <Link
                href="/menu"
                className="flex items-center gap-2.5 h-12 px-8 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                Order Now
              </Link>
              <Link
                href="/menu"
                className="flex items-center gap-2 h-12 px-6 rounded-xl border border-border/60 bg-background text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/40 transition-all duration-200"
              >
                View Menu
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-y border-border/40 bg-muted/20">
        <div className="container py-6">
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary/70" />
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary/70" />
              <span>30 Min Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary/70" />
              <span>Loved by 500+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary/70" />
              <span>Student-Friendly Prices</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 md:py-24">
        <div className="text-center mb-14 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Why Students Love Us
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Everything you need for a great meal, without the hassle
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 stagger-children">
          {[
            {
              icon: Truck,
              title: "Free Delivery",
              desc: "Zero delivery charges for all orders. We bring the food right to your hostel room.",
              gradient: "from-blue-500 to-cyan-500",
              shadow: "shadow-blue-500/20",
            },
            {
              icon: Wallet,
              title: "Student Prices",
              desc: "Specially curated pricing that fits a student budget. Quality food at honest rates.",
              gradient: "from-green-500 to-emerald-500",
              shadow: "shadow-green-500/20",
            },
            {
              icon: ShoppingBag,
              title: "Easy Ordering",
              desc: "Browse, pick, and order in minutes. Track your order and enjoy fresh food.",
              gradient: "from-orange-500 to-amber-500",
              shadow: "shadow-orange-500/20",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group p-7 rounded-2xl bg-card border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} ${feature.shadow} shadow-md mb-5`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 border-y border-border/40">
        <div className="container py-20 md:py-24">
          <div className="text-center mb-14 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              Three simple steps to a delicious meal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 stagger-children">
            {[
              {
                step: "01",
                title: "Browse Menu",
                desc: "Explore our curated menu of fresh, home-style meals made daily.",
              },
              {
                step: "02",
                title: "Add to Cart",
                desc: "Select your favorites and customize your order to your liking.",
              },
              {
                step: "03",
                title: "Get Delivered",
                desc: "Sit back and relax. We'll deliver hot food to your hostel door.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border/50 shadow-sm">
                  <span className="text-xl font-bold text-gradient">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 md:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-12 md:p-16 text-center">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Order?
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto text-base md:text-lg">
              Join hundreds of students who enjoy fresh meals delivered free
              every day.
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2.5 h-12 px-8 rounded-xl bg-white text-orange-600 font-semibold shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
              View Full Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
