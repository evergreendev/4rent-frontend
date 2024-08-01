"use client"
import {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {Listing} from "@/app/types/payloadTypes";
import Map from "@/app/components/Map";
import {createPortal} from "react-dom";
import ListingCard from "@/app/components/ListingCard";


const Results = ({results, showResults}: { results: (Listing & { distance: number })[], showResults: boolean }) => {
    const [searchResultsDom, setSearchResultsDom] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setSearchResultsDom(document.getElementById("search-results"));
    }, []);
    useEffect(() => {
        if (results.length > 0){
            searchResultsDom?.scrollIntoView({behavior: "smooth"});
        }

    }, [searchResultsDom, results]);

    if (!showResults) return <></>;

    return searchResultsDom ? createPortal(<div className="flex overflow-hidden flex-wrap content-start">
        <div className="bg-white bg-opacity-70 p-8 flex flex-wrap w-6/12 content-start">
            <h2 className="text-3xl font-anton text-red-600 mb-2 w-full">Rentals Near You:</h2>
            {results.map((listing) => {
                return <ListingCard listing={listing} key={listing.id} distance={listing.distance.toFixed(0)}/>
            })}
        </div>
        <Map listings={results}/>
    </div>, searchResultsDom) : <div>
        <div className="mt-16 bg-white bg-opacity-70 p-8 shrink flex flex-wrap content-start overflow-y-scroll">
            <h2 className="text-3xl font-anton text-red-600 mb-2 w-full">Rentals Near You:</h2>
            {results.map((listing) => {
                return <ListingCard listing={listing} key={listing.id}/>
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
                        "limit": 6
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
