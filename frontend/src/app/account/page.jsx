'use client';
import { useEffect, useState } from "react";
import Layout from "../components/base_layout/Layout";
import layout from '../admin/Main.module.css'
import { getAccount, updateAccount } from "./api/account";
import Input from "../components/form/input/Input";
import { emailValidation, fullNameValidation, passwordValidation } from "../utils/accountValidators";
import { useForm, FormProvider } from "react-hook-form";
import styles from './styles/styles.module.css';
import toast from "react-hot-toast";

export default function Account(){
    const [userInfo, setUserInfo] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const methods = useForm({
        defaultValues: userInfo || {},
    });

    const password_methods = useForm({
        defaultValues: {password : ''},
    });
    

    useEffect(() => {
        const load = async () => {
            const data = await getAccount();
            setUserInfo(data);
            methods.reset(data);
        };

        load();
    },[]);

        const update = methods.handleSubmit(async (data) => {
            setIsUpdating(true);
            delete data.role;
            delete data.password;

          
            const err = await updateAccount(data);
        
            if(err){
                toast.error(err);
            }else{
                toast.success('Se han actualizado sus datos');
            }

            setIsUpdating(false);
          
        });

        const submitPassword = password_methods.handleSubmit(async (data) => {
            setIsPassword(true);


            if(data.password == '' || data.password.length < 8){
                setIsPassword(false);
                return ;
            }
            const err = await updateAccount(data);
        
            if(err){
                toast.error(err);
            }else{
                toast.success('Contraseña cambiada con exito');
            }

            setIsPassword(false);
          
        });

    return (
        <Layout headerTitle="Detalles de Cuenta">
            <title>SG BarberShop - Cuenta</title>

            {userInfo&&<div className={layout.layout}>
                <header>
                    <h1>Informacion de cuenta</h1>
                    <hr />
                </header>

                <article className={styles.container} >
                    <div>
                        <FormProvider {...methods}>
                            <form
                                onSubmit={(e) => {
                                e.preventDefault();
                                update();
                                }}
                            >
                                <div className={styles.fields}>
                                    <h3>Actualizar cuenta</h3>

                                    <Input {...fullNameValidation}/>
                                    <Input {...emailValidation}/>

                                    <button disabled={isUpdating} type="submit">Guardar cambios</button>
                                </div>


                            </form>

                        </FormProvider>
                    </div>

                    <div>
                        <FormProvider {...password_methods}>
                            <form
                                onSubmit={(e) => {
                                e.preventDefault();
                                submitPassword();
                                }}
                            >
                                <div className={styles.fields}>
                                    <h3>Cambiar Contraseña</h3>
                                    <Input {...passwordValidation}/>

                                    <button disabled={isPassword || 
                                         (password_methods.watch("password") || "").length < 8
                                    } type="submit">Guardar cambios</button>
                                </div>


                            </form>

                        </FormProvider>
                    </div>


                </article>

            </div>}

        </Layout>
    )
}