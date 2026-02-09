'use client';
import Layout from "@/app/components/base_layout/Layout"
import React, { useEffect, useState } from "react"
import styles from "../../../forms/EmployeeFormStyles.module.css";
import layout from "../../Main.module.css";
import show from "./styles.module.css";
import { Status } from "@/app/components/form/status/Status";
import Buttons from "@/app/components/form/model_buttons/Buttons";
import { getEmployee } from "@/app/apiHandlers/adminStaff";
export default function EmployeeDetail({params}){
    const {id} = React.use(params);
    const [employee, setEmployee] = useState(null);
    const [message, setMessage] = useState(null);
    useEffect(() => {
            async function load() {
                try{
                    const data = await getEmployee(id);
                    setEmployee(data);

                }catch(err){
                    setMessage(err);
                }
            }
            load();
    }, [id]);

    return (
        <EmployeeDetail params={params} isAdmin={isAdm}/>
    )
}