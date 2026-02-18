"use client";
import { getAdminAccount, updateAdminAccount } from "@/app/apiHandlers/account";
import Layout from "@/app/components/base_layout/Layout";
import AccountForm from "@/app/forms/AccountForm";
import React, { useEffect, useState } from "react";
import warning from "../../../../forms/styles.module.css"


export default function ShowAccount({ params, isAdmin}){
  const {id} = React.use(params);
  const [account, setAccount] = useState(null);
  const [message, setMessage] = useState(null);

  const submit = async (data) => {
    try {
      await updateAdminAccount({data, id})
    } catch (error) {
      return error;
    }
  };


  useEffect(() => {
    const load = async () => {
      try {
        const acc = await getAdminAccount(id);
        setAccount(acc);
      } catch (err) {
        setMessage(err);
      }
    };
    load();
  }, []);

  return (
    <Layout isAdmin={isAdmin}
      mainTitle={'Usuario: ' + (account ? account.full_name : '...')}
      headerTitle={'Modificar cuenta'}
      >
      <title> SG Barbershop - Modificar cuenta</title>

        {message?(
              <div className={warning.errorMessage}>
                  {message}
              </div>
        ): (
          <AccountForm account={account} onSubmit={submit}/>
        )}
    </Layout>
  )
}