import { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getCategories } from "~/models/category.server";
import { deleteProduct, getProduct } from "~/models/product.server";
import backIcon from "../../public/assets/arrow-left-solid.svg";

export const loader = async ({  }: LoaderArgs) => {
    const allProducts = await getProduct({});
    const categories = await getCategories({});
    return {  allProducts, categories };

}

export const action = async ({ request }: ActionArgs) => {
    const formData = await request.formData();
    const id = Number.parseInt(formData.get("product-id"));

    const delProduct = await deleteProduct({ id });
    return { delProduct };
}

export default function ProductsRoute() {

    const loaderData = useLoaderData();
    const [sortOrder, setSortOrder] = useState(null);
    const products = loaderData.allProducts;


    const handleSort = (field) => {
        if (sortOrder === field) {
            setSortOrder(`${field}-desc`);
        } else {
            setSortOrder(field);
        }
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === 'categoryName') {
            return a.category.name.localeCompare(b.category.name);
        } else if (sortOrder === 'categoryName-desc') {
            return b.category.name.localeCompare(a.category.name);
        } else if (sortOrder === 'productName') {
            return a.name.localeCompare(b.name);
        } else if (sortOrder === 'productName-desc') {
            return b.name.localeCompare(a.name);
        } else if (sortOrder === 'productId') {
            return a.id - b.id;
        } else if (sortOrder === 'productId-desc') {
            return b.id - a.id;
        } else {
            return 0;
        }
    });


    return (
        <div className="bg-gray-100 p-4 flex flex-col">
            <Link to="../dashboard" className="mb-5">
                <div className="flex items-center text-gray-700 hover:text-gray-900">
                    <img className="h-5 w-5 mr-3" src={backIcon} alt="Back Icon" />
                    <p className="text-lg font-bold">Back to Dashboard</p>
                </div>
            </Link>
            <div className="flex items-center justify-between my-5">
                <h1 className="text-4xl font-bold">All Products</h1>
                <Link to="../dashboard/product">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        +
                    </button>
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="py-3 px-6 bg-gray-200 text-left cursor-pointer uppercase">
                                <div onClick={() => handleSort('categoryName')} className="flex items-center">
                                    Category Name
                                    {sortOrder === 'categoryName' ? (
                                        <span className="ml-1">&#9650;</span>
                                    ) : (
                                        sortOrder === 'categoryName-desc' && <span className="ml-1">&#9660;</span>
                                    )}
                                </div>
                            </th>
                            <th className="py-3 px-6 bg-gray-200 text-left cursor-pointer uppercase">
                                <div onClick={() => handleSort('productName')} className="flex items-center">
                                    Product Name
                                    {sortOrder === 'productName' ? (
                                        <span className="ml-1">&#9650;</span>
                                    ) : (
                                        sortOrder === 'productName-desc' && <span className="ml-1">&#9660;</span>
                                    )}
                                </div>
                            </th>
                            <th className="py-3 px-6 bg-gray-200 text-left cursor-pointer uppercase">
                                <div onClick={() => handleSort('productId')} className="flex items-center">
                                    Product ID
                                    {sortOrder === 'productId' ? (
                                        <span className="ml-1">&#9650;</span>
                                    ) : (
                                        sortOrder === 'productId-desc' && <span className="ml-1">&#9660;</span>
                                    )}
                                </div>
                            </th>
                            <th className="py-3 px-6 bg-gray-200"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedProducts.map((product) => (
                            <tr key={product.id} className="border-b border-gray-300">
                                <td className="py-4 px-6">{product.category.name}</td>
                                <td className="py-4 px-6">{product.name}</td>
                                <td className="py-4 px-6">{product.id}</td>
                                <td className="py-4 px-6 flex items-center">
                                    <Link to={`../dashboard/product?pid=${product.id}`}>
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                                            Edit
                                        </button>
                                    </Link>
                                    <Form method="post">
                                        <input type="hidden" name="product-id" value={product.id} />
                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                            Delete
                                        </button>
                                    </Form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Link to="../dashboard/product" className="flex items-center justify-center mt-10">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add Product
                </button>
            </Link>
        </div>

    );
}

