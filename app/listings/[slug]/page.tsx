import qs from "qs";
import {notFound} from "next/navigation";
import {Listing, Media} from "@/app/types/payloadTypes";
import getHighestAndLowest from "@/app/utils/getHighestAndLowest";
import "react-multi-carousel/lib/styles.css";
import Gallery from "@/app/components/Gallery";
import Map from "@/app/components/Map";
import serialize from "@/app/BlockRenderer/utils/serialize";

async function getData(query: any, tag: string, page?: string) {
    const stringifiedQuery = qs.stringify(
        {
            where: query,
        },
        {
            addQueryPrefix: true
        }
    );

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}/api/listings/${stringifiedQuery}&depth=2`,
        {
            next: {
                tags: [tag]
            }
        }
    );

    if (res.status !== 200) notFound();

    return res.json();
}

const Feature = ({title, items}: { title: string, items?: string[] | null }) => {
    if (!items || items.length === 0) return <></>;

    return <>
        <h2 className="text-2xl mb-5">{title}</h2>
        <div className="flex flex-wrap">
            {
                items.map(item => {
                    return <div key={item} className="w-4/12 mb-8">{item}</div>
                })
            }
        </div>
    </>
}

const Divider = () => {
    return <div className="w-[1px] self-stretch mx-3 bg-blue-100"/>;
}

export default async function LocationPage({params}: {
    params: { slug: string },
}) {
    const res = await getData({
        slug: {
            equals: params.slug
        }
    }, `listings_${params.slug}`);
    const data: Listing = res.docs[0];

    const hasAdditionalInfo = Object.values(data.features?.additional_information||{}).filter(x => {
        return x
    }).length > 0;

    return (
        <main className="flex flex-wrap">
            <div className="w-full h-40 bg-slate-800 opacity-80"/>
            <div className="w-full bg-slate-800 opacity-80">
                <div
                    className="max-w-screen-2xl w-full mx-auto p-4 bg-slate-700 flex flex-wrap items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-anton">{data.title}</h1>
                        <address>
                            {data.street}, {data.city}, {data.state} {data.zip}
                        </address>
                    </div>
                    <div className="text-3xl font-light">
                        {getHighestAndLowest(data.features?.floorplans, "starting_at", "$")} /month
                    </div>
                </div>
            </div>
            <div className="max-w-screen-2xl w-full mx-auto p-4 bg-white text-slate-950 flex flex-wrap items-center">
                <p>
                    {getHighestAndLowest(data.features?.floorplans, "beds")} Beds
                </p>
                <Divider/>
                <p>
                    {getHighestAndLowest(data.features?.floorplans, "bath")} Baths
                </p>
                <Divider/>
                <p>
                    {getHighestAndLowest(data.features?.floorplans, "sq_ft")} sq. ft.
                </p>
            </div>
            <div className="w-full max-w-screen-2xl mx-auto bg-slate-200 text-red-950">
                <Gallery gallery={data.gallery}/>
            </div>
            <div className="w-full max-w-screen-2xl mx-auto bg-white text-red-950 flex">
                <div className="grow p-8">
                    {
                        data.property_description?.length && data.property_description.length > 0 && <><h2 className="text-2xl mb-5">Description</h2>
                            <div className="max-w-prose mb-7">
                                {serialize(data.property_description?.[0])}
                            </div>
                        </>
                    }
                    <Feature title="Amenities" items={data.features?.unit_amenities?.items}/>
                    <Feature title="Community Amenities" items={data.features?.community_amenities?.items}/>
                    <Feature title="Utilities Included" items={data.features?.utilities_included?.items}/>
                    <Feature title="Parking Options" items={data.features?.parking_options?.items}/>
                    <Feature title="Pets Allowed" items={data.features?.pets?.items}/>
                    <Feature title="Lease Options" items={data.features?.lease_options?.items}/>
                    {
                        data.features?.floorplans && data.features?.floorplans.length > 0 && <div className="mb-8">
                            <h2 className="text-2xl mb-5">Floor Plans</h2>
                            <table>
                                {
                                    data.features.floorplans.map(item => {
                                        return <tr key={item.id} className="border-y">
                                            <td className="p-8">
                                                {item.beds} bed{item.beds || 0 > 1 ? "s" : ""}
                                            </td>
                                            <td className="p-8">
                                                {item.bath} bath{item.beds || 0 > 1 ? "s" : ""}
                                            </td>
                                            <td className="p-8">
                                                Starting at ${item.starting_at?.toLocaleString()}
                                            </td>
                                            <td className="p-8">
                                                {item.sq_ft?.toLocaleString()} sq. ft.
                                            </td>
                                        </tr>
                                    })
                                }
                            </table>
                        </div>
                    }
                    {
                        hasAdditionalInfo &&
                        <div>
                            <h2 className="text-2xl mb-5">Additional Information</h2>
                            {
                                data.features?.additional_information?.description &&
                                <div className="max-w-prose mb-7">
                                    {data.features?.additional_information?.description}
                                </div>
                            }
                            {
                                data.features?.additional_information?.application_fee &&
                                <div className="max-w-prose mb-7">
                                    Application Fee - ${parseFloat(data.features?.additional_information?.application_fee).toFixed(2)}
                                </div>
                            }
                            {
                                data.features?.additional_information?.security_deposit &&
                                <div className="max-w-prose mb-7">
                                    Security Deposit - ${parseFloat(data.features?.additional_information?.security_deposit).toFixed(2)}
                                </div>
                            }
                            {
                                data.features?.additional_information?.pet_deposit &&
                                <div className="max-w-prose mb-7">
                                    Pet Deposit - ${parseFloat(data.features?.additional_information?.pet_deposit).toFixed(2)}
                                </div>
                            }
                            {
                                data.features?.additional_information?.pet_rent &&
                                <div className="max-w-prose mb-7">
                                    Pet Rent - ${data.features?.additional_information?.pet_rent.toFixed(2)}
                                </div>
                            }
                        </div>
                    }
                </div>
                <div className="w-4/12 flex flex-wrap">
                    <Map listings={[data]}/>
                </div>
            </div>
        </main>
    );
}

