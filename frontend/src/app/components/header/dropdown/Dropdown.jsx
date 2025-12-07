import Link from 'next/link';
import style from './styles.module.css';
import { useState, useRef, useEffect } from 'react';
import { logOut } from '@/app/utils/requestBuilder';

export function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className={style.container}>
      <button
        ref={buttonRef}
        className={style.button}
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="user-menu"
      >
        <figure>
          <img src="/circle-user-solid-full.svg" alt="Menú de usuario" />
        </figure>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          id="user-menu"
          className={style.menuWrapper}
        >
          <ul className={style.dropdown}>
            <li role="none">
              <Link role="menuitem" href="/account">
                <div className={style.iconContainer}>
                  <img src="/icons/gear-solid-full.svg" alt="" />
                </div>
                Configuración de la cuenta
              </Link>
            </li>
            <li role="none">
              <Link
                role="menuitem"
                href="#"
                onClick={() => logOut()}
              >
                <div className={style.iconContainer}>
                  <img src="/icons/arrow-right-from-bracket-solid-full.svg" alt="" />
                </div>
                Cerrar sesión
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
