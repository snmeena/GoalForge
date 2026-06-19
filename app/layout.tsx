// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans"; 
import { ThemeProvider } from "@/components/ThemeProvider";
import { SmartEnterProvider } from "@/components/SmartEnterProvider";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // maximumScale aur userScalable yahan se hata diye gaye hain
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f14" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "GoalForge | Adaptive Goal & Habit Tracking",
    template: "%s | GoalForge",
  },
  description: "Adaptive goal tracker that automatically recalculates your daily targets when life gets in the way. Track coding, fitness, study goals and habits without streak anxiety.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${inter.variable} ${GeistSans.variable} ${jetbrainsMono.variable}`} 
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const theme = savedTheme || systemTheme;
                  document.documentElement.setAttribute('data-theme', theme);

                  // Add a style to prevent transition flash on initial load
                  const style = document.createElement('style');
                  style.innerHTML = '*, *::before, *::after { transition: none !important; }';
                  document.head.appendChild(style);
                  setTimeout(() => {
                    style.remove();
                  }, 0);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      {/* Cleaned up body with overflow-x-clip for mobile functionality */}
      <body className="font-sans antialiased bg-base text-primary min-h-[100dvh] flex flex-col overflow-x-clip">
        <NextTopLoader 
          color="var(--primary)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--primary),0 0 5px var(--primary)"
        />
        <ThemeProvider>
          <SmartEnterProvider>
            {children}
          </SmartEnterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}