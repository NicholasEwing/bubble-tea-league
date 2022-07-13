import Navbar from "./navbar/index.js";
import Footer from "./footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="h-screen bg-[#0a0e13]">{children}</main>
      {/* <Footer /> */}
    </>
  );
}
