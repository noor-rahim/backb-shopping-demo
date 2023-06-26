import callouts from "./callouts";

const products = callouts.flatMap((callout) => {
    return callout.products.map((product) => {
        return {
            ...product,
            id: `${callout.id}--${product.id}`,
            calloutId: callout.id,
            calloutName: callout.name,
        }
    })

})

export default products;