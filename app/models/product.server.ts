
import type {  Images, Product, ProductFeatures, ProductShipping } from "@prisma/client";
import { create } from "domain";

import { prisma } from "~/db.server";

export function createProduct({
    name,
    nature,
    features,
    shipping,
    details,
    price,
    description,
    images,
    categoryId
}: Product & {
    images: Images[],
    features: ProductFeatures[],
    shipping: ProductShipping[],
}) {
    return prisma.product.create({
        data: {
            name,
            nature,
            features: {
                create: features,
            },
            shipping: {
                create: shipping,
            },
            details,
            price,
            description,
            images: {
                create: images,    
            },
            categoryId,
        },
    });
}

export function updateProduct(id: number, {
    name,
    nature,
    features,
    shipping,
    details,
    price,
    description,
    images,
    
}: Product & {
    images: Images[],
    features: ProductFeatures[],
    shipping: ProductShipping[],
}) {
    
    return prisma.product.update({
        where: {id}, 
        data: {
            name,
            nature,
            features: {
                update: features.filter(({id}) => id).map(({id, features}) => ({
                    data: {features},
                    where: {id},
                })),
                "create": features.filter(({id}) => !id).map(({features}) => ({
                    features
                })),
                // upsert: features.map(({id, features}) => ({
                //     create: {features},
                //     update: {features},
                //     where: id ? {id} : {}
                // })),
            },
            shipping: {
                update: shipping.filter(({id}) => id).map(({id, shipping}) => ({
                    data: {shipping},
                    where: {id},
                })),
                "create": shipping.filter(({id}) => !id).map(({shipping}) => ({
                    shipping
                })),
            },
            details,
            price,
            description,
            images: {
                update: images.filter(({id}) => id).map(({id, src, alt}) => ({
                    data: {src, alt},
                    where: {id},
                })),
                "create": images.filter(({id}) => !id).map(({src, alt}) => ({
                    src, alt
                })),   
            },
            
        },
    });
}

export function getProduct({ categoryName }:  {categoryName?: string}) {
    return prisma.product.findMany({
        orderBy: { id: "desc" },
        ...( categoryName && {where: {category : {name: categoryName}}}),
        include: {
            images: true,
            shipping: true,
            features: true,
            cart: true,
            category: true,
        },
    });
}

export function getOneProduct({
    id,
}) {
    return prisma.product.findFirst({
        where: { id },
        include: {
            images: true,
            shipping: true,
            features: true,
            cart: true,
            category: true,
          },
    })
}

export function deleteProduct({
    id,
}: Product) {
    return prisma.product.delete({
        where: { id },
    });
}

export function deleteProductFeature({id}: {id:number}) {
    return prisma.productFeatures.delete({
        where: {id},
    })
}

export function deleteProductShipping({id}: {id:number}) {
    return prisma.productShipping.delete({
        where: {id},
    })
}

export function deleteProductImage({id}: {id:number}) {
    return prisma.images.delete({
        where: {id},
    })
}