"use client"

import { useState } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import dynamic from "next/dynamic";

const AnalyticsLoader = dynamic(() => import("@/app/components/analytics-setup"), { ssr: false });

export default function Signip() {

    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh]">
            {/* <div className="absolute justify-center flex h-[100vh] w-[100vw]">
                <div className="top-[0px] bg-red-500 h-[200px] w-[100%]"></div>
                <div className="absolute top-[100px] rounded-full bg-[--background] h-[600px] w-[100%] blur-[10px]"></div>
            </div> */}
            <div className="flex flex-col max-w-[90%] mb-[40px] items-start gap-[10px]">
                <p className="font-bold text-[2rem]">Get started with Insta Recipe!</p>
                {/* <p>Complete the information to register your account</p> */}
            </div>
            <div className="flex gap-[60px] mb-[60px]">
                <button className="font-bold">Sign up</button>
                <button className="font-bold">Login</button>
            </div>
            <div className="flex flex-col gap-[30px] items-center z-[30] w-[400px] max-w-[80%]">
                    <p className="absolute font-bold bg-[--background] self-end mr-[30px] mt-[-10px] text-[.9rem] px-[5px]">Username</p>
                    <input type="text" className="flex rounded-[20px] w-[100%] px-[20px] py-[12px] font-bold border-[1.5px] bg-transparent outline-none" placeholder="eg. twizshaq" />
                    <p className="absolute font-bold bg-[--background] self-end mr-[30px] mt-[70px] text-[.9rem] px-[5px]">Email</p>
                    <input type="email" className="rounded-[20px] w-[100%] px-[20px] py-[12px] font-bold border-[1.5px] bg-transparent outline-none" placeholder="Email" />
                    <p className="absolute font-bold bg-[--background] self-end mr-[30px] mt-[150px] text-[.9rem] px-[5px]">password</p>
                <input type="password" name="" id="" placeholder="Password" className="rounded-[20px] w-[100%] px-[20px] py-[12px] font-bold border-[1.5px] bg-transparent outline-none"/>
                <button className="font-bold border-[1.5px] px-[30px] py-[10px] rounded-[30px] hover:bg-white hover:bg-opacity-[.2]">Create Account</button>
            </div>
            <p className="absolute bottom-[7px] text-white text-[.7rem] self-center font-extrabold">© Insta Recipe 2025</p>
        </div>
    );
}