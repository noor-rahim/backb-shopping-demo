import backArrow from "../../public/assets/arrow-left-solid.svg"
import { Form, Link, useLoaderData } from '@remix-run/react'
import LogoAndCart from "~/components/LogoAndCart";
import { ActionArgs, LoaderArgs } from "@remix-run/node";
import { decrementCartItemQuantity, deleteItemFromCart, getCartItems, getCartItemsCount, incrementCartItemQuantity } from "~/models/cart.server";
import { getCategories } from "~/models/category.server";


export const action = async ({request}: ActionArgs) => {
    const formData = await request.formData();
    const actionType = formData.get("button-action");
    const productIdRaw = formData.get("product-id");
    if (typeof productIdRaw !== 'string')
        return {error: {message: 'product-id should be a string'}};
    const productId = parseInt(productIdRaw); 

    if (!Number.isInteger(productId)) 
        return {error: {message: "Product id should be a valid integer number"}};


    if (actionType === 'increment') {
        const v = await incrementCartItemQuantity({productId})
        return {v, productId, actionType};
    }

    if(actionType === "decrement") {
        const v = await decrementCartItemQuantity({productId});
        return {v, productId, actionType};
    }

    if(actionType === "delete") {
        const v = await deleteItemFromCart({productId});
        return {v, productId, actionType};
    }

    return {error: {message: "button-action should be one of increment or decrement or delete"}}
}

export const loader = async ({}: LoaderArgs) => {
    const cartItemsRaw = await getCartItems({});
    const cartItemsCount = await getCartItemsCount();
    const cartItems =  cartItemsRaw.map((ci) => {
        const totalPrice = 
            ci.product ? ci.quantity * ci.product?.price : 0;
        return {...ci, product: {...ci.product, totalPrice}}
    } )

    
    return {cartItems, cartItemsCount};
}


export default function Cart() {
    const loaderData = useLoaderData();
    const cartItems = loaderData.cartItems;
    console.log(cartItems)
    const cartItemsCount = loaderData.cartItemsCount;

    const totalPrice = cartItems.reduce((total, {product}) => {
        return total + product.totalPrice;
      }, 0);
    

    return (
        <div className="flex-1 flex h-full w-full mx-auto min-h-screen max-w-screen-md flex-col overflow-y-scroll bg-white">
            <LogoAndCart cartItemsCount={cartItemsCount}/>
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <Link to={'../'}>
                    <div className="flex flex-row my-4 border-b border-slate-300 pb-4">
                        <img className="h-5 w-5  mt-1" src={backArrow} />
                        <p className="ml-4 text-lg font-medium text-gray-900">  Back to Home </p>
                    </div>
                </Link>
                <div className="flex items-center justify-center mb-5">
                <h1 className="font-pathway-extreme text-xl font-bold">{(cartItems.length !== 0) ? "Your Items": "No items"}</h1>
                </div>
                <div className="mt-8">
                    <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {cartItems.map(({quantity, product}) => (
                                <li key={product.id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <img
                                            src={product.images[0]?.src ?? ""}
                                            alt={product.images[0]?.alt ?? ""}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3>
                                                    <a href={product.href}>{product.name}</a>
                                                </h3>
                                                <p className="ml-4">${product.totalPrice}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                        </div>
                                        <Form method="post" className="flex flex-1 items-end justify-between text-sm">
                                            <input type="hidden" name="product-id" value={product.id} ></input>
                                            <div className="flex ">
                                                <button
                                                    name="button-action"
                                                    value="decrement"
                                                    type="submit"
                                                    className="bg-indigo-600 h-full w-full hover:bg-indigo-700 px-2 text-white py-1 font-bold  rounded"
                                                >
                                                    -
                                                </button>
                                                <span className="bg-indigo-100 text-center px-4 font-bold h-full w-full py-1 ">
                                                    {quantity}
                                                </span>
                                                <button
                                                    name="button-action"
                                                    value="increment"
                                                    type="submit"
                                                    className="bg-indigo-500 h-full w-full py-1 hover:bg-indigo-700 px-2 text-white font-bold  rounded"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="flex">
                                                <button
                                                    name="button-action"
                                                    value="delete"
                                                    type="submit"
                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </Form>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${totalPrice}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                    <a
                        href="#"
                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                        Checkout
                    </a>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p className="" >
                        or
                    </p>
                    <Link to={"../"}>
                        <button
                            type="button"
                            className="ml-2 font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                        </button>
                    </Link>

                </div>
            </div>
        </div>

    )
}

