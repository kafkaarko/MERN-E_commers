
import ProductDetail from "@/components/container/ProductDetail";
import { cookies } from "next/headers";

interface productPageProps {
  params: { id: string };
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

const ProductPage = async ({ params }: productPageProps) => {
  const { id } = await params
  const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value || null;


  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BE}product/${id}`,
    {
      cache: "no-store",
    }
  );
  const json = await res.json();
  const product: PRODUCT = json.data;
  return <ProductDetail product={product} token={token} />;
};

export default ProductPage;
