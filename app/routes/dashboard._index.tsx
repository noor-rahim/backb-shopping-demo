import { Link } from "@remix-run/react"

export default function DashboardRoute() {
    return (
        <div className="flex flex-col h-full items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-10 rounded-lg shadow-lg">
            <div className="text-4xl font-bold text-white mb-20">Welcome to the Admin Page</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Link to="./categories" className="text-center">
                    <div className="bg-white text-gray-800 rounded-lg h-full flex flex-col justify-center py-12 px-10 hover:bg-gray-200 transition duration-300">
                        <div className="text-3xl font-bold mb-4">Customize Category</div>
                        <div className="text-lg">Manage and modify product categories</div>
                    </div>
                </Link>
                <Link to="./products" className="text-center">
                    <div className="bg-white text-gray-800 rounded-lg h-full flex flex-col justify-center py-12 px-10 hover:bg-gray-200 transition duration-300">
                        <div className="text-3xl font-bold mb-4">Customize Product</div>
                        <div className="text-lg">Manage and update product details</div>
                    </div>
                </Link>
            </div>
        </div>



    )
}