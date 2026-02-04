// ============================================
// FILE: components/Header.js
// Navigation header component
// ============================================

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ 
      background: '#333', 
      color: 'white', 
      padding: '20px',
      marginBottom: '30px'
    }} className="bg-[#333] ">
      <nav style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
          My Blog
        </Link>
        <span style={{ marginLeft: '30px' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
            Home
          </Link>
          <Link href="/categories" style={{ color: 'white', textDecoration: 'none' }}>
            Categories
          </Link>
        </span>
      </nav>
      <nav style={{ display: 'flex',flexDirection: 'column'}}>
        <Image style={{borderRadius: '50%'}} src="/dontInteterstToSetProfile.svg" alt="My Icon" width={50} height={50} />
        <p>User Name</p>
      </nav>
    </header>
  );
}