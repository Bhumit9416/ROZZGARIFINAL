import { Link } from "react-router-dom"
import { useQuery } from "react-query"
import axios from "axios"
import { Search, CheckCircle, Star, MapPin, Zap, Wrench, HomeIcon, Hammer } from "lucide-react"

const Home = () => {
  const { data: services } = useQuery("services", () => axios.get("/api/services").then((res) => res.data))

  const { data: featuredWorkers } = useQuery("featuredWorkers", () =>
    axios.get("/api/users/workers?limit=6&sortBy=rating.average").then((res) => res.data.workers),
  )

  const serviceIcons = {
    electrical: Zap,
    plumbing: Wrench,
    cleaning: HomeIcon,
    construction: Hammer,
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Find Skilled Workers for Every Job</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with trusted professionals in your area. From electricians to housemaids, find the right person for
            any task, anytime.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Link
                to="/jobs"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Search
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Verified Workers</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through our most requested services and find skilled professionals ready to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services?.slice(0, 8).map((service) => {
              const IconComponent = serviceIcons[service.category] || Hammer
              return (
                <Link
                  key={service._id}
                  to={`/workers?service=${service._id}`}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Workers */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Rated Workers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet some of our highest-rated professionals who deliver exceptional service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWorkers?.map((worker) => (
              <Link
                key={worker._id}
                to={`/workers/${worker._id}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <img
                    src={worker.profilePicture || "/placeholder.svg?height=80&width=80"}
                    alt={worker.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{worker.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{worker.services?.[0]?.name || "Professional"}</p>

                  <div className="flex items-center justify-center space-x-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{worker.rating.average.toFixed(1)}</span>
                    <span className="text-gray-500">({worker.rating.count} reviews)</span>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{worker.location?.city || "Location not specified"}</span>
                  </div>

                  <div className="text-center font-semibold text-lg text-green-600">Rs. {worker.hourlyRate}/hour</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/workers"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View All Workers
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Rozzgari Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting the help you need is simple and straightforward with our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Search Services</h3>
              <p className="text-gray-600">Browse through our categories or search for specific services you need.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Choose Worker</h3>
              <p className="text-gray-600">
                View profiles, ratings, and reviews to select the best worker for your job.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Book & Connect</h3>
              <p className="text-gray-600">
                Contact the worker directly and schedule your service at your convenience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who found the perfect worker for their needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/workers"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Find a Worker
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              Join as a Worker
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
