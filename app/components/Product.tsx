import {  Link, useFetcher } from "@remix-run/react";

interface ProductT {
    id: string;
    images: ImagesT;
    alt: string;
    name: string;
    nature: string;
    price: number;
    quantity: number;
}

interface ImagesT {
    src: string;
    alt: string;
}


function Product(props: ProductT) {
    const count = props.quantity;
    const fetcher = useFetcher();

    return (
        <div className=" w-full rounded-md bg-white mx-auto">
            <Link to={`../productoverview/${props.id}`}>
                <div className="mb-4 border border-slate-500 rounded-lg h-60 sm:h-80 ">
                    <img
                        className=" h-full w-full object-cover object-center rounded-lg hover:opacity-75"
                        src={props.images.src}
                        alt={props.images.alt} >
                    </img>
                </div>
                <div className="h-40 w-full flex flex-1 flex-col justify-between">
                    <div className="">
                        <p className="text-xl font-semibold">{props.name}</p>
                        <p className="text-gray-700 mt-2"
                        >{props.nature}</p>
                    </div>
                    <span className="text-gray-900 text-lg font-bold my-2">${props.price}</span>
                </div>
            </Link>

            <fetcher.Form method="post" action="/cart" className="px-auto mt-2">
                <input type="hidden" name="product-id" value={props.id} ></input>
                {count === 0 ? (
                    <button
                        name="button-action"
                        value="increment"
                        type="submit"
                        className="bg-gray-500 w-full h-full hover:bg-gray-700 text-white py-1 font-bold  rounded"
                    >
                        Add to Cart
                    </button>
                ) : (
                    <div className="flex items-center ">
                        <button
                            name="button-action"
                            value="decrement"
                            type="submit"
                            className="bg-gray-500 h-full w-full hover:bg-gray-700 text-white py-1 font-bold  rounded"
                        >
                            -
                        </button>
                        <span className="bg-gray-200 text-center px-6 font-bold h-full w-full py-1 ">{count}</span>
                        <button
                            name="button-action"
                            value="increment"
                            type="submit"
                            className="bg-gray-500 h-full w-full py-1 hover:bg-gray-700 text-white font-bold  rounded"
                        >
                            +
                        </button>
                    </div>
                )}
            </fetcher.Form>
        </div>
    );
}

interface PropsT {
    products: (ProductT & {
        cart: {quantity: number} | null;
    })[];
}


export default function AllProduct(props: PropsT) {

    return (
        <div className=" mx-auto mt-2 grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 grid-cols-2 gap-6   ">
            {props.products.map((product) => {
                return <Product
                    key={product.id}
                    id={product.id}
                    images={product.images[0] ?? []}
                    name={product.name}
                    price={product.price}
                    nature={product.nature}
                    quantity={(product.cart !== null) ? (product.cart.quantity ?? 0) : 0}
                />

            })}

        </div>
    )
}