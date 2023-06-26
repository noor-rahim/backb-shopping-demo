import { useEffect, useState } from "react"
import backArrow from "../../public/assets/arrow-left-solid.svg"
import { Link } from '@remix-run/react'
import LogoAndCart from "~/components/LogoAndCart";
import cart from "~/store/cart";
import products from "~/store/products";

const getProductById = (id) => {
   return products.find(v => v.id === id);
}

export const transformCartItemsToProductz = () => {
    const productz = cart.getAll().map((cartItem) => {
        const product = getProductById(cartItem.productId);
        if(!product) return;
        return {
            ...product,
            totalPrice: product?.price * cartItem.quantity,
            quantity: cartItem.quantity,
        };
    }).filter(v => v);
    
    return productz;
    
}

export default function Dashboard() {
    const [productz, setProductz] = useState([]);

    useEffect(() => {
        setProductz(transformCartItemsToProductz())
    }, [])

    const handleRemoveFromCart = (id: string) => {
        const cartItems = cart.remove({productId: id});
        const updatedProducts = transformCartItemsToProductz();
        setProductz(updatedProducts);
    }


    const handleAddItem = (id: string) => {
        const cartItems = cart.incrementQuantity({productId: id});
        const updatedProducts = transformCartItemsToProductz();
        setProductz(updatedProducts);
    };

    const handleRemoveItem = (id: string) => {
       const cartItems = cart.decrementQuantity({productId: id});
        const updatedProducts = transformCartItemsToProductz();
        setProductz(updatedProducts);
    };

    const totalPrice = productz.reduce((total, product) => {
        return total + product.totalPrice;
      }, 0);
    
   

    return (
        <div className="flex-1 flex h-full w-full mx-auto min-h-screen max-w-screen-md flex-col overflow-y-scroll bg-white">
            <LogoAndCart />
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <Link to={'../'}>
                    <div className="flex flex-row my-4 border-b border-slate-300 pb-4">
                        <img className="h-5 w-5  mt-1" src={backArrow} />
                        <p className="ml-4 text-lg font-medium text-gray-900">  Back to Home </p>
                    </div>
                </Link>
                <div className="flex items-center justify-center mb-5">
                <h1 className="font-pathway-extreme text-xl font-bold">{(productz.length !== 0) ? "Your Items": "No items"}</h1>
                </div>
                <div className="mt-8">
                    <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {productz.map((product) => (
                                <li key={product.id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <img
                                            src={product.images[0].src}
                                            alt={product.images[0].alt}
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
                                        <div className="flex flex-1 items-end justify-between text-sm">

                                            <div className="flex ">

                                                <button
                                                    className="bg-indigo-600 h-full w-full hover:bg-indigo-700 px-2 text-white py-1 font-bold  rounded"
                                                    onClick={() => handleRemoveItem(product.id)}
                                                >
                                                    -
                                                </button>
                                                <span className="bg-indigo-100 text-center px-4 font-bold h-full w-full py-1 ">{product.quantity}</span>
                                                <button
                                                    className="bg-indigo-500 h-full w-full py-1 hover:bg-indigo-700 px-2 text-white font-bold  rounded"
                                                    onClick={() => handleAddItem(product.id)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="flex">
                                                <button
                                                    type="button"
                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                    onClick={() => handleRemoveFromCart(product.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
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

