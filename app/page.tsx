"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../firebase"; // Adjust path as needed
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import dynamic from "next/dynamic";

const AnalyticsLoader = dynamic(() => import("@/app/components/analytics-setup"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User logged in:", user);

      // Redirect to account page after successful login
      router.push("/account");
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };
  const [activeTab, setActiveTab] = useState("Ingredients");

  const ingredients = [
    "200g (7 oz) spaghetti or any pasta of choice",
    "2 tablespoons unsalted butter",
    "2 cloves garlic, minced",
    "1/4 teaspoon red chili flakes (optional)",
    "Salt and pepper, to taste",
    "Fresh parsley or grated Parmesan (optional garnish)",
  ];

  const instructions = [
    "1. Cook the pasta in salted boiling water according to the package instructions. Reserve 1/4 cup of pasta water before draining.",
    "2. In a pan, melt the butter over medium heat. Add the minced garlic and sauté for 1-2 minutes until fragrant (but not browned).",
    "3. Add the red chili flakes (if using) and stir briefly.",
    "4. Toss the cooked pasta in the pan with the garlic butter. Add a splash of the reserved pasta water to coat the pasta evenly.",
    "5. Season with salt and pepper to taste.",
    "6. Serve hot, garnished with parsley or Parmesan if desired.",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh]">
      <AnalyticsLoader />
      <div className="flex flex-col items-center max-w-[90%] gap-[30px] mt-[0px]">
        <p className="fontchange text-center text-[4.7rem] font-extrabold leading-[80px] max-md:mt-[100px]">Insta Recipe</p>
        <p className="text-center">Take the guesswork out of cooking simply upload a picture and uncover the recipe behind the meal.</p>
      </div>
      <div className="flex max-md:flex-col max-w-[90%] w-[500px] items-center justify-end mt-[70px] mb-[40px] max-md:gap-[50px]">
          <Image
            src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/food-plate.png"
            alt="food"
            height={350}
            width={350}
            className="max-md:block hidden"
          />
        <div className="flex flex-col h-[320px] w-[275px] rounded-[30px] bg-black bg-opacity-90">
          <div className="flex h-fit gap-[40px] self-center font-extrabold absolute pt-[20px] px-[25px]">
            <button
              onClick={() => setActiveTab("Ingredients")}
              className={`${
                activeTab === "Ingredients" ? "text-white underline" : "text-gray-500"
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab("Instructions")}
              className={`${
                activeTab === "Instructions" ? "text-white underline" : "text-gray-500"
              }`}
            >
              Instructions
            </button>
          </div>
          <div className="flex w-[85%] self-center mt-[60px] scrollbar-hidden overflow-y-scroll">
            {activeTab === "Ingredients" && (
              <ul className="flex flex-col gap-[10px] text-[.88rem]">
                {ingredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
            {activeTab === "Instructions" && (
              <ul className="flex flex-col gap-[20px] text-[.88rem] mb-[25px] h-fit">
                {instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            )}
          </div>
          <Image
            src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/food-plate.png"
            alt=""
            height={350}
            width={350}
            className="absolute max-md:h-[0px] ml-[-275px] mt-[-20px] z-[-3]"
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-[15px] max-w-fit max-md:mb-[100px] mt-[50px]">
        <div className="flex flex-col items-center justify-center bottom-[60px] gap-[15px]">
          <div className="flex justify-center bottom-[200px] gap-[20px] w-[90%] max-w-[450px] ">
            <button className="w-[180px] py-[10px] font-extrabold rounded-[30px] border-[2px]">Sign Up</button>
            <button className="bg-white text-black font w-[180px] py-[10px] font-extrabold rounded-[30px]">Login</button>
          </div>
          <div className="flex bottom-[160px] items-center gap-[10px]">
            <div className="w-[80px] h-[1px] bg-white"></div>
            <p className="font-semibold text-[.85rem] ">Or Register with</p>
            <div className="w-[80px] h-[1px] bg-white"></div>
          </div>
          <div className="flex bottom-[95px] gap-[20px]">
            <button className="p-[10px] rounded-[15px] border-[2px]" onClick={handleGoogleLogin}>
              {/* <Image src={googleicon} alt="Google Logo" width={20} height={20} /> */}
              <Image src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/google-logo.svg" alt="Google Logo svg" width={20} height={20} />
            </button>
            <button className="p-[9px] rounded-[15px] border-[2px]">
              <Image src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/pinterest-logo.svg" alt="Pinterst Logo" width={22} height={22} />
            </button>
            <button className="p-[10px] rounded-[15px] border-[2px]">
              <Image src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/x-logo.svg" alt="X Logo" width={20} height={20} className="filter invert" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}