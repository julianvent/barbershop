"use client";

import Header from "@/app/components/header/Header";
import styles from "./styles.module.css";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";


export default function AppointmentForm({onSubmit, id }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        nombre_cliente: "",
        numero_telefonico_cliente: "",
        duracion: "",
        estado: "pendiente",
        fecha: "",
        hora: ""
    });


  useEffect(() => {
    async function fetchCita() {
      if (id) {
        setFormData({});
            try {

                // const response = await fetch(`/api/citas/${id}`);
                // const cita = await response.json();

                const cita = {
                    id_cita: 1,
                    nombre_cliente: "Juan Pérez",
                    numero_telefonico_cliente: "9211234567",
                    fecha_hora_cita: "2025-10-20T15:30:00Z",
                    duracion_total: 60, 
                    estado: "pendiente", 
                };
               
                
                const fechaHora = cita.fecha_hora_cita || "";
                console.log(fechaHora.split("T")[0]);
                setFormData({
                    id: cita.id_cita,
                    nombre_cliente: cita.nombre_cliente || "",
                    numero_telefonico_cliente: cita.numero_telefonico_cliente || "",
                    fecha: fechaHora ? fechaHora.split("T")[0] : "",
                    hora: fechaHora ? fechaHora.split("T")[1].substring(0,5) : "",
                    duracion: cita.duracion_total || "",
                    estado: cita.estado || "pendiente",
                });
            } catch (error) {
                console.error("Error cargando la cita:", error);
            }
        
      }


    }

    fetchCita();
  }, [id]);



//   const barberos = [
//     {
//       name: 'Adrian Herrera Jeronimo',
//       id: 1
//     },
//     {
//       name: 'Kevin Sebastian Frias Garcia',
//       id: 2      
//     }
//   ];

//   const servicios = [
//     {
//       id: 1,
//       name: 'Yuyocut',
//       duration: 50,
//       price: 70.00
//     },
//     {
//       id: 2,
//       name: 'Corte de Barba',
//       duration: 30,
//       price: 65.00
//     },
//     {
//       id: 3,
//       name: 'Grecas',
//       duration: 40,
//       price: 30.00
//     },
//     {
//       id: 4,
//       name: 'Paquete entero 1',
//       duration: 50,
//       price: 70.00
//     }
//   ];


  return (
    <div style={{  backgroundColor: 'rgb(245, 245, 245)'}}>
      <Header></Header>
      <main >
        <div className={styles.formContainer}>
          <h1>{id ? "Modificar cita -" + formData.fecha + " " + formData.hora : "Agendar cita "}</h1>
          <form onSubmit={  (e) => { e.preventDefault(); onSubmit(formData)}}>
            
            <div className={styles.fieldsContainer}>
                <div className={styles.field}>
                  <label htmlFor="client_name">Nombre del Cliente:</label>
                  <input className={styles.formField} defaultValue={id ? formData.nombre_cliente : ''} 
                  onChange={e => setFormData({ ...formData, nombre_cliente: e.target.value })} type="text" name="client_name"/>
                </div>

                <div className={styles.field}>
                  <label htmlFor="client_tel">Telefono del cliente:</label>
                  <input className={styles.formField} defaultValue={id ? formData.numero_telefonico_cliente : ''} 
                  onChange={e => setFormData({ ...formData, numero_telefonico_cliente: e.target.value })} type="number" inputMode="tel" name="client_tel"/>
                </div>

                <div className={styles.field}>
                  <label htmlFor="appo_duration">Duracion Aproximada:</label>
                  <input className={styles.formField} defaultValue={id ? formData.duracion : ''} 
                  onChange={e => setFormData({ ...formData, duracion: e.target.value })} type="number" inputMode="numeric" name="appo_duration"/>
                </div>

                {/*  Correo cliente input
                <div className={styles.field}>
                  <label htmlFor="client">Correo del cliente:</label>
                  <input defaultValue={initialData ? initialData.client_email : ''} type="text" inputMode="email" name="client"/>
                </div> */}
              
            </div>
            
            <br />

            <div className={styles.fieldsContainer}>

                
                {/* Barberos input
                <div className={styles.field}>
                  <label htmlFor="barbers">Barberos Disponibles:</label>
                  <select className={styles.formField} defaultValue={initialData ? initialData.barber_id : ''} name="barbers" id="barbers">
                        <option value="">-- Selecciona un barbero --</option>
                        {
                            barberos.map((e) => (
                                <option key={e.id} value={e.id} >{e.name}</option>
                            ))
                        }
                  </select>
                </div> */}

                <div className={styles.field}>
                  <label htmlFor="status">Estado de la cita:</label>
                  <select className={styles.formField} onChange={e => setFormData({ ...formData, estado: e.target.value })}
                   defaultValue={id ? formData.estado : ''} name="status" id="status">
                        <option value="">Selecciona un valor valido</option>
                        <option value="pendiente">Pendiente </option>
                        <option value="confirmada">Confirmada</option>
                        <option value="cancelada">Cancelada</option>
                        <option value="completada">Completada</option>
                        
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="appo-date">Fecha de la cita:</label>
                  <input defaultValue={id ? formData.fecha : ''} type="date" className={styles.formField} 
                  onChange={e => setFormData({ ...formData, fecha: e.target.value })} name="appo-date"/>
                </div>

                <div className={styles.field}>
                  <label htmlFor="appo-hour">Hora de la cita:</label>
                  <input defaultValue={id ? formData.hora : ''} type="time"  className={styles.formField}
                  onChange={e => setFormData({ ...formData, hora: e.target.value })} name="appo-hour"/>
                </div>                
              
            </div>

            <br />

            {/* Servicios Input
            <div className={styles.fieldsContainer}>
              <div className={styles.field}>
                <label htmlFor="services">Servicios</label>
                <ul style={{ listStyleType: 'none'}}>
                  {
                    servicios.map((e) => (
                      <li key={e.id}>
                        <div className={styles.service}>
                          <input name={e.name} id={e.id} type="checkbox" defaultValue={initialData ? initialData.services_id : ''}></input>
                          <label htmlFor={e.name}>{e.name}</label>  
                          <br />                
                        </div>
                        <label>$ {e.price}</label>   
                                                 
                      </li>


                    ))
                  }
                </ul>
                  
                

              </div>
            </div>

            <br /> */}
            
            <div className={styles.fieldsConta}>
              <div className={styles.cornerButtons}>
                <button type="button" className={styles.cancelBoton} onClick={() => router.push('/dashboard/')} >Cancelar</button>
                <button type="submit">Confirmar</button>
              </div>
            </div>

          </form>
        </div>
        
      </main>
    </div>
  );
}
