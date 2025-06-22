export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-20 px-4 border-t border-gray-800/50">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <span className="text-2xl font-light tracking-wide">Canvas</span>
            </div>
            <p className="text-gray-400 mb-8 max-w-md font-light text-lg leading-relaxed">
              Minimalist collaborative drawing. Perfect shapes, powerful teamwork, pure elegance.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">Discord</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-6 text-lg">Product</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Demo</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-6 text-lg">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300 font-light">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800/50 mt-16 pt-8 text-center text-gray-500">
          <p className="font-light">&copy; 2024 Canvas. Crafted with love for creative teams.</p>
        </div>
      </div>
    </footer>
  );
};