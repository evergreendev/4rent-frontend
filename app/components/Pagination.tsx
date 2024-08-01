"use client"
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

const Pagination = ({totalPages}: { totalPages: number }) => {
    const searchParams = useSearchParams();
    const currPage = searchParams.get("page") || "1";
    const pageArr: any[] = [];
    const pathname = usePathname();
    const {replace} = useRouter();

    for (let i = 0; i < totalPages; i++) {
        pageArr.push((i + 1).toString());
    }

    function handleClick(page: number) {
        const params = new URLSearchParams(searchParams);

        params.set('page', page.toString());

        replace(`${pathname}?${params.toString()}`)
    }

    if (pageArr.length <= 1) return <></>;

    const buttonArr = pageArr.map((page: any) => {
        return <button key={page} onClick={() => handleClick(page)}
                       className={`bg-slate-500 text-white p-2
                       ${currPage === page ? "bg-slate-800" : ""}
                       `}>{page}</button>
    })

    return <div>
        <button className="pr-2" onClick={() => handleClick(1)}>{
            currPage === "1" ? <span className="font-bold">First</span> : "First"
        }</button>
        {
            currPage !== "1" &&
            <button className="px-1" onClick={() => handleClick(Math.max((parseInt(currPage) - 1), 1))}>{"<"}</button>
        }
        {buttonArr}
        {
            parseInt(currPage) !== totalPages &&
            <button className="px-1"
                    onClick={() => handleClick(Math.max((parseInt(currPage) + 1), totalPages))}>{">"}</button>
        }
        <button className="pl-2" onClick={() => handleClick(totalPages)}>{
            parseInt(currPage) === totalPages  ? <span className="font-bold">Last</span> : "Last"
        }</button>
    </div>;
}

export default Pagination;
