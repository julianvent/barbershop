"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import styles from "./styles.module.css";

export function ActionButton({ id, actions }) {
  const router = useRouter();
  const seeButtonRef = useRef(null);
  const editButtonRef = useRef(null);

  const handleClick = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    const finalRoute = action.route.replace("${id}", encodeURIComponent(id));
    router.push(finalRoute);
  };

  const handleKeyDown = (e, action) => {
    if(!(e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight'|| e.key === 'ArrowLeft')){
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      handleClick(e, action);
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      if (document.activeElement === seeButtonRef.current && editButtonRef.current) {
        editButtonRef.current.focus();
      }
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      if (document.activeElement === editButtonRef.current && seeButtonRef.current) {
        seeButtonRef.current.focus();
      }
    }


  };

  const edit = actions.find((u) => u.name === "edit");
  const see = actions.find((u) => u.name === "see");

  return (
    <div className={styles.buttons}>
      {see && (
        <button 
          ref={seeButtonRef}
          onClick={(e) => handleClick(e, see)}
          onKeyDown={(e) => handleKeyDown(e, see)}
          type="button"
          tabIndex={0}
          aria-label="Ver detalles"
        >
          <div className={styles.iconContainer}>
            <img src="/icons/circle-info-solid-full.svg" alt="" />
          </div>
        </button>
      )}
      
      {edit && (
        <button 
          ref={editButtonRef}
          onClick={(e) => handleClick(e, edit)}
          onKeyDown={(e) => handleKeyDown(e, edit)}
          type="button"
          tabIndex={0}
          aria-label="Editar"
        >
          <div className={styles.iconContainer}>
            <img src="/icons/pen-to-square-solid-full.svg" alt="" />
          </div>
        </button>
      )}
    </div>
  );
}