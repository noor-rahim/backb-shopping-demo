import storage from '../storage'

const CARTKEY = "cart";

const addToCart = ({ productId, quantity }: {productId: string, quantity: number} ) => {
    const cart = storage.get(CARTKEY) ?? [];
    const newProduct = { productId, quantity };
    const product = cart.find(v => v.productId === productId);
    const updatedCart = (product
        ? cart.map(v => v.productId === productId ? newProduct : v)
        : [
            ...cart, newProduct,
        ]);
    storage.set(CARTKEY, updatedCart);
    return updatedCart;

};

const remove = ({ productId }: { productId: string }) => {
    const cart = storage.get(CARTKEY) ?? [];
    const updatedCart = cart.filter(v => v.productId !== productId) 
    storage.set(CARTKEY, updatedCart);
    return updatedCart;
};

const incrementQuantity = ({ productId }: { productId: string }) => {
    const cartItem = getProductByIdFromCart(productId) ?? { productId, quantity: 0 };
    const updatedProduct = { ...cartItem, quantity: cartItem.quantity + 1 }
    addToCart(updatedProduct);
    return updatedProduct;
};

const decrementQuantity = ({ productId }: { productId: string }) => {
    const cartItem = getProductByIdFromCart(productId) ?? { productId, quantity: 0 };
    const updatedProduct = { ...cartItem, quantity: Math.max(0, cartItem.quantity - 1) }
    addToCart(updatedProduct);
    return updatedProduct;
};

const getProductByIdFromCart = (id: string) => {
    const cart = storage.get(CARTKEY) ?? [];
    const product = cart.find(p => p.productId === id);
    return product;

}

const getAll = () => {
    const cart = storage.get(CARTKEY) ?? [];
    return cart;
}

export default { incrementQuantity, decrementQuantity, remove, getAll }

