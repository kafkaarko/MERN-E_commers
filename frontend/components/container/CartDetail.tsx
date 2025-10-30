"use client";
import { API } from "@/lib/axios";
import PriceClientOnly from "@/lib/ClientOnlyPrice";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const CartDetail = ({ cartP, token }: { cartP: any; token: any | null }) => {
  const [error, setError] = useState(null);
  const [selectId, setSelectId] = useState<string[]>([])

  

  const handleCheckboxChange = (cartId: string) =>{
    setSelectId((prev) =>
        prev.includes(cartId)
            ? prev.filter((id) => id !== cartId) //kalau sudah ada remove
            : [...prev, cartId] //kalo belum ada nambah
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-900">Cart</span>
            </li>
          </ol>
        </nav>

        {token ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">
                Keranjang Belanja
              </h1>
              <p className="text-sm text-gray-600">
                {cartP.length} pesanan dalam keranjang
              </p>
            </div>

            {/* Cart Items */}
            {cartP.length > 0 ? (
              <div className="space-y-6">
                {cartP.map((cart: any, idx: number) => (
                    <div
                    key={cart._id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                    >
                    {/* Cart Header */}
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          Keranjang #{idx + 1}
                        </h3>
                        <span className="text-lg font-semibold text-black">
                    <input type="checkbox" name="id" id="" value={cart._id} checked={selectId.includes(cart._id)} onChange={() => handleCheckboxChange(cart._id)} className="checkbox border-pink-600 bg-gray-500 checked:border-gray-200 checked:bg-gray-400 checked:text-gray-800 checkbox-xl " />
                          Rp <PriceClientOnly value={cart.grandTotal} />

                        </span>

                      </div>
                    </div>

                    {/* Cart Items */}
                    <div className="divide-y divide-gray-100">
                      {cart.items.map((item: any, i: number) => (
                        <div
                          key={i}
                          className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
                        >
                          <div className="flex-1">
                            <Image
                              src={item.productId.img_url}
                              alt={item.productId.name || "Product image"}
                              width={100}
                              height={100}
                              className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                              priority
                            />
                            <h4 className="text-sm font-medium text-gray-900">
                              {item.productId.name}
                            </h4>
                            <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                              <span>Qty: {item.quantity}</span>
                              <span>•</span>
                              <span>
                                Rp{" "}
                                <PriceClientOnly value={item.productId.price} />
                                /item
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">
                              Rp{" "}
                              <PriceClientOnly
                                value={item.productId.price * item.quantity}
                              />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cart Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex space-x-3 justify-end">
                        <button className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors duration-150">
                          Edit
                        </button>
                        <Link href={{ 
                          pathname:'/checkout',
                          query: {ids: JSON.stringify(selectId)}
                          }}  className="px-4 py-2 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors duration-150">
                          Checkout
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href={{ 
                          pathname:'/checkout',
                          query: {ids: JSON.stringify(selectId)}
                          }}  className="px-4 py-2 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors duration-150">
                          Checkout
                        </Link>
              </div>
            ) : (
              /* Empty Cart State */
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l-2.5 5m0 0h4m0 0a2 2 0 104 0m-4 0a2 2 0 104 0"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Keranjang Kosong
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Belum ada produk yang ditambahkan ke keranjang
                </p>
                <button className="px-6 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors duration-150">
                  Mulai Belanja
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Login Required State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Login Diperlukan
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Untuk melihat keranjang belanja, silakan login terlebih dahulu
              </p>

              <div className="space-y-3">
                <Link
                  href={"/login"}
                  className="btn w-full px-6 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors duration-150"
                >
                  Login
                </Link>
                <button className="w-full px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors duration-150">
                  Daftar Akun Baru
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CartDetail;
