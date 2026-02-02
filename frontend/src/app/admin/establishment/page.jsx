'use server';
import { isAdmin } from '@/app/utils/requestBuilder';
import IndexEstablishment from './client'
import Layout from '@/app/components/base_layout/Layout';

export default async function Page(){
  const isAdm = await isAdmin();
  return (
    <Layout isAdmin={isAdm}>
      <IndexEstablishment/>
      
    </Layout>
  )
}