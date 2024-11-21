// "use client"
// import PreviewNavbar from "../../components/previews/previewNavbar"
// import Display from "../../components/previews/landingPage/display"
// import { useSearchParams } from "next/navigation"

// const LandingPageLayout = ({children}) => {
//    const searchParams = useSearchParams()
//    const type = searchParams.get("type")

//    const links = [
//       `/org/campaign/new/landing-page?type=${type}`,
//       `/org/campaign/new/landing-page/design?type=${type}`
//    ]

//    return (
//       <div className="w-full">
//          <PreviewNavbar heading={"Configure Landing Page"} links={links}/>
//          <div className="flex flex-row space-x-4 w-11/12 mx-auto">
//             <div className="w-1/3">
//                {children}
//             </div>
//             <div className="w-2/3">
//                <Display />
//             </div>
//          </div>
//       </div>
//    )
// }

// export default LandingPageLayout