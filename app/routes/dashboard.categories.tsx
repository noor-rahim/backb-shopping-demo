import { Form, Link, useLoaderData } from "@remix-run/react";
import backIcon from "../../public/assets/arrow-left-solid.svg";
import { useState } from "react";
import { deleteCategory, getCategories } from "~/models/category.server";
import { ActionArgs, LoaderArgs } from "@remix-run/node";


export const loader = async ({ request }: LoaderArgs) => {
    const categories = await getCategories({});

    return { categories };

}

export const action = async ({request}: ActionArgs) => {
    const formData = await request.formData();
    const name = formData.get("category-name");
    const delCategory = await deleteCategory({name});
    return {delCategory};
}

export default function CategoriesRoute() {
    const [sortOrder, setSortOrder] = useState(null);
    const loaderData = useLoaderData();
    const categories =  loaderData.categories;

    const handleSort = (field) => {
        if (sortOrder === field) {
            setSortOrder(`${field}-desc`);
        } else {
            setSortOrder(field);
        }
    };


    const sortedCategories = [...categories].sort((a, b) => {
        if (sortOrder === 'categoryId') {
          return a.id - b.id;
        } else if (sortOrder === 'categoryId-desc') {
          return b.id - a.id;
        } else if (sortOrder === 'categoryName') {
          return a.name.localeCompare(b.name);
        } else if (sortOrder === 'categoryName-desc') {
          return b.name.localeCompare(a.name);
        }
        
        return 0;
      });

    return(
        <div className="bg-gray-100 p-4 flex flex-col">
            <Link to="../dashboard" className="mb-5">
                <div className="flex items-center text-gray-700 hover:text-gray-900">
                    <img className="h-5 w-5 mr-3" src={backIcon} alt="Back Icon" />
                    <p className="text-lg font-bold">Back to Dashboard</p>
                </div>
            </Link>
            <div className="flex items-center justify-between my-5">
                <h1 className="text-4xl font-bold">All Categories</h1>
                <Link to="../dashboard/category">
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
                                <div onClick={() => handleSort('categoryId')} className="flex items-center">
                                    Category Id
                                    {sortOrder === 'categoryId' ? (
                                        <span className="ml-1">&#9650;</span>
                                    ) : (
                                        sortOrder === 'categoryId-desc' && <span className="ml-1">&#9660;</span>
                                    )}
                                </div>
                            </th>
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
                            <th className="py-3 px-6 bg-gray-200"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCategories.map((category) => (
                            <tr key={category.id} className="border-b border-gray-300">
                                <td className="py-4 px-6">{category.id}</td>
                                <td className="py-4 px-6">{category.name}</td>
                                <td className="py-4 px-6 flex items-center">
                                    <Link to={`../dashboard/category?pid=${category.id}`}>
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                                            Edit
                                        </button>
                                    </Link>
                                    <Form method="post">
                                        <input type="hidden" name="category-name" value={category.name} />
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
            <Link to="../dashboard/category" className="flex items-center justify-center mt-10">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add Category
                </button>
            </Link>
        </div>

    )
}