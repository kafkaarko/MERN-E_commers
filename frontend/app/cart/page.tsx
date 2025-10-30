import CartDetail from "@/components/container/CartDetail";
import { API } from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import React from "react";

type Token = {
  _id: string;
  role: string;
  name: string;
  email: string;
};

type Cart = {
    userId: string;
    _id: string
    items:{
        productId: PRODUCT;
        quantity: number
    }[]
    grandTotal: number
}


type Store = {
  _id: string;
  name: string;
};

type Category = {
  _id: string;
  name: string;
};

type PRODUCT = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  img_url: string;
  storeId: Store;
};
const Cart = async () => {
    //buat ambil token
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;
  let user: Token | null = null;
  if (token) {
    user = jwtDecode<Token>(token);
  }

    const res = await fetch( `${process.env.NEXT_PUBLIC_API_BE}cart`,{method: "get",credentials:"include",headers:{Cookie:`token=${token}`}, cache: "no-store"},)
    const json = await res.json()
    const cart: Cart[] = json.data


  return <CartDetail cartP={cart} token={token} />
};

export default Cart;
