"use client"

import { getAllCampaigns, getOrganization } from "@/app/services/fetchService.js"
import { useEffect, useState} from "react"
import Card from "./card"
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';


const Organization = ({params}) => {
   const organizationId = params.organizationId
   const [organization, setOrganization] = useState(null)
   const [campaigns, setCampaigns] = useState([])
   
   const images = [
      "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
      "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      "https://www.shutterstock.com/image-photo/beautiful-pink-flower-anemones-fresh-260nw-1028135845.jpg",
   ]

   useEffect(() => {
      const fetchData = async() => {
         const organizationResponse = await getOrganization(organizationId)
         // console.log(organizationResponse)
         setOrganization(organizationResponse)

         const campaignResponse = await getAllCampaigns(organizationId)
         setCampaigns(campaignResponse)
      }

      fetchData()
   }, [])

   return (
      <div className="flex flex-col  justify-center w-full max-w-6xl mx-auto p-4">
         {/* Heading */}
         {organization && <h1 className="text-2xl font-bold text-gray-800 mb-4">{organization.name}</h1>}

         {/* Description */}
         {organization && <p className="text-lg text-gray-600 mb-6">description</p>}

         {/* Image Slideshow */}
         {/* <div className="w-full">
            <Swiper
               spaceBetween={30}
               slidesPerView={1.5}
               centeredSlides={true}
               navigation={true}
               loop={true}
               autoplay={{delay: 3000}}
               onSlideChange={() => console.log('slide change')}
               onSwiper={(swiper) => console.log(swiper)}
            >
               {images.map((image, index) => (
                  <SwiperSlide key={index}>
                     <img 
                        src={image} 
                        alt={`Slide ${index + 1}`} 
                        className="w-full h-auto object-cover rounded-lg" 
                        style={{height: "350px",}}
                     />
                  </SwiperSlide>
               ))}
            </Swiper>
         </div> */}
         <div>
            <h1 className="font-semibold text-xl mb-4">Active Campaigns:</h1>
            <div className="grid grid-cols-4 gap-4 w-full">
               {campaigns.map((item) => {
                  <div key={item.id}> 
                     <img 
                        src={item.image}
                     />
                     <p>{item.title}</p>
                     <p>{item.description}</p>
                  </div>
               })}
            </div>
         </div>
      </div>
   )
}

export default Organization