"use client"
import React, {useEffect} from 'react';
import Radar from 'radar-sdk-js';

import 'radar-sdk-js/dist/radar.css';
import {Listing} from "@/app/types/payloadTypes";


const Map = ({listings}:{listings:Listing[]}) => {
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_RADAR_PUBLISHABLE){
            Radar.initialize(process.env.NEXT_PUBLIC_RADAR_PUBLISHABLE);
        }

        // create a map
        const map = Radar.ui.map({
            container: 'map',
            style: 'radar-default-v1',
            center: [95.7129,37.0902],
            zoom: 11,
        });

        listings.forEach(listing => {
            if (listing.longitude && listing.latitude){
                // add a marker to the map
                Radar.ui.marker({})
                    .setLngLat([parseFloat(listing.longitude), parseFloat(listing.latitude)])
                    .addTo(map);
            }

        })

        map.fitToMarkers();


    }, [listings]);

    return (
        <div id="map-container" className="min-h-[70vh] w-72 relative grow">
            <div id="map" style={{height: '100%', position: 'absolute', width: '100%'}}/>
        </div>
    );
}

export default Map;
