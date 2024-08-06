"use client"
import {Media} from "@/app/types/payloadTypes";
import Carousel from "react-multi-carousel";
import Image from "next/image";
import {useEffect, useState} from "react";

const responsive = {
    desktop: {
        breakpoint: {max: 3000, min: 1024},
        items: 3,
        slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
        breakpoint: {max: 1024, min: 464},
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
        breakpoint: {max: 464, min: 0},
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};

const Gallery = ({gallery}: { gallery?: { gallery_item?: number | Media | null, id?: string | null }[] | null }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "Escape":
                    setShowModal(false);
                    break;
/*                case "ArrowLeft":
                    if (showModal) {
                        setModalIndex(modalIndex - 1);
                    }
                    break;
                case "ArrowRight":
                    if (showModal) {
                        setModalIndex(modalIndex + 1);
                    }
                    break;*/
                default:
                    break;
            }
        })
    }, [showModal, modalIndex]);

    useEffect(() => {
        if (!gallery?.length) return;

        if (modalIndex >= gallery.length) setModalIndex(0);
        if (modalIndex < 0) setModalIndex(gallery.length - 1);
    }, [modalIndex, gallery?.length]);

    if (!gallery) return;

    return <div>
        <div
            className={`
            ${showModal ? "" : "hidden"}
            absolute
            inset-28
            z-[9999]
            p-0
            bg-slate-200
            bg-opacity-95
            border-slate-600
            border-2
            `}
        >
            {
                gallery[modalIndex]?.gallery_item && typeof gallery[modalIndex].gallery_item !== "number" &&
                <div className="flex h-full">
                    <button className="bg-slate-600 text-slate-950 font-bold hover:bg-slate-300 p-4" onClick={() => {
                        setModalIndex(modalIndex - 1)
                    }}>{"<"}</button>
                    <Image
                        src={`${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}${gallery[modalIndex].gallery_item?.url}`}
                        alt={gallery[modalIndex].gallery_item?.alt || ""}
                        width={gallery[modalIndex].gallery_item?.width || 0}
                        height={gallery[modalIndex].gallery_item?.height || 0}
                        className="max-h-full w-auto mx-auto self-center my-3"
                    />
                    <button className="bg-slate-600 text-slate-950 font-bold hover:bg-slate-300 p-4" onClick={() => {
                        setModalIndex(modalIndex + 1)
                    }}>{">"}</button>
                </div>

            }
            <button onClick={() => {
                setShowModal(false)
            }} className="absolute right-0 top-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold">Close
            </button>
        </div>
        <div className={`
        ${showModal ? "" : "hidden"}
        inset-0 z-[9998] bg-black opacity-50 absolute`} onClick={() => {
            setShowModal(false)
        }}/>
        <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={false} // means to render carousel on server-side.
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={5000}
            keyBoardControl={true}
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
        >
            {
                gallery.map((item, i) => {
                    if (typeof item.gallery_item !== "number" && item.gallery_item) {
                        return <Image
                            className="w-full"
                            onClick={() => {
                                setShowModal(true);
                                setModalIndex(i);
                            }}
                            src={`${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_URL}${item.gallery_item?.sizes?.thumbnail?.url}`}
                            alt={item.gallery_item?.alt || ""}
                            width={item.gallery_item?.sizes?.thumbnail?.width || 200}
                            height={item.gallery_item?.sizes?.thumbnail?.height || 200}
                            key={item.id}/>
                    }
                })}
        </Carousel>
    </div>;
}

export default Gallery;
