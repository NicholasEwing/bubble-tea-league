import Navbar from "./navbar/index.js";
import Footer from "./footer/Footer.js";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0e13]">{children}</main>
      <Footer />
    </>
  );
}
