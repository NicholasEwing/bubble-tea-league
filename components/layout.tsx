import Navbar from "./navbar/index";
import Footer from "./footer/Footer";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode[];
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main className="bg-[#0a0e13]">{children}</main>
      <Footer />
    </>
  );
}
