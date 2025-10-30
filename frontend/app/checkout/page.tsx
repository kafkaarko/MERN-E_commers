import CheckoutDetail from '@/components/container/CheckoutDetail';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import React from 'react'

type Token = {
  _id: string;
  role: string;
  name: string;
  email: string;
};

const CheckoutPage = async() => {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value || null;
      let user: Token | null = null;
      if (token) {
        user = jwtDecode<Token>(token);
      }

  return <CheckoutDetail token={token} />
}

export default CheckoutPage
