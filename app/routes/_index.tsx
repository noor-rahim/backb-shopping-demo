import type { V2_MetaFunction } from "@remix-run/node";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Categories from "~/components/Categories";
import LogoAndCart from "~/components/LogoAndCart";
import AllProduct from "~/components/Product";
import { getCategories } from "~/models/category.server";
import { getProduct } from "~/models/product.server";
import { getCartItemsCount } from "~/models/cart.server";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];
export const loader: LoaderFunction = async () => {

  const categories = await getCategories({});
  const products = await getProduct({});
  const cartItemsCount = await getCartItemsCount();

  return { callouts: categories, products: products, cartItemsCount };
}


export default function Index() {
  const loaderData = useLoaderData();
  return (
    <main className="flex flex-col relative mb-5 min-h-screen bg-white flex ">
      <div className="flex flex-col relative mb-10 min-h-screen bg-white flex ">
        <LogoAndCart cartItemsCount={loaderData.cartItemsCount} />
        <div className=" w-full mx-auto bg-[#585858] ">
          <div className=" mx-auto my-10 max-w-screen-md lg:max-w-screen-lg overflow-hidden rounded-lg h-60 bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 ">
            <img src="https://tailwindui.com/img/ecommerce-images/home-page-02-edition-01.jpg" alt="Desk "
              className="h-full w-full object-cover object-center" />
          </div>
        </div>

        <Categories callouts={loaderData.callouts} />
        <div className="max-w-screen-md lg:max-w-screen-lg mx-auto ">
          <p className="font-pathway-extreme text-3xl mb-10 font-bold " >Trending Products</p>
          <AllProduct products={loaderData.products} />
        </div>

      </div>
    </main>

  );
}
