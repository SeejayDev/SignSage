import Header from "@components/Header";
import Image from "next/image";
import RegularContainer from "src/layouts/RegularContainer";
import heroImage from "../public/images/hero-img.jpg"
import { RightArrow } from "src/icons/RightArrow";


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
              <div className="flex mt-6 items-center text-primary hover:underline cursor-pointer">
                <p className="font-medium rounded-md mr-2">Start learning now</p>
                <RightArrow className="h-6 w-6" />
              </div>
            </div>

            <div className="w-1/2">
              <div className="relative pr-6 pb-6">
                <Image
                  src={heroImage}
                  className="w-full rounded-lg relative z-20" />

                <div className="pl-6 pt-6 absolute w-full h-full top-0 left-0 z-10">
                  <div className="bg-primary w-full h-full rounded-lg "></div>
                </div>
              </div>
            </div>
          </div>
        </RegularContainer>
      </div>
    </>
  )
}
