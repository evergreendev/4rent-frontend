"use client"
import {Suspense, useEffect, useState} from "react";

const SearchBar = () => {
    const [results, setResults] = useState<any>([]);


    useEffect(() => {
        async function getSearchResults(){
            if (process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL){
                const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}/api/listings/address-search`, {
                    body: JSON.stringify({"address": "rapid city"}),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                });
                console.log(res);
                if (res.ok){
                    console.log(res);
                    setResults(await res.json())
                }

            }
        }

        getSearchResults()

    }, []);

    console.log(results);

    return <Suspense fallback="Loading..."><div className="text-slate-950">
        <input className="rounded p-4 w-full" placeholder="Area,City,Town or Address"/>
    </div></Suspense>
}

export default SearchBar;
