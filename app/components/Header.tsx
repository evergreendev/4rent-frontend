import {Media} from "@/app/types/payloadTypes";
import Link from "next/link";
import React from "react";
import Image from "next/image";

const Header = ({image}: { image: Media }) => {
    return <div className="absolute top-0 z-50 p-8">
        <Link href="/">
            <Image src={`${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}${image?.url}` || ""} alt={image?.alt || ""}
                   width={image?.width || 200} height={image.height || 200}/>
        </Link>
    </div>
}

export default Header;
