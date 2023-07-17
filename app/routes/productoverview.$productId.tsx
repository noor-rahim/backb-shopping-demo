
import { LoaderFunction } from '@remix-run/node';
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react'
import LogoAndCart from '~/components/LogoAndCart';
import { getOneProduct, getProduct } from '~/models/product.server';
import { getCategories } from '~/models/category.server';
import { getCartItemsCount } from '~/models/cart.server';

interface PropsT {
}

interface ProductT {
  id: string;
  name: string;
  price: string;
  href: string;
  description: string;
  features: FeaturesT[];
  shipping: ShippingT[];
  details: string;
  quantity: number;
  images: ImagesT[];
  calloutName: string;
  nature: string;
  cart: { quantity: number } | null;
}

interface ImagesT {
  src: string;
  alt: string;
}

interface FeaturesT {
  id: string;
  features: string;
}

interface ShippingT {
  id:string;
  shipping: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  const productId = (params['productId'] ?? "");
  const productIdInNumber = parseInt(productId);
  const product = await getOneProduct({ id: productIdInNumber });
  const cartItemsCount = await getCartItemsCount();

  if (product?.categoryId) {
    const [category] = await getCategories({ id: product.categoryId });
    product.calloutName = category.name;
  }
  return { product: product, cartItemsCount }
}


export default function ProductOverview(_props: ProductT) {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();
  const [detailsCollapse, setDetailsCollapse] = useState(false);
  const [featuresCollapse, setFeaturesCollapse] = useState(false);
  const [descriptionCollapse, setDescriptionCollapse] = useState(false);
  const [returnCollapse, setReturnCollapse] = useState(false);

  const product = loaderData.product;
  const count = (product.cart !== null) ? (product.cart.quantity ?? 0) : 0;




  return (
    <div className="bg-white mx-auto min-h-screen max-w-screen-lg">
      <LogoAndCart cartItemsCount={loaderData.cartItemsCount} />
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol role="list" className="mx-auto flex max-w-3xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <li>
              <div className="flex items-center">
                <Link to={`../categories/${product.calloutName}`} className="mr-2 text-sm font-medium text-gray-900">
                  {product.calloutName}
                </Link>
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>

            <li className="text-sm">
              <a href={"product.href"} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {product.name}
              </a>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className=' mx-auto max-w-2xl sm:px-6 mt-6'>
          <div className="carousel ">
            {product.images.map((image, index) => {
              return (
                <div
                  key={`slide${index + 1}`}
                  id={`slide${index + 1}`}
                  className="carousel-item relative w-full h-[600px] aspect-h-4 aspect-w-3 overflow-hidden rounded-lg">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                    <a
                      href={`#slide${index === 0 ? product.images.length : index}`}
                      className="btn ">❮</a>
                    <a
                      href={`#slide${index === product.images.length - 1 ? 1 : index + 2}`}
                      className="btn ">❯</a>
                  </div>
                </div>
              )
            })
            }
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
            <h3 className='' >{product.nature}</h3>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">$ {product.price}</p>


            {/* Add to cart */}
            <fetcher.Form method='post' action='/cart' >
              <input type="hidden" name="product-id" value={product.id} ></input>
              {count === 0 ? (
                <button
                  name="button-action"
                  value="increment"
                  type="submit"
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 "
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex mt-10 items-center ">
                  <button
                    name="button-action"
                    value="decrement"
                    type="submit"
                    className="bg-indigo-600 h-full w-full hover:bg-indigo-700 text-white py-3 font-bold  rounded"
                  >
                    -
                  </button>
                  <span className="bg-indigo-100 text-center px-16 font-bold h-full w-full py-3 ">{count}</span>
                  <button
                    name="button-action"
                    value="increment"
                    type="submit"
                    className="bg-indigo-500 h-full w-full py-3 hover:bg-indigo-700 text-white font-bold  rounded"
                  >
                    +
                  </button>
                </div>
              )}
            </fetcher.Form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">

            <div className={`mt-10 collapse collapse-plus  ${descriptionCollapse ? "collapse-open" : "collapse-close"}`}>
              <h1 onClick={() => setDescriptionCollapse(v => !v)} className="collapse-title text-2xl font-medium text-gray-900">Description</h1>
              <div className="collapse-content mt-4 space-y-6">
                <p className="text-sm text-gray-600"> {product.description}</p>
              </div>
            </div>

            <div className={`mt-10 collapse collapse-plus  ${detailsCollapse ? "collapse-open" : "collapse-close"}`}>
              <h1 onClick={() => setDetailsCollapse(v => !v)} className="collapse-title text-2xl font-medium text-gray-900">Details</h1>
              <div className="collapse-content mt-4 space-y-6">
                <p className="text-sm text-gray-600"> {product.details}</p>
              </div>
            </div>

            <div className={`mt-10 collapse collapse-plus  ${featuresCollapse ? "collapse-open" : "collapse-close"}`}>
              <h1 onClick={() => setFeaturesCollapse(v => !v)} className="collapse-title text-2xl font-medium text-gray-900">Features</h1>

              <div className="mt-4 collapse-content">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {product.features.map((f) => (
                    <li key={f.id} className="text-gray-400">
                      <span className="text-gray-600">{f.features}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={`mt-10 collapse collapse-plus  ${returnCollapse ? "collapse-open" : "collapse-close"}`}>
              <h1 onClick={() => setReturnCollapse(v => !v)} className="collapse-title text-2xl font-medium text-gray-900">Shipping & Returns</h1>

              <div className="mt-4 collapse-content">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {product.shipping.map((s) => (
                    <li key={s.id} className="text-gray-400">
                      <span className="text-gray-600">{s.shipping}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}
