import { Link } from "@remix-run/react"

interface PropsT {
  callouts: CalloutT[];
}
interface CalloutT {
  name: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

export default function Categories(props: PropsT) {
  return (
    <div className="bg-gray-100 lg:max-w-screen-lg md:max-w-screen-md w-full flex items-center justify-center mx-auto mb-10">
      <div className="mx-auto flex-1  px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none py-16 ">
          <p className="text-3xl font-bold text-gray-900 font-pathway-extreme">Collections</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10 ">
            {props.callouts.map((callout, idx) => (
              <Link key={idx} to={`../categories/${callout.name}`} >
                <div key={callout.name} className="group relative">
                  <div className="relative overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 h-24 w-full md:h-40">
                    <img
                      src={callout.imageSrc}
                      alt={callout.imageAlt}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <p className="mt-3 text-base md:text-xl ml-2 font-semibold text-gray-900">
                    <span className="absolute " />
                    {callout.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}