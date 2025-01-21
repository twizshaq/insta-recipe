"use client";

import { useState, useRef, CSSProperties } from "react";
import { LuCopyPlus } from "react-icons/lu";
import { VscSparkle } from "react-icons/vsc";
import { LuSparkles } from "react-icons/lu";
import { CiFileOn } from "react-icons/ci";
import { TbCamera } from "react-icons/tb";
import { LuCakeSlice } from "react-icons/lu";
import { LuSalad } from "react-icons/lu";
import { FaWineGlassEmpty } from "react-icons/fa6";
import { PiBowlFoodBold } from "react-icons/pi";

type AccentColor = "blue" | "green" | "orange" | "pink"

const ACCENT_BG_COLORS: Record<AccentColor, string> = {
  blue: "bg-[#0a90ff] hover:bg-[#057fe4]",
  green: "bg-[#1eab5d] hover:bg-[#17994f]",
  orange: "bg-[#db5415] hover:bg-[#c04a13]",
  pink: "bg-[#ff0988] hover:bg-[#e5087b]",
};

interface UploadImageProps {
  maxImages?: number;
  onImagesSelected?: (images: File[]) => void;
  accent: AccentColor;
}

export default function UploadImage({ maxImages = 3, onImagesSelected, accent, }: UploadImageProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // NEW: handle the "Camera" button click
  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, maxImages);
      setSelectedImages(filesArray);
      if (onImagesSelected) {
        onImagesSelected(filesArray);
      }
    }
  };

  const getImageStyle = (index: number, total: number): CSSProperties => {
    let style: CSSProperties = {
      position: "absolute",
      width: "120px",
      height: "120px",
      borderRadius: "20px",
      objectFit: "cover",
      border: "2px solid white",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: index + 1,
      // marginBottom: "60px",
    };

    if (total === 2) {
      style.marginLeft = index === 0 ? "50px" : "-50px";
      style.transform += index === 0 ? " rotate(10deg)" : " rotate(-10deg)";
    } else if (total === 3) {
      if (index === 0) {
        style.marginLeft = "70px";
        style.transform += " rotate(10deg)";
      } else if (index === 1) {
        style.marginLeft = "-70px";
        style.transform += " rotate(-10deg)";
      } else {
        style.zIndex = 3;
        style.filter = "drop-shadow(0px 0px 7px rgba(0, 0, 0, .8))";
      }
    }

    return style;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#000000] bg-opacity-[.4] rounded-[46px] py-[80px] w-[450px] max-w-[100%] h-[275px] max-h-[100%] gap-[0px]">
      {selectedImages.length === 0 && (
        <div className="flex flex-col items-center text-white text-center gap-[15px]">
          <span className="text-[5rem] z-[2]"><CiFileOn /></span>
          <div className="absolute flex justify-center items-center mt-[7px] h-[70px] w-[47px] bg-[#06070B] z-[1] rounded-[10px] rounded-tr-[25px]">
            <span className="text-[1.7rem]"><LuSalad /></span>
          </div>
          <span className="absolute text-[1.7rem] ml-[83px] mt-[24px] rotate-[20deg]"><LuCakeSlice /></span>
          <span className="absolute text-[1.6rem] mr-[85px] mt-[27px] rotate-[-20deg]"><FaWineGlassEmpty /></span>
          <span className="absolute mb-[50px] mr-[85px] rotate-[-20deg] text-[4.5rem]"><CiFileOn /></span>
          <span className="absolute mb-[50px] ml-[85px] rotate-[20deg] text-[4.5rem]"><CiFileOn /></span>
          <p className="font-bold text-[1.5rem]">Analyze Your Images</p>
        </div>
      )}
      <div className="flex flex-row-reverse gap-[20px] mt-[20px]">
          {selectedImages.length === 0 && (
        <button className={`flex items-center text-white font-bold py-[10px] pl-[20px] pr-[25px] rounded-full mt-[0px] gap-[10px] z-[9] ${ACCENT_BG_COLORS[accent]}`} onClick={handleUploadClick}>
          <span className="text-[1.4rem]"><LuCopyPlus /></span>
          Upload
        </button>
        )}
        {selectedImages.length === 0 && (
        <button className={`flex items-center text-white font-bold py-[10px] pl-[15px] pr-[25px] rounded-full mt-[0px] gap-[10px] z-[9]
              ${ACCENT_BG_COLORS[accent]}`} onClick={handleCameraClick}><span className="text-[1.7rem]"><TbCamera /></span>Camera</button>
        )}
      </div>
      <input
        type="file"
        ref={cameraInputRef}
        className="hidden"
        accept="image/*"
        capture="environment" 
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      {selectedImages.length > 0 && (
      <div className="relative my-[0px] flex w-80 h-[275px]">
        {selectedImages.map((file, index) => (
          <img
            key={index}
            src={URL.createObjectURL(file)}
            alt="Preview"
            style={getImageStyle(index, selectedImages.length)}
            className="absolute"
          />
        ))}
      </div>
      )}
    </div>
  );
}