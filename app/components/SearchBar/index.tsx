"use client"
import {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {Listing} from "@/app/types/payloadTypes";
import Link from "next/link";
import Map from "@/app/components/Map";
import {createPortal} from "react-dom";


const Results = ({results, showResults}: { results: (Listing & { distance: number })[], showResults: boolean }) => {
    const [searchResultsDom, setSearchResultsDom] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setSearchResultsDom(document.getElementById("search-results"));
    }, []);
    useEffect(() => {
        searchResultsDom?.scrollIntoView({behavior: "smooth"});
    }, [searchResultsDom]);

    if (!showResults) return <></>;

    return searchResultsDom ? createPortal(<div className="flex overflow-hidden flex-wrap">
        <div className="bg-white bg-opacity-70 p-8 flex flex-wrap">
            <h2 className="text-3xl font-anton text-red-600 mb-2 w-full">Rentals Near You:</h2>
            {results.map((listing) => {
                return <Link
                    className="hover:bg-slate-100 text-red-900 w-full bg-slate-200 border-b-2 border-white block"
                    href={`/listing/${listing.slug}`} key={listing.id}>
                    <div>
                        <div
                            className="font-bold text-white bg-red-900 w-full p-2 text-center">{listing.title}</div>
                        <div className="p-6">
                            {listing.distance.toFixed(0)} Miles
                        </div>
                    </div>

                </Link>
            })}
        </div>
        <Map listings={results}/>
    </div>, searchResultsDom) : <div>
        <div className="mt-16 bg-white bg-opacity-70 p-8 flex flex-wrap">
            <h2 className="text-3xl font-anton text-red-600 mb-2 w-full">Rentals Near You:</h2>
            {results.map((listing) => {
                return <Link
                    className="hover:bg-slate-100 text-red-900 w-full bg-slate-200 border-b-2 border-white block"
                    href={`/listing/${listing.slug}`} key={listing.id}>
                    <div>
                        <div
                            className="font-bold text-white bg-red-900 w-full p-2 text-center">{listing.title}</div>
                        <div className="p-6">
                            {listing.distance.toFixed(0)} Miles
                        </div>
                    </div>

                </Link>
            })}
        </div>
        <Map listings={results}/>
    </div>
}

const SearchBar = () => {
    const [results, setResults] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 1500);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (results.length > 0) setShowResults(true);
        else setShowResults(false);
    }, [results]);


    useEffect(() => {
        async function getSearchResults() {
            setIsLoading(true);
            if (process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL && debouncedSearchTerm) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}/api/listings/by-address`, {
                    body: JSON.stringify({
                        "address": debouncedSearchTerm,
                        "limit": 5
                    }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    next: {
                        revalidate: 86400 * 28,
                    }
                });
                if (res.ok) {
                    const json = await res.json();
                    setResults(json.listings);
                }

            }
            setIsLoading(false)
        }

        getSearchResults();

    }, [debouncedSearchTerm]);

    return <div className="text-slate-950">
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="rounded p-4 w-full"
               placeholder="Area, City, Town or Address"/>
        {
            isLoading
                ? <div className="h-1 w-full bg-blue-400 animate-pulse"/>
                : <Results results={results} showResults={showResults}/>
        }
    </div>
}

export default SearchBar;
