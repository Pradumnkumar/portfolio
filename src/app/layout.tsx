import type { Metadata } from "next";
import "./globals.css";
import ThemeProviderWrapper from "@/src/components/ThemeProviderWrapper";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

export const metadata: Metadata = {
  title: "Pradumn Kumar | Senior Software Engineer",
  description: "5+ years building real-time data systems and embedded solutions. Expert in C++, Python, system design, and full-stack development. Currently at Jaguar Land Rover.",
  authors: [{ name: "Pradumn Kumar" }],
  keywords: ["Senior Engineer", "C++", "Python", "Real-Time Systems", "Embedded", "GCP", "Django", "React"],
  openGraph: {
    title: "Pradumn Kumar | Senior Software Engineer",
    description: "Building scalable systems for automotive telemetry and data platforms",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors">
        <ThemeProviderWrapper>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
