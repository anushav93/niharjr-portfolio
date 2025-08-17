const Navbar: React.FC = () => {
  return (
    <nav className="w-full px-6 lg:px-8 h-20 flex items-center justify-between text-neutral-900 dark:text-white border-b border-neutral-400 dark:border-neutral-600">
      <a href="/" className="flex items-center gap-2">
        <img
          src="/njrlogo.svg"
          alt="Nihar J Reddy"
          className="h-8 w-8 brightness-0 dark:invert"
        />
        <span className="text-base font-medium tracking-tight">NJ Reddy</span>
      </a>
      <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
        <li>
          <a
            className="hover:text-blue-600 transition-opacity uppercase tracking-widest font-light"
            href="/"
          >
            Home
          </a>
        </li>
        <li>
          <a
            className="hover:text-blue-600 transition-opacity uppercase tracking-widest font-light"
            href="/gallery"
          >
            Gallery
          </a>
        </li>
        <li>
          <a
            className="hover:text-blue-600 transition-opacity uppercase tracking-widest font-light"
            href="/about"
          >
            About
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
