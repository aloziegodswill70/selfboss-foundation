"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Navbar() {
  const router = useRouter();
  const timeoutRef = useRef();

  const handleMouseDown = () => {
    timeoutRef.current = setTimeout(() => {
      router.push("/admin/register");
    }, 800); // long press = 800ms
  };

  const handleMouseUp = () => {
    clearTimeout(timeoutRef.current);
  };

  const handleDoubleClick = () => {
    router.push("/admin/login");
  };

  return (
    <nav className="bg-black text-gold py-4 px-6 flex justify-between items-center shadow-md">
      <div
        className="font-bold text-xl cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      >
        SelfBoss Foundation
      </div>
      <div className="space-x-4">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/contact" className="hover:underline">Contact</Link>
      </div>
    </nav>
  );
}
