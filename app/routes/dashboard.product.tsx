import { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { getCategories } from "~/models/category.server";
import { createProduct, deleteProductFeature, deleteProductImage, deleteProductShipping, getOneProduct, updateProduct } from "~/models/product.server";
import backIcon from "../../public/assets/arrow-left-solid.svg";
import React, { useState } from "react";

export const action = async ({ request }: ActionArgs) => {
    const formData = await request.formData();

    const deleteProductFeatureId = formData.get("delete-product-feature") ?? '';
    const deleteProductShippingId = formData.get("delete-product-shipping") ?? '';
    const deleteProductImagesId = formData.get("delete-product-image") ?? '';


    if (deleteProductFeatureId) {
        const id = Number.parseInt(deleteProductFeatureId);
        const v = await deleteProductFeature({ id });
        
        return { deletedProductFeature: v };
    }

    if (deleteProductShippingId) {
        const id = Number.parseInt(deleteProductShippingId);
        const v = await deleteProductShipping({ id });
        
        return { deletedProductFeature: v };
    }

    if (deleteProductImagesId) {
        const id = Number.parseInt(deleteProductImagesId);
        const v = await deleteProductImage({ id });
        
        return { deletedProductFeature: v };
    }

    const features = formData.getAll("features").map(v => {
        try {
            const feature = JSON.parse(v);
            return feature;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }).filter(v => v);



    const shipping = formData.getAll("shipping").map(v => {
        try {
            const shipping = JSON.parse(v);
            return shipping;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }).filter(v => v);

    const images = formData.getAll("images").map(v => {
        try {
            const images = JSON.parse(v);
            return images;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }).filter(v => v);
    console.log(images);
    const name = formData.get("name") ?? "";
    const nature = formData.get("nature") ?? "";
    const details = formData.get("details") ?? "";
    const description = formData.get("description") ?? "";
    const price = Number.parseFloat(formData.get("price") ?? "0");
    const categoryId = Number.parseInt(formData.get("category-id") ?? "0");
    const buttonType = formData.get("jill");

    const sdd = shipping;
    // const fdd = features.map(v => ({ features: v }));
    const fdd = features;
    const idd = images;
    //const idd = images.map(v => ({ src: v, alt: v }));

    try {
        if (buttonType === "update") {
            const sp = new URL(request.url).searchParams;
            const productId = Number.parseInt(sp.get("pid") ?? "0");

            const updatePro = await updateProduct(productId, {
                name,
                nature,
                description,
                details,
                features: fdd,
                shipping: sdd,
                price,
                categoryId,
                images: idd,
            });

            return { updatePro };
        }

        const product = await createProduct({
            name,
            nature,
            description,
            details,
            features: fdd,
            shipping: sdd,
            price,
            categoryId,
            images: idd,
        });

        return { product };
    } catch (err) {
        if (err instanceof Error) {
            return { error: { message: err.message } };
        }
        return { error: { message: "unknown err" } };
    }
};

export const loader = async ({ request }: LoaderArgs) => {
    const sp = new URL(request.url).searchParams;
    const productId = Number.parseInt(sp.get("pid") ?? "0");
    const categories = await getCategories({});
    const editingProduct = productId && (await getOneProduct({ id: productId }));

    return { categories, editingProduct };
};

type LoaderData = Awaited<ReturnType<typeof loader>>;
type ActionData = Awaited<ReturnType<typeof action>> | undefined;

export default function ProductRoute() {
    const loaderData = useLoaderData() as LoaderData;
    const actionData = useActionData() as ActionData;
    const navigation = useNavigation();
    const editingProduct = loaderData.editingProduct;
    const [editing, setEditing] = useState(editingProduct ?? {
        features: [],
        shipping: [],
        images: [],

    });
    const isSubmitting = navigation.state !== "idle";


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditing((prevEditing) => ({
            ...prevEditing,
            [name]: value,
        }));
    };

    const handleInputChangeFeature = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        setEditing((prevEditing) => {
            const updatedFeatures = [...prevEditing.features];
            updatedFeatures[index].features = value;
            return {
                ...prevEditing,
                features: updatedFeatures,
            };
        });
    };

    const handleInputChangeShipping = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        setEditing((prevEditing) => {
            const updatedShipping = [...prevEditing.shipping];
            updatedShipping[index].shipping = value;
            return {
                ...prevEditing,
                shipping: updatedShipping,
            };
        });
    };

    const handleInputChangeImage = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        setEditing((prevEditing) => {
            const updatedImages = [...prevEditing.images];
            updatedImages[index].src = value;
            return {
                ...prevEditing,
                images: updatedImages,
            };
        });
    };

    const handleAddFeature = () => {
        setEditing((prevEditing) => ({
            ...prevEditing,
            features: prevEditing.features ? [...prevEditing.features, { features: "" }] : [{ features: "" }],
        }));
    };

    const handleAddShipping = () => {
        setEditing((prevEditing) => ({
            ...prevEditing,
            shipping: prevEditing.shipping ? [...prevEditing?.shipping, { shipping: "" }] : [{ shipping: "" }],
        }));
    };

    const handleAddImage = () => {
        setEditing((prevEditing) => ({
            ...prevEditing,
            images: prevEditing.images ? [...prevEditing?.images, { src: "", alt: "" }] : [{ src: "", alt: "" }],
        }));
    };


    console.error(actionData?.error?.message);

    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-400  via-pink-500 to-red-500 p-10">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
                <Form method="post" className="flex flex-col">
                    <Link to="../dashboard/products" className="mb-5">
                        <div className="flex flex-row items-center text-gray-700 hover:text-gray-900">
                            <img className="h-5 w-5 mr-3 mt-1" src={backIcon} alt="Back Icon" />
                            <p className="text-lg font-bold">Back to Product Edits</p>
                        </div>
                    </Link>
                    {editingProduct
                        ? <p>Category Name :
                            {editingProduct && editingProduct.category && (
                                <span className="font-bold">"{editingProduct.category.name}"</span>
                            )}
                        </p>

                        : <label className="mt-4">
                            Select Category
                            <select className="ml-2 mt-2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required name="category-id">
                                <option value="">--Please choose an option--</option>
                                {loaderData.categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </label>}
                    <label className="mt-4">
                        Name
                        <input
                            value={editing?.name ?? ""}
                            onChange={handleInputChange}
                            className="ml-2 mt-2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            name="name"
                        />
                    </label>
                    <label className="mt-4">
                        Nature
                        <input
                            value={editing?.nature ?? ""}
                            onChange={handleInputChange}
                            className="ml-2 mt-2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            name="nature"
                        />
                    </label>
                    <label className="mt-4">
                        Product Features
                        {editing?.features?.map((feature, index) => (
                            <div className="flex flex-row space-x-5" key={index}>

                                <input type='hidden' name='features' value={JSON.stringify(feature)} />
                                <input
                                    key={index}
                                    value={feature.features}
                                    onChange={(e) => handleInputChangeFeature(e, index)}
                                    className="ml-2 mt-2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="text"
                                />
                                {feature.id &&
                                    <Form method="post">
                                        <button
                                            name="delete-product-feature"
                                            value={feature.id}
                                            type="submit"
                                            className="bg-red-500 hover:bg-red-600 text-white h-6 w-6 mt-4 flex justify-center items-center pb-1 rounded-full focus:outline-none">                                            
                                            x
                                        </button>
                                    </Form>}

                            </div>
                        ))}
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 mt-2 rounded-md focus:outline-none ml-5"
                            onClick={handleAddFeature}
                            type="button"
                        >
                            Add Feature
                        </button>
                    </label>
                    <label className="mt-4">
                        Shipping & Returns
                        {editing?.shipping?.map((ship, index) => (
                            <div className="flex flex-row space-x-5" key={index}>
                                <input type='hidden' name='shipping' value={JSON.stringify(ship)} />
                                <input
                                    key={index}
                                    value={ship.shipping}
                                    onChange={(e) => handleInputChangeShipping(e, index)}
                                    className="ml-2 mt-2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="text"
                                />
                                {ship.id &&
                                    <Form method="post">
                                        <button
                                            name="delete-product-shipping"
                                            value={ship.id}
                                            type="submit"
                                            className="bg-red-500 hover:bg-red-600 text-white h-6 w-6 mt-4 flex justify-center items-center pb-1 rounded-full focus:outline-none">
                                            x
                                        </button>
                                    </Form>}
                            </div>
                        ))}
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 mt-2 rounded-md focus:outline-none ml-5"
                            onClick={handleAddShipping}
                            type="button"
                        >
                            Add Shipping
                        </button>
                    </label>
                    <label className="mt-4 ">
                        Images
                        {editing?.images?.map((image, index) => (
                            <div className="flex flex-row space-x-5" key={index}>
                                <input type='hidden' name='images' value={JSON.stringify(image)} />
                                <input
                                    key={index}
                                    value={image.src}
                                    onChange={(e) => handleInputChangeImage(e, index)}
                                    className="ml-2 mt-2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="text"
                                />
                                {image.id &&
                                    <Form method="post">
                                        <button
                                            name="delete-product-image"
                                            value={image.id}
                                            type="submit"
                                            className="bg-red-500 hover:bg-red-600 text-white h-6 w-6 mt-4 flex justify-center items-center pb-1 rounded-full focus:outline-none">
                                            x
                                        </button>
                                    </Form>}
                            </div>
                        ))}
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 mt-2 rounded-md focus:outline-none ml-5"
                            onClick={handleAddImage}
                            type="button"
                        >
                            Add Image
                        </button>
                    </label>
                    <label className="mt-4">
                        Details
                        <input
                            value={editing?.details ?? ""}
                            onChange={handleInputChange}
                            className="ml-2 mt-2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            name="details"
                        />
                    </label>
                    <label className="mt-4">
                        Price
                        <input
                            value={editing?.price ?? ""}
                            onChange={handleInputChange}
                            className="ml-2 mt-2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="number"
                            name="price"
                        />
                    </label>
                    <label className="mt-4 flex flex-col">
                        Description
                        <input
                            value={editing?.description ?? ""}
                            onChange={handleInputChange}
                            className="ml-2 mt-2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            name="description"
                            type="text"
                        />
                    </label>
                    {editingProduct ? (
                        <button
                            name="jill"
                            value="update"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 mt-5 rounded-md focus:outline-none mb-5"
                            type="submit"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            name="jill"
                            value="add"
                            disabled={isSubmitting}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 mt-5 rounded-md focus:outline-none mb-5"
                            type="submit"
                        >
                            Create Product
                        </button>
                    )}
                </Form>
                {actionData?.error && <span className="text-red-500 mt-4">{actionData.error.message}</span>}
                {actionData?.product && (
                    <span className=" text-green-700  ">
                        Created new product with name{" "}
                        <span className="font-bold">"{actionData.product.name}"</span> in the category id{" "}
                        <span className="font-bold">{actionData.product.categoryId}</span>
                    </span>
                )}
                {actionData?.updatePro && (
                    <span className="pt-10 text-green-700 ">
                        Updated product with name <span className="font-bold">"{actionData.updatePro.name}"</span> in the category name{" "}
                        <span className="font-bold">"{editingProduct?.category.name}"</span>
                    </span>
                )}
            </div>
        </div>
    );
}
