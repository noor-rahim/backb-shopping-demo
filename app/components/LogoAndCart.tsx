import logo from '../../public/assets/logo.svg';
import cart from '../../public/assets/bag-shopping-solid.svg';
import { Link } from '@remix-run/react';
import { useEffect, useState } from 'react';


interface PropsT {
    cartItemsCount: number;
}

export default function LogoAndCart(props: PropsT) {
    const cartHasItem = props.cartItemsCount > 0
        ? <div className='absolute h-4 w-4 items-center justify-center flex text-xs rounded-full text-white bg-blue-700  '>
            {props.cartItemsCount}
        </div>
        : <></>;
    return (
        <div className='justify-between flex flex-row lg:max-w-screen-lg md:max-w-screen-md mx-auto w-full'>
            <Link to="../home">
                <img className='m-5 h-20 w-40 ' src={logo} />
            </Link>
            <Link to="../cart" >
                <div className='flex justify-end relative mr-7 mt-12'>
                    <img className='h-7 w-7  ' src={cart} />
                    {cartHasItem}
                </div>
            </Link>
        </div>
    )
} 