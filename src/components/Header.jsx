import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-green-600 text-white font-poppins shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-3xl md:text-4xl font-bold text-green-100 mb-4 md:mb-0">
                GeoCrop <span className="text-green-950">SAT</span>
            </h1>

        {/* Burger Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          <a href="#">Home</a>
          <a href="#">Map</a>
          <a href="#">Check Suitability</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="flex flex-col md:hidden px-6 pb-4 space-y-2 text-lg font-medium">
          <a href="#" className="hover:text-green-200">Home</a>
          <a href="#" className="hover:text-green-200">Map</a>
          <a href="#" className="hover:text-green-200">Check Suitability</a>
          <a href="#" className="hover:text-green-200">About</a>
          <a href="#" className="hover:text-green-200">Contact</a>
        </div>
      )}
    </nav>
  );
}
