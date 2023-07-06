import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { transformCartItemsToProductz } from "~/routes/cart";
import cart from "~/store/cart";


interface ProductT {
    id: string;
    image: string;
    alt: string;
    name: string;
    nature: string;
    price: number;
    quantity: number;
}



function Product(props: ProductT) {
    const [count, setCount] = useState(props.quantity);

    const handleAddToCart = () => {
        const updatedProduct = cart.incrementQuantity({ productId: props.id })
        setCount(updatedProduct.quantity);
    };

    const handleRemoveFromCart = () => {
        const updatedProduct = cart.decrementQuantity({ productId: props.id })
        setCount(updatedProduct.quantity);
    };

    return (
        <div className=" w-full rounded-md bg-white ">
            <Link to={`../productoverview/${props.id}`}>
                <div className="mb-4 border border-slate-500 rounded-lg h-60 w-full">
                    <img
                        className=" h-60 w-full object-cover object-center rounded-lg hover:opacity-75"
                        src={props.image}
                        alt={props.alt} >
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

            <div className="px-auto mt-2">
                {count === 0 ? (
                    <button
                        className="bg-gray-500 w-full h-full hover:bg-gray-700 text-white py-1 font-bold  rounded"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                ) : (
                    <div className="flex items-center ">
                        <button
                            className="bg-gray-500 h-full w-full hover:bg-gray-700 text-white py-1 font-bold  rounded"
                            onClick={handleRemoveFromCart}
                        >
                            -
                        </button>
                        <span className="bg-gray-200 text-center px-6 font-bold h-full w-full py-1 ">{count}</span>
                        <button
                            className="bg-gray-500 h-full w-full py-1 hover:bg-gray-700 text-white font-bold  rounded"
                            onClick={handleAddToCart}
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface PropsT {
    products: ProductT[];
}


export default function AllProduct(props: PropsT) {
    const [products, setProducts] = useState<any>([])
 
    useEffect(() => {
        const productsInCart = transformCartItemsToProductz();
        
        const products = props.products.map(p => {
            const product = productsInCart.find(v => p.id === v.id)
            if (product) return product
            return ({ ...p, quantity: 0 })
        })
        setProducts(products);
    }, [props.products])

    return (
        <div className=" sm:mx-auto mx-5 mt-2 grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 grid-cols-2 gap-6   ">
            {products.map((product:any) => {
                return <Product
                    key={product.id}
                    id={product.id}
                    image={product.images[0].src}
                    alt ={product.images[0].alt}
                    name={product.name}
                    price={product.price}
                    nature={product.nature}
                    quantity={product.quantity}
                />

            })}

        </div>
    )
}