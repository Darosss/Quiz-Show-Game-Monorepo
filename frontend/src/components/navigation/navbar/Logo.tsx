"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

const Logo = () => {
  const [showButton, setShowButton] = useState(false);

  const changeNavButton = () => {
    if (window.scrollY >= 400 && window.innerWidth < 768) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavButton);
  }, []);

  return (
    <Link
      href="/"
      style={{
        aspectRatio: "1",
        display: showButton ? "none" : "block",
        width: "10vmin",
        position: "relative",
        height: "10vmin",
      }}
    >
      <Image
        src="/images/logo.png"
        alt="Logo"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        fill
        priority={true}
      />
    </Link>
  );
};

export default Logo;
