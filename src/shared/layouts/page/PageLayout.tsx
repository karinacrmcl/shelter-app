import { CSSProperties, ReactNode } from "react";
import s from "./PageLayout.module.scss";

type Props = {
  children: ReactNode;
  styles?: CSSProperties;
};

export function PageLayout({ children }: Props) {
  return (
    <div className={s.container}>
      <div className={s.content}>{children}</div>
    </div>
  );
}
