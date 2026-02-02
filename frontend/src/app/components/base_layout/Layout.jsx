"use client";
import Header from "@/app/components/header/Header";
import Sidebar from "@/app/components/sidebar/Sidebar";
import styles from "./Layout.module.css";
import { useRef, useState } from "react";

export default function Layout({ children, headerTitle, mainTitle, isAdmin}) {
  const sidebarRef = useRef(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);


  function onSidebarToggle() {
    setIsSidebarVisible(!isSidebarVisible);
  }

  return (
    <div className={styles.layoutContainer}>
      <Header
        isSidebarVisible={isSidebarVisible}
        title={headerTitle}
        onSidebarToggle={onSidebarToggle}
      ></Header>
      <Sidebar ref={sidebarRef} visible={`${isSidebarVisible}`} isAdmin={isAdmin}></Sidebar>
      <main className={styles.mainLayoutContainer}>
        <div>
          {mainTitle && <h1 className={styles.mainTitle}>{mainTitle}</h1>}
        </div>
        {children}
      </main>
    </div>
  );
}
