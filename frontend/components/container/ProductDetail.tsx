"use client";
import Image from "next/image";
import Link from "next/link";
import {  useEffect, useState } from "react";
import Modal from "../modal";
import { API } from "@/lib/axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";

const ProductDetail = ({
  product,
  token,
}: {
  product: any;
  token: any | null;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formatted, setFormatted] = useState<string>("")

  const ClientOnlyPrice = dynamic(() => import("../../lib/ClientOnlyPrice"), { ssr: false });

  useEffect(() =>{
    if(qty > 0) setFormatted((product.price * qty).toLocaleString("id-ID"))
  }, [product.price, qty])

  const decrement = () => {
    if (qty > 1) {
      setQty(qty - 1);
    } else {
      alert("⚠ Minimal belanja 1");
    }
  };

  const increment = () => {
    setQty(qty + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // izinkan kosong (""), tapi convert ke angka kalau ada isinya
    if (value === "") {
      setQty(0); // sementara kosong
    } else {
      const parsed = Number(value);
      if (!isNaN(parsed)) {
        setQty(parsed);
      }
    }
  };

  const router = useRouter()
  const HandleToCart = async () => {
    setLoading(true);
    
    if(!token){
      router.push('/login')
      return
    }

    try {
      const res = await API.post(
        "cart",
        {
          items: [
            {
              productId: product._id,
              quantity: qty,
            },
          ],
        },
        {
          withCredentials: true,
          headers: {"Content-Type": "application/json",}

        }
      );
      console.log(res.data.data);
    } catch (error: any) {
      setError(error.message)
      if (axios.isAxiosError(error)) {
    setError(error.response?.data?.message || error.message);
  } else {
    setError("Unexpected error");
  }
    }
  };


  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-gray-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-600 transition-colors"
                >
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
                <span className="text-gray-900">Detail Produk</span>
              </li>
            </ol>
          </nav>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden group">
                  <Image
                    src={product.img_url || "/vercel.svg"}
                    alt={product.name || "Product image"}
                    width={600}
                    height={600}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />

                  {/* Stock Status Overlay */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        Stok Terbatas
                      </span>
                    </div>
                  )}

                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg">
                        Stok Habis
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Product Title */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                </div>

                {/* Price */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-blue-600">
                          <ClientOnlyPrice  value={product.price} />
                    </span>
                    {/* Original price if on discount */}
                  </div>
                </div>

                {/* Stock Info */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <span className="text-gray-600">Stok:</span>
                    <span
                      className={`font-semibold ${
                        product.stock > 10
                          ? "text-green-600"
                          : product.stock > 0
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} tersedia`
                        : "Habis"}
                    </span>
                  </div>
                </div>

                {/* Category */}
                <span className="text-gray-600">Kategori: </span>
                <span className="text-gray-600">
                  {product.category.name || "tidak ada category produk"}
                </span>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Deskripsi Produk
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Toko</h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {product.storeId?.name || "tidak ada store"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* buySection */}

            <div className="mt-8  bg-white rounded-xl shadow-sm p-6">
              <form action="" onSubmit={HandleToCart}>
                <div className="w-full flex items-center mb-4">
                  <button
                    type="button"
                    onClick={decrement}
                    className="px-3 py-1 bg-gray-300 rounded"
                    suppressHydrationWarning
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min={1}
                    value={qty}  // Pastikan nilai konsisten antara SSR dan CSR
                    onChange={handleChange}
                    className="w-16 border p-2 text-center"
                    suppressHydrationWarning

                  />

                  <button
                    type="button"
                    onClick={increment}
                    className="px-3 py-1 bg-gray-300 rounded"
                    suppressHydrationWarning

                  >
                    +
                  </button>
                  <span className="ml-4">
                    Jumlah: Rp{" "}
                    {qty < 1
                      ? "Minimal belajaan 1 !"
                      :   <ClientOnlyPrice value={product.price * qty}/>}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className={`flex-1 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                      product.stock > 0
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={product.stock === 0}
                    onClick={() => setIsOpen(true)}
                    type="button"
                    suppressHydrationWarning

                  >
                    {product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
                  </button>

                  <button
                    className={`flex-1 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 border-2 ${
                      product.stock > 0
                        ? "border-blue-600 text-blue-600 hover:bg-blue-50"
                        : "border-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={product.stock === 0}
                    suppressHydrationWarning

                  >
                    Beli Sekarang
                  </button>
                </div>
                {/* Action Buttons */}
                <div className="space-y-4  p-6">
                  <div className="flex justify-center  space-x-6 pt-4">
                    
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors" suppressHydrationWarning >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span>Wishlist</span>
                    </button>

                    <button suppressHydrationWarning className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                      <span>Bagikan</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>


          {/* Additional Product Info */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Garansi Produk</p>
                  <p className="text-sm text-gray-600">
                    Jaminan kualitas terbaik
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Pengiriman Cepat
                  </p>
                  <p className="text-sm text-gray-600">
                    Gratis ongkir minimal pembelian
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Pembayaran Aman</p>
                  <p className="text-sm text-gray-600">
                    Berbagai metode pembayaran
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <div className="max-w-md mx-auto bg-white">
    {/* Header */}
    <div className="px-6 pt-6 pb-4 border-b border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900">
        Konfirmasi Pesanan
      </h2>
    </div>

    {/* Content */}
    <div className="p-6 space-y-6">
      {/* Product Card */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={product.img_url || "/vercel.svg"}
              alt={product.name || "Product image"}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs text-gray-500">Qty: {qty}</span>
            <span className="text-sm font-medium text-gray-900">
              <ClientOnlyPrice value={product.price} />
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Order Summary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">
            <ClientOnlyPrice value={product.price * qty} />
          </span>
        </div>
        
        <div className="flex items-center justify-between text-base font-semibold">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">
            <ClientOnlyPrice value={product.price * qty} />
          </span>
        </div>
      </div>
    </div>

    {/* Footer Actions */}
    <div className="px-6 pb-6">
      <div className="flex space-x-3">
        <button
          onClick={() => setIsOpen(false)}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          suppressHydrationWarning
        >
          Batal
        </button>
        
        <button
          onClick={HandleToCart}
          suppressHydrationWarning
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          Konfirmasi
        </button>
      </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  </div>
</Modal>

    </>
  );
};

export default ProductDetail;
