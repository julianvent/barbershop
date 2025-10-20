import LoginForm from "@/app/components/login_form/LoginForm";
import styles from "./login.module.css";

export default function Login() {
  return (
    <div className={styles.layout}>
      <div className={styles.hero}></div>
      <div className={styles.loginContainer}>
        <LoginForm></LoginForm>
      </div>
    </div>
  );
}
