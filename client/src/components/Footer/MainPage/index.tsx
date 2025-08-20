import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-16 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-bold text-blue-600 mb-4 inline-block">Medilab</Link>
            <div className="mt-4 text-gray-600">
              <p>A108 Adam Street</p>
              <p>New York, NY 535022</p>
              <div className="mt-4">
                <p><span className="font-semibold">Phone:</span> +1 5589 55488 55</p>
                <p><span className="font-semibold">Email:</span> info@example.com</p>
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Useful Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Home</a>
              </li>
              <li>
                <a href="#about" className="text-gray-600 hover:text-blue-600 transition">About us</a>
              </li>
              <li>
                <a href="#services" className="text-gray-600 hover:text-blue-600 transition">Services</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Terms of service</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Privacy policy</a>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Web Design</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Web Development</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Product Management</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Marketing</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Graphic Design</a>
              </li>
            </ul>
          </div>

          {/* Departments */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Departments</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Cardiology</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Neurology</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Hepatology</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Pediatrics</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Eye Care</a>
              </li>
            </ul>
          </div>

          {/* Doctors */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Our Doctors</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Dr. Walter White</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Dr. Sarah Jhonson</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Dr. William Anderson</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Dr. Amanda Jepson</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-6 text-center">
          <p className="text-gray-600">
            © <span>Copyright</span>{' '}
            <strong className="text-blue-600">Medilab</strong>{' '}
            <span>All Rights Reserved</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;