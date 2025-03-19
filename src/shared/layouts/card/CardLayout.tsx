import classNames from "classnames";
import { ReactNode } from "react";
import s from "./CardLayout.module.scss";

type Props = {
  children: ReactNode;
  title?: string;
  className?: string;
};

export default function CardLayout({ children, title, className }: Props) {
  return (
    <div className={classNames(s.container, className)}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}
