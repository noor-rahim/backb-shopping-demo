
import type { Category, Product } from "@prisma/client";

import { prisma } from "~/db.server";

export function createCategory({
    name,
    description,
    imageSrc,
    imageAlt,
    products
}: Category & {
    products: Product[]
}) {
    return prisma.category.create({
        data: {
            name,
            description,
            imageSrc,
            imageAlt,
            products: {
                create: products,
            }
        },
    });
}

export function updateCategory(id: number, {
    name,
    description,
    imageSrc,
    imageAlt,
    products
}: Category & {
    products: Product[]
}) {
    return prisma.category.update({
        where: { id },
        data: {
            name,
            description,
            imageSrc,
            imageAlt,
            products: {
                create: products,
            }
        },
    });
}

export function getCategories({ id }: {id: number }) {
    return prisma.category.findMany({
        orderBy: { id: "desc" },
        ...(id && {where: {id}}),
    });
}

export function deleteCategory({
    name,
}: Category) {
    return prisma.category.delete({
        where: { name },
    });
}

