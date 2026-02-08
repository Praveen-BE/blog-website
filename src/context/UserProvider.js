// context/UserProvider.js
"use client"; // required in Next.js App Router

import { useState } from "react";
import { UserContext } from "./UserContext";

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
