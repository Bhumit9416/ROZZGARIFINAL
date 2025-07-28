import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Users, CheckCircle, Star, MapPin, Phone, Mail, Wrench, Home, Zap, Hammer } from "lucide-react"
import Link from "next/link"

const services = [
  {
    id: 1,
    title: "Electricians",
    icon: Zap,
    description: "Licensed electrical work and repairs",
    workers: 45,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 2,
    title: "Plumbers",
    icon: Wrench,
    description: "Professional plumbing services",
    workers: 32,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 3,
    title: "House Cleaning",
    icon: Home,
    description: "Reliable housemaids and cleaners",
    workers: 78,
    color: "bg-green-100 text-green-800",
  },
  {
    id: 4,
    title: "General Labor",
    icon: Hammer,
    description: "Construction and manual labor",
    workers: 56,
    color: "bg-orange-100 text-orange-800",
  },
]

const featuredWorkers = [
  {
    id: 1,
    name: "Ahmed Hassan",
    service: "Electrician",
    rating: 4.9,
    reviews: 127,
    experience: "8 years",
    location: "Karachi",
    image: "/placeholder.svg?height=100&width=100",
    hourlyRate: "Rs. 800/hour",
  },
  {
    id: 2,
    name: "Fatima Ali",
    service: "House Cleaning",
    rating: 4.8,
    reviews: 89,
    experience: "5 years",
    location: "Lahore",
    image: "/placeholder.svg?height=100&width=100",
    hourlyRate: "Rs. 500/hour",
  },
  {
    id: 3,
    name: "Muhammad Khan",
    service: "Plumber",
    rating: 4.7,
    reviews: 156,
    experience: "10 years",
    location: "Islamabad",
    image: "/placeholder.svg?height=100&width=100",
    hourlyRate: "Rs. 700/hour",
  },
]

const steps = [
  {
    step: 1,
    title: "Search Services",
    description: "Browse through our categories or search for specific services you need.",
  },
  {
    step: 2,
    title: "Choose Worker",
    description: "View profiles, ratings, and reviews to select the best worker for your job.",
  },
  {
    step: 3,
    title: "Book & Connect",
    description: "Contact the worker directly and schedule your service at your convenience.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Rozzgari</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#services" className="text-gray-600 hover:text-blue-600">
              Services
            </Link>
            <Link href="#workers" className="text-gray-600 hover:text-blue-600">
              Find Workers
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600">
              How it Works
            </Link>
            <Button variant="outline">Join as Worker</Button>
            <Button>Post a Job</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Find Skilled Workers for Every Job</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with trusted professionals in your area. From electricians to housemaids, find the right person for
            any task, anytime.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input placeholder="What service do you need?" className="pl-10 h-12 text-lg" />
              </div>
              <Button size="lg" className="h-12 px-8">
                Search
              </Button>
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
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Popular Services</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through our most requested services and find skilled professionals ready to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge variant="secondary" className={service.color}>
                      {service.workers} workers available
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Workers */}
      <section id="workers" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Top Rated Workers</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet some of our highest-rated professionals who deliver exceptional service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWorkers.map((worker) => (
              <Card key={worker.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <img
                    src={worker.image || "/placeholder.svg"}
                    alt={worker.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-xl">{worker.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">{worker.service}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{worker.rating}</span>
                    <span className="text-gray-500">({worker.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{worker.location}</span>
                  </div>

                  <div className="text-center">
                    <Badge variant="outline">{worker.experience} experience</Badge>
                  </div>

                  <div className="text-center font-semibold text-lg text-green-600">{worker.hourlyRate}</div>

                  <Button className="w-full">Contact Worker</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How Rozzgari Works</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting the help you need is simple and straightforward with our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h4 className="text-xl font-semibold mb-4">{step.title}</h4>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who found the perfect worker for their needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-blue-600">
              Find a Worker
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Join as a Worker
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">Rozzgari</h4>
              </div>
              <p className="text-gray-400">
                Connecting skilled workers with people who need their services, contributing to employment and poverty
                reduction.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Electricians
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Plumbers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    House Cleaning
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    General Labor
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Safety
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+92 300 1234567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@rozzgari.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Rozzgari. All rights reserved. Empowering communities through employment.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
