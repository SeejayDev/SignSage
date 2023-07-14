import Header from "@components/Header";
import Image from "next/image";
import RegularContainer from "src/layouts/RegularContainer";
import heroImage from "../public/images/hero-img.jpg"
import nextLogo from "../public/images/nextjs.png"
import tailwindLogo from "../public/images/tailwindcss.png"
import tensorflowLogo from "../public/images/tensorflowjs.png"
import { RightArrow } from "src/icons/RightArrow";
import Link from "next/link";


export default function Home() {
  return(
    <>
      <div className="w-screen h-screen flex items-center flex-col">
        <Header />
        
        <RegularContainer>
          <div className="flex w-full items-center mt-4">
            <div className="w-1/2">
              <p className="text-4xl font-medium leading-relaxed">A modern sign language education platform powered by</p>
              <p className="text-4xl bg-primary text-white inline px-2 py-1 rounded-md leading-relaxed font-bold">Artificial Intelligence</p>
              <Link href="/courses">
                <div className="flex mt-6 items-center text-primary hover:underline cursor-pointer">
                  <p className="font-medium rounded-md mr-2">Start learning now</p>
                  <RightArrow className="h-6 w-6" />
                </div>
              </Link>
            </div>

            <div className="w-1/2">
              <div className="relative pr-6 pb-6">
                <Image
                  priority
                  src={heroImage}
                  alt="Image of two people doing sign language"
                  className="w-full rounded-lg relative z-20" />

                <div className="pl-6 pt-6 absolute w-full h-full top-0 left-0 z-10">
                  <div className="bg-primary w-full h-full rounded-lg "></div>
                </div>
              </div>
            </div>
          </div>
        </RegularContainer>

        <RegularContainer className="flex-1 flex flex-col justify-center">
            <p className="text-center text-2xl font-medium">Developed with <span className="p-2 bg-primary text-white rounded-md">modern</span> frameworks and libraries</p>
            <div className="flex items-center space-x-12 justify-center mt-8">
              <Image src={tailwindLogo} className="h-8 w-auto" alt="Tailwind Logo"  />
              <Image src={nextLogo} className="h-14 w-auto" alt="NextJS Logo" />
              <Image src={tensorflowLogo} className="h-12 w-auto" alt="TensorFlow Logo"/>
            </div>
            <p className="text-center font-medium mt-4 text-primary">Designed for a modern learning experience</p>
        </RegularContainer>
      </div>
    </>
  )
}
