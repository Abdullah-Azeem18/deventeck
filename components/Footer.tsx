import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <Logo />
        <ul className="footer-links">
          <li><a href="/#services">Services</a></li>
          <li><a href="/#work">Work</a></li>
          <li><a href="/#about">About</a></li>
          <li><a href="/#contact">Contact</a></li>
        </ul>
        <p>&copy; {new Date().getFullYear()} Deventeck. All rights reserved.</p>
      </div>
    </footer>
  );
}