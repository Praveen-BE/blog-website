// ============================================
// FILE: app/layout.js
// Root layout for all pages
// ============================================

import "./globals.css";
import Header from '../components/Header';
import UserProvider from "../context/UserProvider";
import { EditorProvider } from "@/context/EditorContext";

export const metadata = {
  title: 'My Blog',
  description: 'A blog built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>
        <UserProvider>
          <EditorProvider>
        <Header />
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {children}
        </main>
        </EditorProvider>
        </UserProvider>
      </body>
    </html>
  );
}
