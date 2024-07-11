"use client"
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
const Pagination = ({totalPages}:{totalPages:number}) => {
    const searchParams = useSearchParams();
    const pageArr: any[] = [];
    const pathname = usePathname();
    const { replace } = useRouter();

    for (let i = 0; i < totalPages; i++) {
        pageArr.push(i+1);
    }
    function handleClick(page:number){
        const params = new URLSearchParams(searchParams);

        params.set('page', page.toString());

        replace(`${pathname}?${params.toString()}`)
    }

    if(pageArr.length <= 1) return <></>;

    return pageArr.map((page:any) => {
        return <button key={page} onClick={()=> handleClick(page)} className="bg-slate-500 text-white p-2">{page}</button>
    })
}

export default Pagination;
