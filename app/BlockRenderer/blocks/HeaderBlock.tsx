import SearchBar from "@/app/components/SearchBar";

const HeaderBlock = ({block}:{block:any}) => {
    return <div className="w-full relative aspect-video bg-cover bg-center" style={{backgroundImage: `url(${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}${block.image.url})`}}>

        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 text-white z-20">
            <h2 className="font-openSans text-4xl mb-8">{block.header}</h2>
            {
                block.showSearch ? <SearchBar/> : ""
            }
        </div>
        <div className="absolute inset-0 bg-black opacity-40 z-0"/>
    </div>
}

export default HeaderBlock;
