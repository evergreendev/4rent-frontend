import Link from "next/link";
import Image from "next/image";
import {Listing} from "@/app/types/payloadTypes";

const ListingCard = ({listing, distance}:{listing:Listing, distance?:string}) => {
    const startingAt = listing.features?.floorplans?.reduce((a, b) => {
        return Math.min(a, b.starting_at || Infinity);
    }, Infinity);
    const highestRent = listing.features?.floorplans?.reduce((a, b) => {
        return Math.max(a, b.starting_at || 0);
    }, 0);

    const minBeds = listing.features?.floorplans?.reduce((a, b) => {
        return Math.min(a, b.beds || Infinity);
    }, Infinity);
    const maxBeds = listing.features?.floorplans?.reduce((a, b) => {
        return Math.max(a, b.beds || 0);
    }, 0);

    const minBaths = listing.features?.floorplans?.reduce((a, b) => {
        return Math.min(a, b.bath || Infinity);
    }, Infinity);
    const maxBaths = listing.features?.floorplans?.reduce((a, b) => {
        return Math.max(a, b.bath || 0);
    }, 0);

    return <Link href={`/listings/${listing.slug}`} key={listing.id}
                 className="bg-slate-100 text-slate-700 mx-auto shadow-md mb-6 flex flex-col w-full md:w-[48%] duration-500 transition-all hover:brightness-110">
        {
            listing.featuredImage && typeof listing.featuredImage !== "number"
                ? <Image
                    className="w-full aspect-video object-cover"
                    src={`${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}${listing.featuredImage?.url}`}
                    width={listing.featuredImage?.width || 0}
                    height={listing.featuredImage?.height || 0}
                    alt={`${listing.featuredImage?.alt}`}/>
                : ""
        }
        <div className="grow flex-col flex">
            <div className="flex mt-auto">
                {
                    Number.isFinite(startingAt)
                    && <div
                        className="font-bold w-full p-2 text-xl">${startingAt} {
                        startingAt !== highestRent ?
                            <>- ${highestRent}</> : <></>
                    }</div>
                }
                <div className="ml-auto text-right w-full p-2">
                    {
                        Number.isFinite(minBeds)
                        && <>{minBeds}{
                            minBeds !== maxBeds ? <>-{maxBeds}</> : ""
                        } Beds / </>
                    }
                    {
                        Number.isFinite(minBaths)
                        && <>{minBaths}{
                            minBaths !== maxBaths ? <>-{maxBaths}</> : ""
                        } Baths</>
                    }
                </div>
            </div>

            <div className="px-4">
                {
                    distance && <div className="font-bold text-xl">{distance} miles</div>
                }
                <h3 className="text-2xl">{listing.title}</h3>

                {
                    listing.state ?
                        <address>
                            <p>{listing.street}</p>
                            <p>{listing.city}, {listing.state} {listing.zip}</p>
                        </address> : ""
                }
                <Link className="block text-right font-bold"
                      href={`/listings/${listing.slug}`}
                      aria-label={`Learn more about ${listing.title}`}>Learn More</Link>
            </div>

        </div>
    </Link>
}

export default ListingCard;
