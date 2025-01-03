import Header from "./components/header";
import Link from "next/link";

const LandingPage = () => {
   return (
      <div>
         <Header />
         <div className="p-6 m-4 overflow-y-hidden" style={{ height: 'calc(100vh - 110px)' }}>
            <div className="flex justify-between items-center">
               {/* Text Section */}
               <div className="w-1/2 p-4">
                  <h1 className="text-6xl font-bold mb-4">Title</h1>
                  <h3 className="text-xl mb-6 mt-8">
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                  </h3>
                  <Link href="/register" className="bg-blue-700 text-white px-6 py-3 rounded-sm text-md mt-8">
                     Get Started
                  </Link>
               </div>

               {/* Image Section */}
               <div className="w-1/2 flex flex-col space-y-4 justify-center items-center">
                  <img src="image1.jpg" alt="Image 1" className="rounded-lg bg-gray-200" style={{width: "500px", height: "150px"}} />
                  <img src="image2.jpg" alt="Image 2" className="rounded-lg bg-gray-200" style={{width: "500px", height: "150px"}}/>
                  <img src="image3.jpg" alt="Image 3" className="rounded-lg bg-gray-200" style={{width: "500px", height: "150px"}}/>
               </div>
            </div>
         </div>
      </div>
   );
}

export default LandingPage;
