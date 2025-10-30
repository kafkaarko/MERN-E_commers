"use client";
import { API } from "@/lib/axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type PRODUCT = {
  _id: string
  name: string;
  description: string;
  price: number;
  stock: number;
  category: number;
  img_url: string;
  storeId: number;
};

type CATEGORY = {
  name: string;
  description: string;
}

export default function Home() {
  const [products, setProduct] = useState<PRODUCT[]>([]);
  const [category, setCategory] = useState<CATEGORY[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [visibleCategories, setVisibleCategories] = useState(10);

  useEffect(() => {
    API.get(`/product`)
      .then((res) => {
        setProduct(res.data.data);
      })
      .catch((error) => {
        setError(error.message || "Something wrong, please try again");
      });

      API.get(`/category`)
        .then((res) => {
          setCategory(res.data.data)
        })
        .catch((error) =>{
        setError(error.message || "Something wrong, please try again");
        })
  }, []);

  const handleLoadMoreCategories = () => {
    setVisibleCategories((prev) => prev + 10);
  };

  return (
    <div className="font-sans min-h-screen p-8 sm:p-20 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900">{usePathname()}</span>
            </li>
          </ol>
        </nav>

      {/* hero section */}
      <div className="hero">
        <Image
          src="/store.jpg"
          alt="hero section"
          width={200}
          height={200}
          className="w-full h-100 object-cover rounded"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <p className="mb-5">
              belajaain adalah sebuah platform e-commerce yang menyediakan
              berbagai produk digital berkualitas tinggi. Kami berkomitmen untuk
              memberikan pengalaman berbelanja yang mudah, aman, dan
              menyenangkan bagi pelanggan kami.
            </p>
            <button className="btn btn-primary">ayo mulai</button>
          </div>
        </div>
      </div>

    {/* category section  */}
    <div className="w-full h-full mt-10 text-black ">
        <h2 className="text-2xl font-bold my-6">Kategori Pilihan</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {category?.slice(0, visibleCategories).map((cat, index) => (
          <div
            key={index}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 text-center flex justify-center "
          >
            <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
              {cat.name}
            </p>
          </div>
        ))}

        {visibleCategories < category.length && (
          <div className="text-center mt-4">
            <button
              onClick={handleLoadMoreCategories}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
    </div>

      {/* Products Section - Tokopedia Style */}
      <div className="w-full h-full">
        <h2 className="text-2xl font-bold my-6">Produk Terbaru Hanya Untuk Mu !</h2>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-center font-medium text-sm">
            {error}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
        {products?.map((product, index) => (
        <Link
          href={`/produk/${product._id}`}
            key={index}
            className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <div className="relative overflow-hidden">
              <Image
                src={
                  product.img_url ||
                  `https://picsum.photos/300/300?random=${index}`
                }
                alt={product.name || "Product image"}
                width={300}
                height={300}
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli2kjRFT4z6PzCjLlctAAAA"
              />

              {/* Stock Badges */}
              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute top-1 right-1">
                  <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                    Sisa {product.stock}
                  </span>
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Habis
                  </span>
                </div>
              )}
            </div>

            <div className="p-2">
              {/* Product Name - Limited to 2 lines */}
              <h3 className="text-sm font-normal text-gray-800 mb-1 line-clamp-2 leading-tight h-10">
                {product.name}
              </h3>

              {/* Price */}
              <div className="mb-2">
                <p className="text-base font-bold text-gray-900">
                  Rp{Number(product.price).toLocaleString("id-ID")}
                </p>
              </div>

              {/* Rating & Sold (if available) */}
              {/* <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-yellow-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div> */}
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button (Tokopedia style) */}
      {products && products.length > 0 && (
        <div className="text-center mt-6">
          <button className="bg-white border border-pink-700 text-pink-700 px-8 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
            Lihat Lainnya
          </button>
        </div>
      )}

      {/* Empty State */}
      {!error && (!products || products.length === 0) && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-3">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <p className="text-gray-500">Produk tidak ditemukan</p>
        </div>
      )}
    </div>
    </div>
    </div>
  );
}
