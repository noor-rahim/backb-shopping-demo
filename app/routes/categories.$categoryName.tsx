import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import LogoAndCart from "~/components/LogoAndCart";
import AllProduct from "~/components/Product";
import products from "~/store/products";
import backArrow from "../../public/assets/arrow-left-solid.svg"

export const loader: LoaderFunction = ({params}) => {
    const categoryName = (params['categoryName'] ?? "");

    const selectedProducts = categoryName
    ? products.filter(p => {
        return p.calloutName === categoryName  
    })
    : []
    return {products: selectedProducts}
}

function CategoryProducts() {
   const  loaderData = useLoaderData();

    return (
        <div className="max-w-screen-md lg:max-w-screen-lg mx-auto  ">
            <LogoAndCart />
            <Link to={'../'}>
                    <div className="flex flex-row my-5  border-b border-slate-300 pb-4">
                        <img className="h-5 w-5  mt-1" src={backArrow} />
                        <p className="ml-4 text-xl font-bold text-gray-900"> {loaderData.products[1].calloutName} </p>
                    </div>
                </Link>
            
            <AllProduct products={loaderData.products} />
        </div>

    )
}

export default CategoryProducts;