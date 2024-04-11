import React, { FC } from "react";
import styles from ".//navbar.module.scss";
import Logo from "./Logo";
import { MenuLinks } from "../menu-links";
import { Button } from "@/components/common";

type NavbarProps = {
  toggle: () => void;
};

const Navbar: FC<NavbarProps> = ({ toggle }) => {
  return (
    <>
      <div className={styles.wrapper}>
        <div>
          <Logo />
          <MenuLinks />
          <Button
            defaultButtonType="primary"
            type="button"
            className={styles.hamburgerMenu}
            onClick={toggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
            >
              <path
                fill="#fff"
                d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"
              />
            </svg>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
