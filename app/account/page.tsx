"use client";

import { useEffect, useState, useRef } from "react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UploadImage from "@/app/components/uploadimage";
import { LuSparkles } from "react-icons/lu";
import { PiInfoBold } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import { SparklesPreview } from "../components/SparklesPreview";
import { IoClose } from "react-icons/io5";
import { auth } from "../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface SelectedImage {
    file: File;
    url: string;
}

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
    const [hoveringNA, setHoveringNA] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);
    const [hoveringAnalyze, setHoveringAnalyze] = useState(false);
    const [hoveringViewMore, setHoveringViewMore] = useState(false);

    const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>([]);

    // Update when result changes

    const handleNewAnalysis = () => {
        setResult(null);
        setSelectedImages([]);
        setDescription("");
        setError("");
    };

    // Define maxImages
    const maxImages = 3;

    // Food analysis states
    const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
    const [description, setDescription] = useState("");
    const [result, setResult] = useState<{ name: string; description: string; ingredients: string[]; instructions: Array<{ number: string; title: string; description: string }>; } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (result?.ingredients) {
            setCheckedIngredients(new Array(result.ingredients.length).fill(false));
        }
    }, [result]);

    const toggleIngredient = (index: number) => {
        setCheckedIngredients(prev => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
    };

    // Updated image validation
    const validateImages = (files: File[]) => {
        if (files.length === 0) return "Please upload at least one image";
        if (files.length > maxImages) return `Maximum ${maxImages} images allowed`;
        for (const file of files) {
            if (!file.type.startsWith("image/")) return "Only image files are allowed";
            // if (file.size > 5 * 1024 * 1024) return "Images must be smaller than 5MB";
        }
        return "";
    };

    const handleImagesSelected = (images: File[]) => {
        // Prevent duplicates based on name and size
        const newImages = images.filter(img => 
            !selectedImages.some(existingImg => existingImg.file.name === img.name && existingImg.file.size === img.size)
        );

        const imagesWithUrls = newImages.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));
        setSelectedImages(prev => [...prev, ...imagesWithUrls].slice(0, maxImages));

        // Clear errors if any
        const validationError = validateImages([...selectedImages.map(img => img.file), ...newImages]);
        if (!validationError) {
            setError("");
        } else {
            setError(validationError);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => {
            // Revoke the object URL to free memory
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
    };

    // Enhanced error handling
    const handleAnalyze = async () => {
        // Pass only File[] to validateImages
        const validationError = validateImages(selectedImages.map(img => img.file));
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const base64Images = await Promise.all(
                selectedImages.map((selectedImage) => convertToBase64(selectedImage.file))
            );

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch("/api/analyze-food", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    images: base64Images,
                    userDescription: description
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch {
                    errorData = { error: `HTTP Error ${response.status}: ${errorText}` };
                }
                throw new Error(errorData.error || "Analysis failed");
            }

            const data = await response.json();
            if (!data.name || !data.description) {
                throw new Error("Invalid response format from server");
            }
            setResult(data);

        } catch (err: any) {
            console.error("Analysis Error:", err);
            setError(err.name === 'AbortError' 
                ? "Request timed out" 
                : err.message
            );
        } finally {
            setLoading(false);
        }
    };

    // Improved base64 conversion
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    resolve(reader.result);
                } else {
                    reject(new Error("Failed to convert image"));
                }
            };
            reader.onerror = error => reject(error);
        });
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

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

    const handleUsernameEdit = () => {
        setIsSettings(true); // Close the settings pane
        setIsEditing(true);    // Open the edit username modal
    };

    // New state variables for username editing
    const [isEditing, setIsEditing] = useState(true);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // Handler to toggle edit mode
    const handleEditClick = () => {
        setIsEditing(false);
        setIsSettings(false);
    };

    // Handler to save the updated username
    const handleSaveClick = () => {
        // Here you can add functionality to save the username to a database or backend
        setIsEditing(true);
        localStorage.setItem("username", username);
    };

    // Handler to cancel editing
    const handleCancelClick = () => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
        setIsEditing(true);
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

    // Cleanup object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            selectedImages.forEach(image => URL.revokeObjectURL(image.url));
        };
    }, [selectedImages]);

    // Add this new state near your other state declarations
    const [showNewButton, setShowNewButton] = useState(true);
    const mainContentRef = useRef<HTMLDivElement>(null);

    const [scrapedImages, setScrapedImages] = useState<Array<{
        url: string;
        context?: string;
        alt?: string;
    }>>([]);
    const [isScraping, setIsScraping] = useState(false);
    const [scrapeError, setScrapeError] = useState("");

    useEffect(() => {
    const fetchImages = async () => {
        if (result?.name) {
            try {
                setIsScraping(true);
                setScrapeError("");
                
                // Directly call Pinterest API
                const response = await fetch(
                    `/api/scrape-images?query=${encodeURIComponent(result.name)}`
                );
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch images");
                }

                const data = await response.json();
                setScrapedImages(data.images);
                
            } catch (err) {
                console.error("Image fetch error:", err);
                setScrapeError(err instanceof Error ? err.message : "Failed to load images");
            } finally {
                setIsScraping(false);
            }
        }
    };

    fetchImages();
}, [result]);

    return (
        <div className="flex flex-col w-full relative overflow-x-hidden">
        {/* Menu Toggle Button (visible on small screens only) */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center z-30 px-[17px] py-[9px] ml-[10px] mt-[30px] rounded-[30px] custom:hidden w-fit absolute gap-[10px] transition-all duration-100 border-[0px] border-white ${
                    menuOpen 
                    ? "backdrop-blur-0 bg-opacity-0 border-opacity-0" 
                    : "backdrop-blur-[10px] bg-opacity-[.3] border-opacity-100"
                }`}
                >
                <div className="flex flex-col gap-[7px]">
                    <div
                        className={`w-[33px] h-[4px] bg-white rounded-[30px] transition-transform duration-300 ${
                            menuOpen ? "rotate-45 translate-y-[11px]" : ""
                        }`}
                    ></div>

                    <div className={`w-[50%] h-[4px] bg-white rounded-[30px] rotate-[15deg] transition-opacity duration-300 ${
                            menuOpen ? "opacity-0" : ""
                        }`}></div>

                    <div className={`w-[33px] h-[4px] bg-white rounded-[30px] transition-transform duration-300 ${
                            menuOpen ? "-rotate-45 -translate-y-[11px]" : ""
                        }`}></div>
                </div>
                <p className={`font-extrabold text-[1.2rem] transition-opacity duration-200 ${
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
            <p className="font-extrabold mt-[40px] text-[1.5rem] mb-[20px] max-custom:mt-[35px]">
                Your Recipes
            </p>
            <div className="flex justify-end">
                <input type="text"  className="w-[300px] mb-[20px] h-[50px] border-[2px] border-[#ccc] rounded-[30px] pl-[15px] font-extrabold bg-transparent outline-none" placeholder="Search"/>
                <span className="absolute mr-[20px] mt-[12px] text-[1.6rem] font-extrabold"><IoSearchOutline /></span>
            </div>
            <div className="flex flex-col h-[100dvh] w-[100%] items-center gap-[20px] flex-1 overflow-y-auto">
                <button className="flex items-center min-h-[100px] w-[90%] border-[2px] border-[#ccc] rounded-[30px]">
                    <div className="h-[70px] min-w-[70px] bg-green-400 ml-[13px] rounded-[20px]" />
                        <div className="flex flex-col ml-[13px] items-start">
                        <p className="font-extrabold mt-[0px] text-[1.2rem]">
                        Recipe title
                        </p>
                        <p className="text-[.9rem]">Lorem, ipsum dolor</p>
                    </div>
                </button>
                <button className="flex items-center min-h-[100px] w-[90%] border-[2px] border-[#ccc] rounded-[30px]">
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
                <div className="flex flex-col items-center w-[190px] h-fit rounded-[40px] overflow-hidden backdrop-blur-[5px] bg-opacity-[.4]" onClick={(e) => e.stopPropagation()}>
                    <div className="flex w-[100%] items-center justify-center h-fit pt-[25px] pb-[10px] gap-[15px]">
                        <button className={`w-[23px] h-[23px] bg-[#0a90ff] mb-[0px] rounded-[50px] ${activeAccent === "blue" ? "ring-2 ring-white" : ""}`} onClick={() => setActiveAccent("blue")}></button>
                        <button className={`w-[23px] h-[23px] bg-[#1eab5d] mb-[0px] rounded-[50px] ${activeAccent === "green" ? "ring-2 ring-white" : ""}`} onClick={() => setActiveAccent('green')}></button>
                        <button className={`w-[23px] h-[23px] bg-[#db5415] mb-[0px] rounded-[50px] ${activeAccent === "orange" ? "ring-2 ring-white" : ""}`} onClick={() => setActiveAccent('orange')}></button>
                        <button className={`w-[23px] h-[23px] bg-[#ff0988] mb-[0px] rounded-[50px] ${activeAccent === "pink" ? "ring-2 ring-white" : ""}`} onClick={() => setActiveAccent('pink')}></button>
                    </div>
                    <button className="h-fit px-[25px] rounded-[30px] py-[15px] mb-[10px] hover:bg-white hover:bg-opacity-[.2] " onClick={handleEditClick}>
                        <p className="font-extrabold">Edit Username</p>
                    </button>
                </div>
            </div>
            )}
            {isEditing && (
            <button className="flex items-center border-[1.5px] h-fit py-[10px] w-fit rounded-[30px] mt-[15px] mb-[30px] px-[20px] gap-[10px] hover:bg-white hover:bg-opacity-[.1]" 
            onClick={handleUsernameEdit}
            >
                        <p className="font-extrabold">{username}</p>
                    </button>
            )}
            <div className="flex flex-col items-center w-[90%]">
                    {!isEditing && (
                        <div className="flex flex-col items-center w-[80%] mb-[20px] gap-[10px]">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full mb-2 h-[50px] border-[2px] border-[#ccc] rounded-[30px] pl-[0px] font-extrabold bg-transparent outline-none text-center "
                            />
                            <div className="flex gap-4">
                                <button
                                    className="font-extrabold w-[100px] py-2 border-[1.5px] rounded-[30px] hover:bg-white hover:bg-opacity-[.2]"
                                    onClick={handleSaveClick}
                                >
                                    Save
                                </button>
                                <button
                                    className="font-extrabold w-[100px] py-2 border-[1.5px] border-red-500 rounded-[30px] text-red-500 hover:bg-red-500 hover:bg-opacity-[.2]"
                                    onClick={handleCancelClick}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto items-center justify-start w-full h-[100dvh]">
                {!result ? (
                <div className="relative flex flex-col items-center self-center mt-auto mb-auto max-w-[90%] gap-[30px] pt-[90px] pb-[20px]">
                    {/* Loading Popup */}
                    <div className="flex justify-center items-center absolute w-[451px] max-w-[100%] h-[275px] max-h-[100%] ml-[.1px] mb-[228px] rounded-[46px] z-[10] bg-none my-dashed-border-sec pointer-events-none">
                    </div>
                    
                    {loading && selectedImages.length > 0 && (
                        <div className="flex justify-center items-center absolute w-[451px] max-w-[100%] h-[275px] max-h-[100%] ml-[.1px] mb-[228px] rounded-[46px] bg-black backdrop-blur-[5px] bg-opacity-[.4] overflow-hidden z-[5]">
                        <p className={`absolute font-extrabold text-[1.8rem] ${getAccentClass()}`}>Analyzing</p>
                            <div className={`w-[414px] max-mobile2:max-w-[90%] h-[239px] max-h-[100%] rounded-[28px] blur-[17px] ${ACCENT_LOADING_CLASSES[activeAccent]}`}
                            style={{ backgroundClip: "padding-box" }}>
                            </div>
                            <span className="absolute"><SparklesPreview/></span>
                        </div>
                    )}
                {/* Upload Image */}
                    <UploadImage maxImages={3} onImagesSelected={handleImagesSelected} accent={activeAccent} onRemoveImage={removeImage} selectedImages={selectedImages}/>
                    <div className="flex max-w-[100%] justify-end">
                        <textarea className="flex outline-none rounded-[35px] bg-[#000000] bg-opacity-[.4] w-[450px] h-[120px] border-[1.5px] font-extrabold py-[15px] px-[20px] resize-none" placeholder="Extra Details (Optional)"/>
                        <button className="absolute text-[1.4rem] mr-[17px] self-end mb-[17px]" onClick={() => setIsPopupOpen(true)}><PiInfoBold /></button>
                    </div>
                    {isPopupOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-[.5] z-50" onClick={() => setIsPopupOpen(false)}>
                            <div className="bg-black border-[2px] bg-opacity-20 text-white rounded-[40px] p-6 relative w-11/12 max-w-md backdrop-blur-[30px]" onClick={(e) => e.stopPropagation()}>
                                {/* Close Button */}
                                <button 
                                    className="absolute top-[30px] right-[45px]"
                                    onClick={() => setIsPopupOpen(false)}
                                >
                                    <div className="absolute w-[23px] h-[4px] bg-white rounded-[30px] rotate-[45deg]"></div>
                                    <div className="absolute w-[23px] h-[4px] bg-white rounded-[30px] rotate-[-45deg]"></div>
                                </button>
                                {/* Popup Content */}
                                <h2 className="text-[1.5rem] font-bold mb-[10px]">Description Box</h2>
                                <p className="">
                                    This is where you add a little more information (If you have any) about the the beverage or meal, like name, where you got it from or any information that would be useful.
                                </p>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="absolute mt-[270px] py-[10px] pl-[20px] pr-[10px] rounded-[30px] flex items-center gap-[7px]">
                            <p className="text-[#FF0049] text-[.9rem]">{error}</p>
                            {/* <button
                                onClick={() => setError("")}
                                className="text-red-500 hover:text-red-400"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="#FF0049">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button> */}
                        </div>
                    )}
                    <button onMouseEnter={() => setHoveringAnalyze(true)}
                            onMouseLeave={() => setHoveringAnalyze(false)} 
                            className={`test flex items-center border-[1.5px] text-white font-bold py-[10px] pl-[30px] pr-[35px] rounded-full gap-[10px] ${hoveringPin ? ACCENT_BG_COLORS[activeAccent] : "bg-transparent"} ${hoveringAnalyze ? "bg-opacity-[.4]" : ""}`} onClick={handleAnalyze}><span className={"text-[1.5rem]"} ><LuSparkles /></span>Analyze</button>
                </div>
                    ) : (
                <div className="flex flex-col self-center items-center justify-center w-fit max-w-[90%] gap-[30px] my-[100px]">
                    <div className="w-full flex justify-end mt-[-62px]">
                        <button 
                            onMouseEnter={() => setHoveringNA(true)}
                            onMouseLeave={() => setHoveringNA(false)}
                            onClick={handleNewAnalysis}
                            className={`text-[1.2rem] top-[0px] left-[100%] w-fit rounded-[30px] font-semibold flex items-center justify-center gap-2 border-[0px] transition-all z-10 backdrop-blur-[10px] bg-opacity-[.3] transition-opacity duration-300
                                ${getAccentClass()}`}
                                >
                            {/* <LuSparkles className="text-[1.2rem] drop-shadow-[0_0px_2px_rgba(255,255,255,0.8)]" /> */}
                            New scan
                        </button>
                    </div>
                    <div className="h-fit max-w-[535px] w-[100%] rounded-[50px] self-start">
                        <p className="text-[3rem] leading-[60px] font-extrabold">{result.name}</p>
                        <p className="mt-[20px]">{result.description}</p>
                    </div>
                    <div className="max-w-[900px] w-[100%] h-fit rounded-[50px] flex flex-col justify-center items-center gap-[30px] flex-wrap">
                        <div className="flex justify-end items-end h-[350px] w-[100%] border-[0px] rounded-[0px] backdrop-blur-[5px] bg-opacity-[.4] overflow-hidden">
                            <div ref={scrollRef} className="flex w-[100%] h-[100%] pt-[15px] gap-[20px] overflow-scroll scrollbar-hide">
                                {isScraping ? (
                                    Array.from({ length: 6 }).map((_, index) => (
                                        <div 
                                            key={`skeleton-${index}`}
                                            className="flex-shrink-0 w-64 h-64 rounded-3xl bg-gray-800 animate-pulse"
                                        />
                                    ))
                                ) : scrapeError ? (
                                    <div className="flex items-center justify-center w-full h-full text-red-400">
                                        {scrapeError}
                                    </div>
                                ) : (
                                    scrapedImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className="flex-shrink-0 group relative w-64 h-64 rounded-3xl overflow-hidden transition-transform hover:scale-95"
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.alt || `${result?.name} example`}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = "/fallback-food-image.jpg";
                                                    target.classList.add("object-contain");
                                                    target.classList.add("p-2");
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
                                        </div>
                                    ))
                                )}
                            </div>
                            <a 
                                href={`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(result.name)}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onMouseEnter={() => setHoveringPin(true)}
                                onMouseLeave={() => setHoveringPin(false)}
                                className={`
                                    flex absolute mb-[20px] mr-[0px] items-center 
                                    border-[1.5px] rounded-[30px] w-fit px-[15px] py-[10px] gap-[10px] h-fit 
                                    backdrop-blur-[10px] bg-opacity-[.4] transition-colors
                                    ${hoveringPin ? getAccentClass() : "text-white border-white"}
                                `}
                                >
                                <Image src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/pinterest-logo.svg" alt="Pinterest Logo" width={21} height={21} />
                                <p className="font-bold">View more</p>
                                </a>
                        </div>
                    </div>
                    <div className="flex flex-wrap flex-col max-whenwrap:flex-row max-w-[100%] w-fit h-fit justify-center items-center gap-[30px] max-whenwrap:gap-[50px]">
                        <div className="flex flex-wrap gap-[30px] max-whenwrap:gap-[50px] justify-center max-w-[100%]">
                            <div className="flex flex-col items-center max-h-[450px] h-[100%] w-[435px] rounded-[50px] border-[1.5px] overflow-y-scroll scrollbar-hide bg-black backdrop-blur-[5px] bg-opacity-[.4]">
                                <div className="flex justify-center sticky top-0 w-full bg-[#050608] pb-[5px]">
                                    <p className="text-[2rem] font-extrabold mt-[20px]">Ingredients</p>
                                </div>
                                <div className="flex flex-col px-[30px] pb-[30px] self-start">
                                    <div className="flex flex-col gap-[25px] mt-[10px]">
                                        {result?.ingredients?.map((ingredient, index) => (
                                            <div className="flex items-center gap-[20px]" key={index}>
                                                <button
                                                    onClick={() => toggleIngredient(index)}
                                                    className={`flex justify-center items-center h-[30px] min-w-[30px] bg-transparent 
                                                        rounded-[12px] border-2 ${checkedIngredients[index] ? ACCENT_BG_COLORS[activeAccent] : "border-white"}`}>
                                                    {checkedIngredients[index] && (
                                                        <div className={`h-[13px] w-[13px] rounded-[5px] ${ACCENT_BG_COLORS[activeAccent]}`}></div>
                                                    )}
                                                </button>
                                                <p className={`inline-block ${checkedIngredients[index] ? `line-through ${ACCENT_DECORATION_COLORS[activeAccent]} decoration-[3px]` : ''}`} style={{ whiteSpace: "pre-line" }}>
                                                    {ingredient}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center max-h-[450px] h-fit w-[435px] rounded-[50px] border-[1.5px] overflow-y-scroll scrollbar-hide bg-black backdrop-blur-[5px] bg-opacity-[.4]">
                                <div className="flex justify-center sticky top-0 w-full bg-[#050608] pb-[5px]">
                                    <p className="text-[2rem] font-extrabold mt-[20px]">Instructions</p>
                                </div>
                                <div className="flex flex-col px-[30px] pb-[25px] justify-center">
                                    {result?.instructions?.map((step, index) => (
                                    <div className="flex flex-col gap-[0px]" key={index}>
                                        <p className="font-bold mt-[10px]">
                                            <span className={`${ACCENT_DECORATION_COLORS[activeAccent]}`}>
                                                {step.number}.
                                            </span>
                                            <span className="ml-2">{step.title}</span>
                                        </p>
                                        <p className="ml-[28px] mb-[20px]">{step.description}</p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center mt-[0px]">
                            <a 
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent('how to make ' + result.name)}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onMouseEnter={() => setHoveringYT(true)}
                                onMouseLeave={() => setHoveringYT(false)}
                                className={`
                                    flex items-center border-[1.5px] rounded-[30px] w-fit px-[15px] py-[10px] gap-[10px] h-fit
                                    mb-[0px] transition-colors duration-300
                                    ${hoveringYT ? getAccentClass() : "text-white border-white"}
                                `}
                                >
                                <Image src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/youtube-logo.svg" alt="Youtube Logo" width={25} height={25}/>
                                <p className="font-bold">Search how to on Youtube</p>
                            </a>
                        </div>
                    </div>
                </div>
                )}
                {/* // <p className="text-white text-[.7rem] self-center font-extrabold">© Insta Recipe 2025</p>  */}
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