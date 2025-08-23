import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <span className="footer__author">Developed by Myo Myat Myat Thant</span>
      <span className="footer__year">{currentYear}</span>
    </footer>
  );
}

export default Footer;
