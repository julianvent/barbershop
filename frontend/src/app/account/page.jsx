import Layout from "../components/base_layout/Layout";
import { isAdmin } from "../utils/requestBuilder"
import Account from "./client";


export default async function Page(){
    const isAdm = await isAdmin();

    return (
        <Layout headerTitle="Detalles de Cuenta" isAdmin={isAdm}>
            <Account/>
        </Layout>
    )
}