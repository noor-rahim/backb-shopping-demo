import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import LogoAndCart from "~/components/LogoAndCart";
import AllProduct from "~/components/Product";
import backArrow from "../../public/assets/arrow-left-solid.svg"
import { getProduct } from "~/models/product.server";
import { getCartItemsCount } from "~/models/cart.server";

export const loader: LoaderFunction = async ({params}) => {
    const categoryName = (params['categoryName'] ?? "");
    const cartItemsCount = await getCartItemsCount();
    const categoryProducts = categoryName
    ? await getProduct({categoryName})
    : [];
    
    return {products: categoryProducts, categoryName, cartItemsCount}
}

function CategoryProducts() {
   const  loaderData = useLoaderData();
   
    return (
        <div className="max-w-screen-md lg:max-w-screen-lg mx-auto  ">
            <LogoAndCart cartItemsCount={loaderData.cartItemsCount} />
            <Link to={'../'}>
                    <div className="flex flex-row my-5  border-b border-slate-300 pb-4">
                        <img className="h-5 w-5  mt-1" src={backArrow} />
                        <p className="ml-4 text-xl font-bold text-gray-900"> {loaderData.categoryName} </p>
                    </div>
                </Link>
            
            <AllProduct products={loaderData.products} />
        </div>

    )
}

export default CategoryProducts;