'use client';
import { getEstablishment } from "@/app/apiHandlers/adminEstablishments";
import Layout from "@/app/components/base_layout/Layout";
import React, { useEffect, useState } from "react";
import warning from '@/app/forms/styles.module.css'

export default function Establishment({params}){
  const {id} = React.use(params)
  const [err, setErr] = useState(null);
  const [establishment, setEstablishment] = useState(null);

  useEffect(() =>{
    const load = async () => {
      try {
        const location = await getEstablishment({id});
        setEstablishment(location)
      } catch (error) {
        setErr(error)
      }

    }

    load()
  }, [])
  return (
    <Layout
      headerTitle='Ver Establecimiento'>
        {err&&(
              <div className={warning.errorMessage}>
                  {err}
              </div>
        )}
    </Layout>
  )
}