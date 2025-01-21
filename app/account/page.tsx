"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UploadImage from "@/app/components/uploadimage";
import { LuSparkles } from "react-icons/lu";
import { PiInfoBold } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { auth } from "../../firebase"; // Adjust path as needed

type AccentColor = "blue" | "green" | "orange" | "pink"

const ACCENT_CLASSES: Record<AccentColor, string> = {
    blue: 'imageshine-blue',
    green: 'imageshine-green',
    orange: 'imageshine-orange',
    pink: 'imageshine-pink',
    };

const ACCENT_BG_COLORS: Record<AccentColor, string> = {
    blue: "bg-[#0a90ff]",
    green: "bg-[#1eab5d]",
    orange: "bg-[#db5415]",
    pink: "bg-[#ff0988]",
    };

const ACCENT_BG_HOVER: Record<AccentColor, string> = {
    blue: "hover:bg-[#0a90ff]",
    green: "hover:bg-[#1eab5d]",
    orange: "hover:bg-[#db5415]",
    pink: "hover:bg-[#ff0988]",
    };

const ACCENT_LOADING_CLASSES: Record<AccentColor, string> = {
    blue: "loading-blue",
    green: "loading-green",
    orange: "loading-orange",
    pink: "loading-pink",
    };

    // Solid decoration colors keyed by accent
const ACCENT_DECORATION_COLORS: Record<AccentColor, string> = {
    blue: "decoration-[#0a90ff]",
    green: "decoration-[#1eab5d]",
    orange: "decoration-[#db5415]",
    pink: "decoration-[#ff0988]",
    };

