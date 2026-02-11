import Link from 'next/link'
import React from 'react'

const NavList = () => {
  return (
    <ul className="lg:flex lg:gap-x-10 max-lg:space-y-3">
    <li>
        <a href="#" className="text-slate-900 block text-[15px] font-medium">
        Home
        </a>
    </li>
    <li>
        <a href="#" className="text-slate-900 block text-[15px] font-medium">
        Catagories
        </a>
    </li>
    <li>
        <Link href="/create" className="text-slate-900 block text-[15px] font-medium">
        Create New Post
        </Link>
    </li>
        <li>
        <Link href="/myblogs" className="text-slate-900 block text-[15px] font-medium">
        My Blogs
        </Link>
    </li>
    {/* Add more links */}
    </ul>
  )
}

export default NavList