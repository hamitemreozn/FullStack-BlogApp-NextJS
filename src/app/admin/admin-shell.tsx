import type { ReactNode } from "react";

import styles from "./admin.module.css";

export function AdminShell({ children }: { children: ReactNode }) {
  return <main className={`${styles.adminPage} page-shell`}>{children}</main>;
}
