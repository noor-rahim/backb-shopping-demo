import { Images } from '@prisma/client';
import { prisma } from "~/db.server";

export function getCartItems({  }:  {}) {
    return prisma.cart.findMany({
        include : {
            product : {
                include: {images: true}
            }, 
            
        },
        where: {quantity: {gt: 0}},
    });
}

export function incrementCartItemQuantity({productId}: {productId: number}) {
    return prisma.cart.upsert({
        where: {productId},
        update: {
            quantity: {
                increment: 1
            },
        }, 
        create: {
            productId,
            quantity: 1,
        }
    })
}

export function decrementCartItemQuantity({productId}: {productId: number}) {
    return prisma.cart.upsert({
        where: {productId},
        update: {
            quantity: {
                decrement: 1,
            },
        }, 
        create: {
            productId,
            quantity: 0,
        }
    })
}

export function deleteItemFromCart({productId}: {productId: number}) {
    return prisma.cart.delete({
        where: {productId},
    })
}

export function getCartItemsCount() {
    return prisma.cart.count({
        where: {quantity: {
            gt: 0
        }}
    });
}