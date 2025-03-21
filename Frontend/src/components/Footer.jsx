const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-yellow-500">Andar Bahar</h3>
            <p className="text-gray-400 mt-1">Experience the classic Indian card game online</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
            <a href="#" className="text-gray-300 hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              Contact Us
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>© {currentYear} . All rights reserved.</p>
          <p className="mt-2 text-sm">This game is for entertainment purposes only. No real money is involved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

