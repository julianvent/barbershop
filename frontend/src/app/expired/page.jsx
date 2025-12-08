'use client';
import Layout from "../components/base_layout/Layout";
import ExpiredModal from "../components/modals/ExpiredModal";

export default function expired(){

  return (
    <Layout>
        <title>SG BarberShop</title>
        <ExpiredModal/>
    </Layout>
  );
}