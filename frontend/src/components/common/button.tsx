import { CSSProperties, FC } from "react";
import styles from "./button.module.scss";
type ButtonTypes = "primary" | "secondary" | "danger" | "info" | "success";

type ButtonProps = {
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
  defaultButtonType?: ButtonTypes;
  type?: "button" | "reset" | "submit";
  children: React.ReactNode;
};

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  style,
  className,
  defaultButtonType,
  type,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        ...(style ? style : undefined),
      }}
      className={`${styles.button} ${className} ${
        defaultButtonType ? styles[defaultButtonType] : ""
      }`}
      type={type}
    >
      {children}
    </button>
  );
};
