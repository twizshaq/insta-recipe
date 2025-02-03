"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
// Import your Supabase client
import { supabase } from "@/lib/supabaseClient";
import foodbanner from "../assets/food-collage.jpg";

export default function Signup() {
    const [showSignUp, setShowSignUp] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    
    useEffect(() => {
        async function signUpUser() {
        // Make sure to define these variables appropriately
        const email = "user@example.com"; // replace with actual email value
        const password = "userpassword";    // replace with actual password value
        const username = "exampleUsername"; // replace with actual username

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
            data: {
                // Using the 'full_name' key as indicated in the comment
                data: { full_name: username },
            },
            },
        });

        // If sign-up succeeds, you'll have `data.user` containing the user ID:
        if (!error && data.user) {
        const userId = data.user.id;

        // Insert a row into profiles:
        let { error: insertError } = await supabase
            .from("profiles")
            .insert([
            {
                id: userId,
                username: username,
                email: email, 
                // ... anything else
            },
            ]);

        if (insertError) {
            console.error("Error inserting into profiles:", insertError);
        } else {
            // Optionally store username in localStorage or do more stuff
            localStorage.setItem("username", username);

            router.push("/account");
        }
        }

        if (error) {
            console.error("Sign-up error:", error.message);
        } else {
            console.log("Sign-up data:", data);
        }
        }

        // Call the async function if needed
        // signUpUser();

        // Toggle sign-up view based on the search parameter "active"
        if (searchParams.get("active") === "signup") {
        setShowSignUp(true);
        }
    }, [searchParams]);

    // -- Focus states for Sign Up form --
    const [usernameFocused, setUsernameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // -- Focus states for Login form --
    const [emailLoginFocused, setEmailLoginFocused] = useState(false);
    const [passwordLoginFocused, setPasswordLoginFocused] = useState(false);

    // ---- Supabase Auth Handlers ----

    // 1. Email/Password Sign Up
        async function handleEmailSignUp(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // Read from your sign up form inputs
        const username = (
            event.currentTarget.elements.namedItem("username") as HTMLInputElement
        )?.value;
        const email = (
            event.currentTarget.elements.namedItem("email") as HTMLInputElement
        )?.value;
        const password = (
            event.currentTarget.elements.namedItem("password") as HTMLInputElement
        )?.value;

        console.log("handleEmailSignUp triggered");

        try {
            // Sign up user with email/password
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: username },
                },
            });

            if (error) {
                console.error("Error during email sign-up:", error.message);
                return;
            }

            // **UNCOMMENT AND ACTIVATE THIS PROFILE CREATION CODE:**
            if (data?.user) {
                const userId = data.user.id;

                // Insert a row into profiles:
                const { error: insertError } = await supabase
                    .from("profiles")
                    .insert([
                        {
                            id: userId,
                            username: username,
                            email: email,
                            full_name: username, // Or get full_name from input if you have it
                        },
                    ]);

                if (insertError) {
                    console.error("Error inserting into profiles:", insertError.message);
                    return; // Stop here if profile insert fails
                } else {
                    console.log("Profile created successfully for user:", userId);
                    localStorage.setItem("username", username); // Store username
                    router.push("/account"); // Redirect to account page
                    return; // Exit function after successful signup and profile creation
                }
            }
            // **END OF UNCOMMENTED PROFILE CREATION CODE**

            // **This part is now redundant because the profile creation block handles redirection
            // and success logging if signup is fully successful.  You can remove or comment it out:**
            // **If signup was successful but profile creation was not reached (unlikely now):**
            // console.log("Sign-up data:", data); // Log signup data (if profile creation code not reached)
            // router.push("/account"); // Redirect after sign-up success (if profile creation code not reached)


        } catch (err) {
            console.error("Unexpected error during sign-up:", err);
        }
    }

    // 2. Email/Password Login
    async function handleEmailLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // Read from your login form inputs
        const email = (
        event.currentTarget.elements.namedItem("loginEmail") as HTMLInputElement
        )?.value;
        const password = (
        event.currentTarget.elements.namedItem("loginPassword") as HTMLInputElement
        )?.value;

        try {
        // Sign in user with email/password
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Error during email login:", error.message);
            return;
        }

        // Redirect after login success
        router.push("/account");
        } catch (err) {
        console.error("Unexpected error during login:", err);
        }
    }

    // 3. Google OAuth Login (Optional)
    async function handleGoogleLogin() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: "https://your-domain.com/account",
            },
            });
            if (error) {
            console.error("Error during Google login:", error.message);
            }
        } catch (err) {
            console.error("Unexpected error during Google login:", err);
        }
        }

    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] overflow-x-hidden">
        <div className="flex flex-wrap p-[30px] h-fit w-fit items-center justify-center rounded-[40px] mt-[30px] mb-[50px]">
            <div className="justify-center items-center flex mt-[30px]" />
            <div className="flex flex-col items-start justify-start h-[660px] max-mobile3:h-[300px] w-[400px] max-w-[85%] bg-green-500 rounded-[50px] max-mobile3:mb-[50px]">
            <p className="ml-[30px] mt-[25px] fontchange text-center text-[1.7rem] font-extrabold leading-[30px]">
                Insta <br /> Recipe
            </p>
            </div>

            <div className="flex flex-col items-center">
            {/* Toggle between Sign up / Login */}
            <div className="flex gap-[60px] mb-[40px] text-[1.3rem]">
                <button
                className={`font-bold ${
                    showSignUp ? "text-white" : "text-[#757575]"
                }`}
                onClick={() => setShowSignUp(true)}
                >
                Sign up
                </button>
                <button
                className={`font-bold ${
                    !showSignUp ? "text-white" : "text-[#757575]"
                }`}
                onClick={() => setShowSignUp(false)}
                >
                Login
                </button>
            </div>

            {/* SIGN UP FORM */}
            {showSignUp ? (
                <>
                <form
                    onSubmit={handleEmailSignUp}
                    className="flex flex-col gap-[30px] items-center z-[30] w-[400px] max-w-[80%] relative"
                >
                    {/* USERNAME */}
                    <p
                    className="
                        absolute font-bold self-end mr-[30px] mt-[-10px] text-[.9rem] px-[5px]
                        bg-[--background] rounded-[4px] transition-colors
                    "
                    >
                    <span
                        className={usernameFocused ? "imageshine-blue" : "text-white"}
                    >
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
                    <span className={emailFocused ? "imageshine-blue" : "text-white"}>
                        Email
                    </span>
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
                    <span
                        className={passwordFocused ? "imageshine-blue" : "text-white"}
                    >
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
                    onSubmit={handleEmailLogin}
                    className="flex flex-col gap-[30px] items-center z-[30] w-[400px] max-w-[80%] relative"
                >
                    {/* EMAIL */}
                    <p
                    className="
                        absolute font-bold self-end mr-[30px] mt-[-10px] text-[.9rem] px-[5px]
                        bg-[--background] rounded-[4px] transition-colors
                    "
                    >
                    <span
                        className={emailLoginFocused ? "imageshine-blue" : "text-white"}
                    >
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
                    <span
                        className={passwordLoginFocused ? "imageshine-blue" : "text-white"}
                    >
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
        {/* Optionally, add footer or additional content here */}
        </div>
    );
}