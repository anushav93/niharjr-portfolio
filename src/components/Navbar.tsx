const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between p-4 md:px-8 transition-all duration-300 ease-in-out bg-white">
      <div className="flex items-center">
        <a href="/" className="mr-4 text-xl font-extralight text-blue-600">
          <img src="/njrlogo.svg" alt="Nihar J Reddy" className="h-10 w-10" />
        </a>
      </div>
      <div>
        <ul className="flex space-x-6">
          <li>
            <a href="/" className="text-blue-600 ">
              Home
            </a>
          </li>
          <li>
            <a href="/about" className="text-blue-600">
              About
            </a>
          </li>
          <li>
            <a href="/gallery" className="text-blue-600">
              Gallery
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
