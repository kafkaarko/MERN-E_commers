"use client"
import { API } from '@/lib/axios'
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

const CheckoutDetail = ({token  }:{token: any, }) => {
          const searchParams = useSearchParams();
      const ids = searchParams.get('ids');
      const selectId: string[] = ids ? JSON.parse(ids) : [];

      const searchItemById = async(selectId: string) => {
        const res =  await fetch(
    `${process.env.NEXT_PUBLIC_API_BE}items?ids=${encodeURIComponent(JSON.stringify(selectId))}`,
    {
      cache: "no-store",
    }
    );
    const json = await res.json();
    console.log(json.data)
    const data = json.data;
    console.log(data)
      }
      const [formCheckout, setFormCheckout] = useState({
    method: "",
    shippingAddress:{
        street:"",
        city:"",
        postalOcde:"",
        country: ""
    },
    checkoutCart: selectId
  })

  const Checkout = async() =>{
    try {
        const res = await API.post(`cart/checkout`, formCheckout)
        console.log(res.data)
    } catch (error) {
        
    }
  }
  return (
    <div>
      {token ? (
        <div className="">kamu telah login sekarang di chekout {selectId}</div>
      )
    :
    (
        <div className="">login dlu wok</div>
    )
    }
    </div>
  )
}

export default CheckoutDetail
