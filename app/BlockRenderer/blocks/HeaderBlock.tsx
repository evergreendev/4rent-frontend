import SearchBar from "@/app/components/SearchBar";

const HeaderBlock = ({block}: { block: any }) => {
    return <div>
        <div className="w-full relative min-h-[90vh] bg-cover bg-center xl:bg-[center_top_-9vw]"
             style={{backgroundImage: `url(${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}${block.image?.url})`}}>

            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 text-white z-20">
                <h2 className="font-openSans text-4xl mb-8">{block.header}</h2>
                {
                    block.showSearch ? <SearchBar/> : ""
                }
            </div>
            <div className="absolute inset-0 bg-black opacity-30 z-0"/>
        </div>
        {
            block.showSearch
                ?
                <div className="w-full bg-slate-200">
                    <div id="search-results" className="z-50 relative max-w-screen-2xl mx-auto"/>
                </div>
                : ""
        }

    </div>
}

export default HeaderBlock;