export default function AccountPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSettings, setIsSettings] = useState(false);
    const [isIngredientChecked, setisIngredientChecked] = useState(false)
    const [activeAccent, setActiveAccent] = useState<AccentColor>("blue");
    const [hoveringPin, setHoveringPin] = useState(false);
    const [hoveringYT, setHoveringYT] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    // Check the current scroll position and the container’s total scroll size.
    function handleScroll() {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    // Show the left fade only if we have scrolled away from the extreme left:
    setShowLeft(scrollLeft > 0);

    // Show the right fade only if we haven’t reached the extreme right:
    setShowRight(scrollLeft + clientWidth < scrollWidth);
    }

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        // Run once to set the initial showLeft/showRight states
        handleScroll();

        // Attach scroll listener
        el.addEventListener("scroll", handleScroll);
        return () => {
            el.removeEventListener("scroll", handleScroll);
        };
    }, []);

        // This function gets the correct class name based on the accent key
        const getAccentClass = () => {
            return ACCENT_CLASSES[activeAccent] || ACCENT_CLASSES.blue;
        };

    const router = useRouter();

    // Handle selected images from the UploadImage component
    const handleImagesSelected = (images: File[]) => {
        console.log("Selected Images:", images);
    };

    // Redirect to homepage if user is not logged in
    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //     if (!user) {
    //         router.push("/");
    //     }
    //     });
    //     return () => unsubscribe();
    // }, [router]);

    return (
        <div className="flex flex-col min-h-[100dvh] w-full relative overflow-x-hidden">
        {/* Menu Toggle Button (visible on small screens only) */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center z-30 px-[17px] py-[9px] ml-[10px] mt-[15px] rounded-[30px] custom:hidden w-fit absolute gap-[10px] backdrop-blur-[5px] bg-opacity-[.4] border-[2px] border-white transition-opacity duration-300 ${
                    menuOpen ? "border-opacity-0" : "border-opacity-100"
                }`}>
                <div className="flex flex-col gap-[7px]">
                    <div
                        className={`w-[33px] h-[5px] bg-white rounded-[30px] transition-transform duration-300 ${
                            menuOpen ? "rotate-45 translate-y-[12px]" : ""
                        }`}
                    ></div>

                    <div className={`w-[50%] h-[5px] bg-white rounded-[30px] rotate-[15deg] transition-opacity duration-300 ${
                            menuOpen ? "opacity-0" : ""
                        }`}></div>

                    <div className={`w-[33px] h-[5px] bg-white rounded-[30px] transition-transform duration-300 ${
                            menuOpen ? "-rotate-45 -translate-y-[12px]" : ""
                        }`}></div>
                </div>
                <p className={`font-extrabold text-[1.2rem] transition-opacity duration-300 ${
                        menuOpen ? "opacity-0" : "opacity-100"
                    }`}>Menu</p>
            </button>

        <div className="flex h-[100dvh]">
            {/* Sidebar/Menu */}
            <div 
            className={`${
                menuOpen ? "flex" : "hidden"
            } custom:flex max-custom:absolute flex-col items-center h-[100dvh] min-w-[420px] max-custom:min-w-[420px] max-mobile:min-w-[100vw] bg-[#000000] backdrop-blur-[40px] bg-opacity-[.6] z-20 sticky top-0`}
            >
            <p className="font-extrabold mt-[40px] text-[1.5rem] mb-[20px] max-custom:mt-[70px]">
                Your Recipes
            </p>
            <div className="flex justify-end">
                <input type="text"  className="w-[300px] mb-[30px] h-[50px] border-[2px] border-[#ccc] rounded-[30px] pl-[15px] font-extrabold bg-transparent outline-none" placeholder="Search"/>
                <span className="absolute mr-[20px] mt-[12px] text-[1.6rem] font-extrabold"><IoSearchOutline /></span>
            </div>
            <div className="flex flex-col h-[100dvh] w-[100%] items-center gap-[30px] flex-1 overflow-y-auto">
                <button className="flex items-center h-[100px] w-[90%] border-[2px] border-[#ccc] rounded-[30px]">
                    <div className="h-[70px] min-w-[70px] bg-green-400 ml-[13px] rounded-[20px]" />
                        <div className="flex flex-col ml-[13px] items-start">
                        <p className="font-extrabold mt-[0px] text-[1.2rem]">
                        Recipe title
                        </p>
                        <p className="text-[.9rem]">Lorem, ipsum dolor</p>
                    </div>
                </button>
            </div>
            {isSettings && (
            <div className="fixed inset-0 flex items-end justify-center mb-[100px]" onClick={() => setIsSettings(false)}>
                <div className="flex flex-col items-center w-[190px] h-fit border-[1.5px] rounded-[40px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                    <button className="h-fit px-[25px] rounded-[30px] py-[15px] mt-[10px] hover:bg-white hover:bg-opacity-[.1]">
                        <p className="font-extrabold">Edit Username</p>
                    </button>
                    {/* <div className="bg-[#ccc] w-[100%] h-[1.5px] rounded-full bg-opacity-[.1] mb-[0px]"></div> */}
                    <div className="flex w-[100%] items-center justify-center h-[30px] py-[25px] gap-[15px]">
                        <button className={`w-[23px] h-[23px] bg-[#0a90ff] mb-[0px] rounded-[50px] ${activeAccent === "blue" ? "ring-2 ring-white" : ""}`} onClick={() => setActiveAccent("blue")}></button>
                        <button className={`w-[23px] h-[23px] bg-[#1eab5d] mb-[0px] rounded-[50px] ${activeAccent === "green" ? "ring-2 ring-white" : ""}`} onClick={() => setActiveAccent('green')}></button>
                        <button className={`w-[23px] h-[23px] bg-[#db5415] mb-[0px] rounded-[50px] ${activeAccent === "orange" ? "ring-2 ring-white" : ""}`} onClick={() => setActiveAccent('orange')}></button>
                        <button className={`w-[23px] h-[23px] bg-[#ff0988] mb-[0px] rounded-[50px] ${activeAccent === "pink" ? "ring-2 ring-white" : ""}`} onClick={() => setActiveAccent('pink')}></button>
                    </div>
                    {/* <div className="bg-[#ccc] w-[100%] h-[1.5px] rounded-full bg-opacity-[.1]"></div> */}
                    <button className="h-fit px-[15px] rounded-[30px] py-[15px] mb-[10px] hover:bg-white hover:bg-opacity-[.1]">
                        <p className="font-extrabold">Edit Profile Image</p>
                    </button>
                </div>
            </div>
            )}
                <button className="flex items-center border-[1.5px] h-fit py-[5px] w-fit rounded-[30px] mb-[30px] pl-[6px] pr-[15px] gap-[10px]" onClick={() => setIsSettings(!isSettings)}>
                    <div className="h-[35px] w-[35px] rounded-[50px] bg-white overflow-hidden">
                    <Image src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/shaq-pfp.jpg" alt="" height={100} width={100} />
                    </div>
                    <p className="font-extrabold">twizshaq</p>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto items-center justify-start w-full">
                <div className="flex flex-col items-center justify-center max-mobile:mt-[60px] h-[100dvh] max-w-[90%] gap-[30px]">
                    {/* Loading Popup */}
                    <div className="flex justify-center items-center absolute w-[451px] max-w-[90.07%] h-[275px] max-h-[100%] ml-[.1px] mb-[228px] rounded-[46px] bg-transparent my-dashed-border-sec">
                    </div>
                    {isLoading && (
                        <div className="flex justify-center items-center absolute w-[451px] max-w-[90.07%] h-[275px] max-h-[100%] ml-[.1px] mb-[228px] rounded-[46px] bg-black backdrop-blur-[5px] bg-opacity-[.4] z-[6] overflow-hidden">
                            <p className={`absolute font-extrabold text-[1.8rem] ${getAccentClass()}`}>Analyzing...</p>
                            <div className={`w-[414px] max-mobile2:max-w-[90%] h-[239px] max-h-[100%] rounded-[28px] blur-[17px] ${ACCENT_LOADING_CLASSES[activeAccent]}`}
                                style={{
                                backgroundClip: "padding-box",
                                }}>
                            </div>
                        </div>
                    )}
                {/* Upload Image */}
                    <UploadImage maxImages={3} onImagesSelected={handleImagesSelected} accent={activeAccent}/>
                    <div className="flex max-w-[100%] justify-end">
                        <textarea className="flex outline-none rounded-[35px] bg-[#000000] bg-opacity-[.4] w-[450px] h-[120px] border-[2px] font-extrabold py-[15px] px-[20px] resize-none" placeholder="Extra Details (Optional)"/>
                        <button className="absolute text-[1.4rem] mr-[17px] self-end mb-[17px]" onClick={() => setIsPopupOpen(true)}><PiInfoBold /></button>
                    </div>
                    <button onMouseEnter={() => setHoveringPin(true)}
                            onMouseLeave={() => setHoveringPin(false)} 
                            className={`test flex items-center border-[2px] text-white font-bold py-[10px] pl-[30px] pr-[35px] rounded-full gap-[10px] ${hoveringPin ? ACCENT_BG_COLORS[activeAccent] : "bg-transparent"} ${hoveringPin ? "bg-opacity-[.4]" : ""}`} onClick={() => setIsLoading(true)}><span className={"text-[1.5rem]"} ><LuSparkles /></span>Analyze</button>
                </div>
                {/* Popup Component */}
                    {isPopupOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-[.5] z-50" onClick={() => setIsPopupOpen(false)}>
                            <div className="bg-black border-[2px] bg-opacity-20 text-white backdrop-blur-[20px] rounded-[40px] p-6 relative w-11/12 max-w-md" onClick={(e) => e.stopPropagation()}>
                                {/* Close Button */}
                                <button 
                                    className="absolute top-[30px] right-[45px] text-gray-500 hover:text-gray-700"
                                    onClick={() => setIsPopupOpen(false)}
                                >
                                    <div className="absolute w-[23px] h-[4px] bg-white rounded-[30px] rotate-[45deg]"></div>
                                    <div className="absolute w-[23px] h-[4px] bg-white rounded-[30px] rotate-[-45deg]"></div>
                                </button>
                                {/* Popup Content */}
                                <h2 className="text-[1.5rem] font-bold mb-[10px]">Description Box</h2>
                                <p className="">
                                    This is where you enter a little more information (If you have any) about the the beverage or meal, like name, where you got it from or any information that would be useful.
                                </p>
                            </div>
                        </div>
                    )}
                {/* <div className="flex flex-col self-center items-center justify-center w-fit max-w-[90%] gap-[30px] my-[100px]">
                    <div className=" h-fit max-w-[535px] w-[100%] rounded-[50px] self-start">
                        <p className="text-[3rem] font-extrabold">Recipe Title</p>
                        <p className="">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta aut adipisci magnam animi? Velit amet voluptates magni eius culpa impedit consequuntur possimus eum, sunt excepturi sint explicabo quod tempore, optio dicta quas vero tempora illum reiciendis deleniti? Corporis labore rerum autem deserunt maiores eligendi architecto ipsam, ullam consequuntur impedit perspiciatis!</p>
                    </div>
                    <div className="max-w-[900px] w-[100%] h-fit rounded-[50px] flex flex-col justify-center items-center gap-[30px] flex-wrap">
                        <div className="flex justify-end items-end h-[350px] w-[100%] border-[0px] rounded-[0px] backdrop-blur-[5px] bg-opacity-[.4] overflow-hidden">
                            <div ref={scrollRef} className="flex w-[100%] h-[100%] pt-[15px] gap-[20px] overflow-scroll scrollbar-hide">
                                <div
                                    className={`
                                        absolute h-[280px] top-[0px] left-[-20px] w-[35px] blur-[5px]
                                        bg-[var(--background)] pointer-events-none
                                        transition-opacity duration-200
                                        ${showLeft ? "opacity-100" : "opacity-0"}
                                    `}
                                    ></div>
                                <div
                                    className={`
                                        absolute h-[280px] top-[0px] right-[-20px] w-[35px] blur-[5px]
                                        bg-[var(--background)] pointer-events-none
                                        transition-opacity duration-200
                                        ${showRight ? "opacity-100" : "opacity-0"}
                                    `}
                                    ></div>
                                <div className="flex min-w-[250px] h-[250px] rounded-[30px] overflow-hidden">
                                    <Image src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/food1.jpeg" alt="" className="object-cover"/>
                                </div>
                                <div className="flex min-w-[250px] h-[250px] rounded-[30px] overflow-hidden">
                                    <Image src={food1} alt="" className="object-cover"/>
                                </div>
                                <div className="flex min-w-[250px] h-[250px] rounded-[30px] overflow-hidden">
                                    <Image src={food1} alt="" className="object-cover"/>
                                </div>
                                <div className="flex min-w-[250px] h-[250px] rounded-[30px] overflow-hidden">
                                    <Image src={food1} alt="" className="object-cover"/>
                                </div>
                                <div className="flex min-w-[250px] h-[250px] rounded-[30px] overflow-hidden">
                                    <Image src={food1} alt="" className="object-cover"/>
                                </div>
                                <div className="flex min-w-[250px] h-[250px] rounded-[30px] overflow-hidden">
                                    <Image src={food1} alt="" className="object-cover"/>
                                </div>
                            </div>
                            <button onMouseEnter={() => setHoveringPin(true)}
                                    onMouseLeave={() => setHoveringPin(false)}
                                    className={`
                                        flex absolute mb-[20px] mr-[0px] items-center 
                                        border-[1.5px] rounded-[30px] w-fit px-[15px] py-[10px] gap-[10px] h-fit 
                                        backdrop-blur-[10px] bg-opacity-[.4] transition-colors duration-300
                                        ${hoveringPin ? getAccentClass() : "text-white border-white"}
                                    `}>
                                <Image src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/pinterest-logo.svg" alt="Pinterst Logo" width={21} height={21} />
                                <p className="font-bold">View more</p>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-wrap flex-col max-whenwrap:flex-row max-w-[100%] w-fit h-fit justify-center items-center gap-[30px] max-whenwrap:gap-[50px]">
                        <div className="flex flex-wrap gap-[30px] max-whenwrap:gap-[50px] justify-center max-w-[100%]">
                            <div className="flex flex-col items-center max-h-[450px] h-[100%] w-[435px] rounded-[50px] border-[1.5px] overflow-y-scroll scrollbar-hide bg-black backdrop-blur-[5px] bg-opacity-[.4]">
                                <div className="flex justify-center sticky top-0 w-full bg-[#0a0b0e] pb-[5px]">
                                    <p className="text-[2rem] font-extrabold mt-[20px]">Ingredients</p>
                                </div>
                                <div className="flex flex-col px-[30px] pb-[30px] justify-center">
                                    <div className="flex flex-col gap-[25px] mt-[0px]">
                                        <div className="flex items-center gap-[20px]">
                                            <button
                                                className={`flex justify-center items-center h-[30px] min-w-[30px] bg-transparent 
                                                rounded-[10px] border-2 ${isIngredientChecked ? ACCENT_BG_COLORS[activeAccent] : "border-white"}`}
                                                onClick={() => setisIngredientChecked((prev) => !prev)}
                                            >
                                                {isIngredientChecked && (
                                                <div className={`h-[13px] w-[13px] rounded-[3px] ingredientchecked ${ACCENT_BG_COLORS[activeAccent]}`}></div>
                                                )}
                                            </button>
                                            <p className={`inline-block ${isIngredientChecked ? `line-through decoration-[3px] ${ACCENT_DECORATION_COLORS[activeAccent]}`: ""}`}>
                                                Lorem ipsum dolor sit amet consectetur
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center max-h-[450px] h-fit w-[435px] rounded-[50px] border-[1.5px] overflow-y-scroll scrollbar-hide bg-black backdrop-blur-[5px] bg-opacity-[.4]">
                                <div className="flex justify-center sticky top-0 w-full bg-[#0a0b0e] pb-[5px]">
                                    <p className="text-[2rem] font-extrabold mt-[20px]">Instructions</p>
                                </div>
                                <div className="flex flex-col px-[30px] pb-[30px] justify-center">
                                    <div className="flex flex-col gap-[25px] mt-[3px]">
                                        <div className="flex flex-col items-center gap-[20px]">
                                            <p>Lorem ipsum dolor sit amet</p>
                                            <p>Lorem ipsum dolor sit amet consectetur</p>
                                            <p>Lorem ipsum dolor amet consectetur</p>
                                            <p>Lorem ipsum dolor sit amet consectetur</p>
                                            <p>Lorem ipsum dolor sit amet consectetur</p>
                                            <p>dolor sit amet consectetur</p>
                                            <p>Lorem ipsum dolor sit amet</p>
                                            <p>Lorem ipsum dolor sit amet consectetur</p>
                                            <p>Lorem ipsum dolor amet consectetur</p>
                                            <p>Lorem ipsum dolor sit amet consectetur</p>
                                            <p>Lorem ipsum dolor sit amet consectetur</p>
                                            <p>dolor sit amet consectetur</p>
                                            <p>Lorem ipsum dolor sit amet</p>
                                            <p>Lorem ipsum dolor sit amet consectetur</p>
                                            <p>Lorem ipsum dolor amet consectetur</p>
                                            <p>Lorem ipsum dolor sit amet consectetur</p>
                                            <p>Lorem ipsum dolor sit amet consectetur</p>
                                            <p>dolor sit amet consectetur</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center mt-[0px]">
                            <button onMouseEnter={() => setHoveringYT(true)}
                                    onMouseLeave={() => setHoveringYT(false)}
                                    className={`
                                        flex items-center border-[1.5px] rounded-[30px] w-fit px-[15px] py-[10px] gap-[10px] h-fit 
                                        mb-[0px] transition-colors duration-300
                                        ${hoveringYT ? getAccentClass() : "text-white border-white"}
                                    `}>
                                <Image src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/youtube-logo.svg" alt="Youtube Logo" width={25} height={25}/>
                                <p className="font-bold">Search how to on Youtube</p>
                            </button>
                        </div>
                    </div>
                </div> */}
                {/* <p className="text-white text-[.7rem] self-center font-extrabold">© Insta Recipe 2025</p> */}
            </div>
        </div>
        {/* <p className="text-white text-[.7rem] self-center font-extrabold mb-[10px]">© Insta Recipe 2025</p> */}
        {/* // Optional Logged-in Info / Logout: */}
        {/* <h1 className="text-4xl font-bold">Welcome to Your Account</h1>
            <p className="mt-4 text-lg">You're successfully logged in!</p>
            <button onClick={() => auth.signOut()} className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg">Log Out</button> */}
        </div>
    );
}