"use client";
import { FormProvider, useForm } from 'react-hook-form';
import styles from './styles.module.css'
import { useRouter } from 'next/navigation';
import { accountsRoute } from '../utils/routes';
import Input from '../components/form/input/Input';
import Select from '../components/form/input/Select';
import { roles } from '../utils/data';
import { useEffect, useState } from 'react';
import { emailValidation, fullNameValidation, passwordValidation, roleValidation } from '../utils/adminAccountValidator';

export default function AccountForm ({onSubmit, account}) {
  const router = useRouter();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const methods = useForm({
    defaultValues: account || {},
  });
  const submit = methods.handleSubmit( async (data) => {
    setIsCreatingAccount(true);

    if (account && !data.password) delete data.password;
    const err = await onSubmit(data);

    if(err) {
      methods.setError("root.serverError", {
        type: "server",
        message: err,
      });

      
    } else {
      router.push(accountsRoute);
    }
    
    setIsCreatingAccount(false);
  });
  
  useEffect(() => {
      if (account) {
      methods.reset({
          ...account,
      });
      }
  }, [account, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}>

        <article className={styles.fieldsContainer}>

          <div className={styles.row}>
            <Input {...fullNameValidation}/>
            <Input {...emailValidation}/>
          </div>

          <div className={styles.row}>
            <Input {...passwordValidation(account ? false : 'Ingrese la contraseña')}/>
            <Select options={roles} {...roleValidation}/>
          </div>

          <div className={styles.row}>
            {methods.formState.errors.root?.serverError && (
                <div className={styles.errorMessage}>
                    {methods.formState.errors.root.serverError.message}
                </div>
            )}
          </div>

          <div className={styles.fieldsConta}>

              <div className={styles.buttons}>
                  <button
                      className={styles.cancelButton}
                      onClick={(e) => {
                          e.preventDefault();
                          router.push(accountsRoute);
                      }}>
                      Cancelar
                  </button>
                  <button type="submit" disabled={isCreatingAccount}>Confirmar</button>
              </div>
          
          </div>
        </article>
      </form>
    </FormProvider>
  );
}