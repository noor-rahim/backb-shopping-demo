import { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { createCategory, getCategories, updateCategory } from "~/models/category.server";
import backIcon from "../../public/assets/arrow-left-solid.svg"
import { useState } from "react";


export const action = async ({ request }: ActionArgs) => {
    const sp = new URL(request.url).searchParams;
    const categoryId = Number.parseInt(sp.get('pid'));
    const formData = await request.formData();

    const name = (formData.get("name") ?? '').trim();
    const description = formData.get("description");
    const imageSrc = formData.get("imageSrc");
    const imageAlt = formData.get("imageAlt");
    const buttonType = formData.get("jill");

    if (buttonType === 'update') {

        const updateCat = await updateCategory(categoryId, {
            name,
            description,
            imageSrc,
            imageAlt,
            products: [],
        });

        return { updateCat }
    }

    try {
        const category = await createCategory({
            name,
            description,
            imageSrc,
            imageAlt,
            products: [],
        });
        return { category };

    } catch (err) {
        if (err instanceof Error)
            return { error: { message: err.message } }
        return { error: { message: 'unknown err' } }
    }
}

export const loader = async ({ request }: LoaderArgs) => {
    const sp = new URL(request.url).searchParams;
    const categoryId = Number.parseInt(sp.get('pid'));
    const editingCategory = categoryId && await getCategories({ id: categoryId });
    return { editingCategory };

}

type ActionData = Awaited<ReturnType<typeof action>> | undefined;

export default function CategoryRoute() {

    const loaderData = useLoaderData();
    const editingCategory = loaderData.editingCategory;
    const emptyCategory = { name: "", description: "", imageSrc: "", imageAlt: "" };
    const [editing, setIsEditing] = useState(editingCategory?.[0] ?? emptyCategory);
    const navigation = useNavigation();
    const isSubmitting = navigation.state !== 'idle';
    const actionData = useActionData() as ActionData;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setIsEditing((prevEditing: {}) => ({ ...prevEditing, [name]: value }));
    };

    return (
        <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-10">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
                <Link to="../dashboard/categories" className="mb-5">
                    <div className="flex flex-row items-center text-gray-700 hover:text-gray-900">
                        <img className="h-5 w-5 mr-3 mt-1" src={backIcon} alt="Back Icon" />
                        <p className="text-lg font-bold">Back to Categories</p>
                    </div>
                </Link>
                <Form method="post" className="flex flex-col">
                    <input type="hidden" name="formType" value="category" />
                    <label className="mt-4">
                        Name
                        <input
                            value={editing.name}
                            onChange={handleInputChange}
                            className="ml-2 mt-2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required minLength={3} type="text" name="name" />
                    </label>
                    <label className="mt-4">
                        Description
                        <input
                            value={editing.description}
                            onChange={handleInputChange}
                            className="ml-2 mt-2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text" name="description" />
                    </label>
                    <label className="mt-4">
                        Image Source
                        <input
                            value={editing.imageSrc}
                            onChange={handleInputChange}
                            className="ml-2 mt-2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text" name="imageSrc" />
                    </label>
                    <label className="mt-4">
                        Image Alt
                        <input
                            value={editing.imageAlt}
                            onChange={handleInputChange}
                            className="ml-2 mt-2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text" name="imageAlt" />
                    </label>
                    {editingCategory
                        ? <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md focus:outline-none mt-5"
                            disabled={isSubmitting}
                            name="jill"
                            value="update"
                            type="submit" >
                            Save
                        </button>
                        :
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md focus:outline-none mt-5"
                            disabled={isSubmitting}
                            name="jill"
                            value="add"
                            type="submit">
                            Create Category
                        </button>}

                </Form>
                {actionData?.error && <span className="text-red-500 mt-4">{actionData.error.message}</span>}
                {actionData?.category && (
                    <span className="flex flex-row mt-4 text-green-500">
                        Created new category with name <p className="font-bold ml-1">"{actionData.category.name}"</p>
                    </span>
                )}
                {actionData?.updateCat && (
                    <span className="flex flex-row mt-4 text-red-500">
                        <p className="font-bold mr-1 ">"{actionData.updateCat.name}"</p> Category got updated.
                    </span>
                )}

            </div>
        </div>


    )
}