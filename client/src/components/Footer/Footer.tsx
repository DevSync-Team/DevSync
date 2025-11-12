// components/Footer.tsx
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div className="md:col-span-1">
            <h1 className="text-2xl font-bold mb-4">DevSync</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              The future of collaborative coding is here. Build better software together.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 DevSync. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <span className="text-gray-500">Powered by Readdy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer