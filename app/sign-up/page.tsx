"use client";

import { useState } from "react";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// Import your Supabase client
// import { supabase } from "@/lib/supabaseClient";
import dynamic from "next/dynamic";
import foodbanner from "../assets/food-collage.jpg";

const AnalyticsLoader = dynamic(
    () => import("@/app/components/analytics-setup"),
    { ssr: false }
    );

    export default function Signup() {
    const [showSignUp, setShowSignUp] = useState(false);
    const router = useRouter();

    // -- Focus states for Sign Up form --
    const [usernameFocused, setUsernameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // -- Focus states for Login form --
    const [emailLoginFocused, setEmailLoginFocused] = useState(false);
    const [passwordLoginFocused, setPasswordLoginFocused] = useState(false);

    // ---- Supabase Auth Handlers ----

    // 1. Email/Password Sign Up
    // async function handleEmailSignUp(event: React.FormEvent<HTMLFormElement>) {
    //     event.preventDefault();
    //     // read from your sign up form inputs
    //     const username = (event.currentTarget.elements.namedItem("username") as HTMLInputElement)?.value;
    //     const email = (event.currentTarget.elements.namedItem("email") as HTMLInputElement)?.value;
    //     const password = (event.currentTarget.elements.namedItem("password") as HTMLInputElement)?.value;
        
    //     try {
    //     sign up user with email/password
    //     const { data, error } = await supabase.auth.signUp({
    //         email,
    //         password,
    //         options: {
    //         data: {
    //             username
    //         }
    //         }
    //     });

    //     if (error) {
    //         console.error("Error during email sign-up:", error.message);
    //         return;
    //     }

    //     Optionally store username in local storage
    //     if (username) {
    //         localStorage.setItem("username", username);
    //     }
    //     if using "magic link" or require email confirmation, you might need a different flow
    //     redirect after sign-up success
    //     router.push("/account");
    //     } catch (err) {
    //     console.error("Unexpected error during sign-up:", err);
    //     }
    // }

    // 2. Email/Password Login
    // async function handleEmailLogin(event: React.FormEvent<HTMLFormElement>) {
    //     event.preventDefault();
    //     read from your login form inputs
    //     const email = (event.currentTarget.elements.namedItem("loginEmail") as HTMLInputElement)?.value;
    //     const password = (event.currentTarget.elements.namedItem("loginPassword") as HTMLInputElement)?.value;

    //     try {
    //     sign in user with email/password
    //     const { data, error } = await supabase.auth.signInWithPassword({
    //         email,
    //         password
    //     });

    //     if (error) {
    //         console.error("Error during email login:", error.message);
    //         return;
    //     }

    //     once you have the session or user, you might want to fetch the user’s profile
    //     for a username or other data:
    //     const { data: profileData } = await supabase.auth.getUser();
    //     const userProfile = profileData?.user?.user_metadata;
    //     if (userProfile?.username) {
    //         localStorage.setItem("username", userProfile.username);
    //     }
        
    //     redirect after login success
    //     router.push("/account");
    //     } catch (err) {
    //     console.error("Unexpected error during login:", err);
    //     }
    // }

    // 3. Google OAuth Login
    // const handleGoogleLogin = async () => {
    //     try {
    //     sign in with Google OAuth
    //     const { data, error } = await supabase.auth.signInWithOAuth({
    //         provider: "google",
    //         optional: pass in a redirect URL, etc.
    //         options: {
    //         redirectTo: "https://your-domain.com/account"
    //         }
    //     });

    //     if (error) {
    //         console.error("Error during Google login:", error.message);
    //         return;
    //     }

    //     The user will be redirected to a consent screen if not logged in
    //     Then Supabase will redirect back to your callback route or the same page
    //     You can also handle post-auth logic in a callback route or by checking the session
    //     } catch (error) {
    //     console.error("Error during Google login:", error);
    //     }
    // };

    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh]">
        <div className="flex p-[20px] h-[700px] items-center rounded-[50px] gap-[40px]">
            <div className="justify-center flex mt-[30px]" />
            <div className="flex flex-col items-center justify-center h-[660px] w-[400px] bg-green-500 max-w-[90%] rounded-[50px] relative">
            <p className="absolute mb-[550px] mr-[255px] fontchange text-center text-[1.7rem] font-extrabold leading-[30px]">
                Insta <br /> Recipe
            </p>
            <p className="absolute font-bold text-center text-[2rem] z-[5]">
                Get started with <br />
                Insta Recipe!
            </p>
            </div>

            <div className="flex flex-col items-center">
            {/* Toggle between Sign up / Login */}
            <div className="flex gap-[60px] mb-[40px] text-[1.3rem]">
                <button
                className={`font-bold ${showSignUp ? "text-white" : "text-[#757575]"}`}
                onClick={() => setShowSignUp(true)}
                >
                Sign up
                </button>
                <button
                className={`font-bold ${!showSignUp ? "text-white" : "text-[#757575]"}`}
                onClick={() => setShowSignUp(false)}
                >
                Login
                </button>
            </div>

            {/* SIGN UP FORM */}
            {showSignUp ? (
                <>
                <form
                    // onSubmit={handleEmailSignUp}
                    className="flex flex-col gap-[30px] items-center z-[30] w-[400px] max-w-[80%] relative"
                >
                    {/* USERNAME */}
                    <p
                    className="
                        absolute font-bold self-end mr-[30px] mt-[-10px] text-[.9rem] px-[5px]
                        bg-[--background] rounded-[4px] transition-colors
                    "
                    >
                    <span className={usernameFocused ? "imageshine-blue" : "text-white"}>
                        Username
                    </span>
                    </p>
                    <input
                    type="text"
                    name="username"
                    className="flex rounded-[20px] w-[100%] px-[20px] py-[12px] font-bold border-[1.5px] bg-transparent outline-none"
                    placeholder="eg. twizshaq"
                    onFocus={() => setUsernameFocused(true)}
                    onBlur={() => setUsernameFocused(false)}
                    />

                    {/* EMAIL */}
                    <p
                    className="absolute font-bold self-end mr-[30px] mt-[70px] text-[.9rem] px-[5px]
                    bg-[--background] rounded-[4px] transition-colors"
                    >
                    <span className={emailFocused ? "imageshine-blue" : "text-white"}>Email</span>
                    </p>
                    <input
                    type="email"
                    name="email"
                    className="rounded-[20px] w-[100%] px-[20px] py-[12px] font-bold border-[1.5px] bg-transparent outline-none"
                    placeholder="Email"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    />

                    {/* PASSWORD */}
                    <p
                    className="absolute font-bold self-end mr-[30px] mt-[150px] text-[.9rem] px-[5px]
                        bg-[--background] rounded-[4px] transition-colors"
                    >
                    <span className={passwordFocused ? "imageshine-blue" : "text-white"}>
                        Password
                    </span>
                    </p>
                    <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="rounded-[20px] w-[100%] px-[20px] py-[12px] font-bold border-[1.5px] bg-transparent outline-none"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    />

                    <button
                    type="submit"
                    className="font-bold border-[1.5px] px-[30px] py-[10px] rounded-[30px] hover:bg-white hover:bg-opacity-[.2]"
                    >
                    Create Account
                    </button>
                </form>

                <div className="flex bottom-[160px] items-center gap-[10px] mt-[30px]">
                    <div className="w-[80px] h-[1px] bg-white"></div>
                    <p className="font-semibold text-[.85rem]">Or Register with</p>
                    <div className="w-[80px] h-[1px] bg-white"></div>
                </div>

                <div className="flex bottom-[95px] gap-[20px] mt-[30px]">
                    <button
                    className="flex gap-[10px] items-center py-[10px] px-[30px] rounded-[30px] border-[2px] hover:bg-white hover:bg-opacity-[.2] font-bold"
                    // onClick={handleGoogleLogin}
                    type="button"
                    >
                    <Image
                        src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/google-logo.svg"
                        alt="Google Logo svg"
                        width={20}
                        height={20}
                    />
                    <p>Sign in with Google</p>
                    </button>
                </div>
                </>
            ) : (
                // LOGIN FORM
                <>
                <form
                    // onSubmit={handleEmailLogin}
                    className="flex flex-col gap-[30px] items-center z-[30] w-[400px] max-w-[80%] relative"
                >
                    {/* EMAIL */}
                    <p
                    className="
                        absolute font-bold self-end mr-[30px] mt-[-10px] text-[.9rem] px-[5px]
                        bg-[--background] rounded-[4px] transition-colors
                    "
                    >
                    <span className={emailLoginFocused ? "imageshine-blue" : "text-white"}>
                        Email
                    </span>
                    </p>
                    <input
                    type="email"
                    name="loginEmail"
                    className="rounded-[20px] w-[100%] px-[20px] py-[12px] font-bold border-[1.5px] bg-transparent outline-none"
                    placeholder="Email"
                    onFocus={() => setEmailLoginFocused(true)}
                    onBlur={() => setEmailLoginFocused(false)}
                    />

                    {/* PASSWORD */}
                    <p
                    className="
                        absolute font-bold self-end mr-[30px] mt-[70px] text-[.9rem] px-[5px]
                        bg-[--background] rounded-[4px] transition-colors
                    "
                    >
                    <span className={passwordLoginFocused ? "imageshine-blue" : "text-white"}>
                        Password
                    </span>
                    </p>
                    <input
                    type="password"
                    name="loginPassword"
                    placeholder="Password"
                    className="rounded-[20px] w-[100%] px-[20px] py-[12px] font-bold border-[1.5px] bg-transparent outline-none"
                    onFocus={() => setPasswordLoginFocused(true)}
                    onBlur={() => setPasswordLoginFocused(false)}
                    />

                    <button
                    type="submit"
                    className="font-bold border-[1.5px] px-[30px] py-[10px] rounded-[30px] hover:bg-white hover:bg-opacity-[.2]"
                    >
                    Login
                    </button>
                </form>
                </>
            )}
            </div>
        </div>
        </div>
    );
}