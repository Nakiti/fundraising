import Header from "./components/header";
import Link from "next/link";
import { FaHandHoldingHeart, FaUsers, FaChartLine, FaShieldAlt, FaArrowRight } from "react-icons/fa";

const LandingPage = () => {
   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
         <Header />
         
         {/* Hero Section */}
         <section className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
               <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left Content */}
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                           Transform Your
                           <span className="text-blue-600 block">Fundraising</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                           Empower your organization with modern fundraising tools. Create beautiful campaigns, 
                           engage donors, and track impact with our comprehensive platform.
                        </p>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row gap-4">
                        <Link 
                           href="/register" 
                           className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 group"
                        >
                           Get Started Free
                           <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                        <Link 
                           href="/login" 
                           className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                        >
                           Sign In
                        </Link>
                     </div>
                  </div>
                  
                  {/* Right Content - Hero Image */}
                  <div className="relative">
                     <div className="relative z-10 bg-white rounded-2xl p-8 border border-gray-100">
                        <div className="space-y-6">
                           <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                 <FaHandHoldingHeart className="text-blue-600 text-xl" />
                              </div>
                              <div>
                                 <h3 className="font-semibold text-gray-900">Campaign Success</h3>
                                 <p className="text-sm text-gray-500">$2.4M raised this month</p>
                              </div>
                           </div>
                           <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{width: '75%'}}></div>
                           </div>
                           <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                 <div className="text-2xl font-bold text-gray-900">1,247</div>
                                 <div className="text-sm text-gray-500">Donors</div>
                              </div>
                              <div>
                                 <div className="text-2xl font-bold text-gray-900">89%</div>
                                 <div className="text-sm text-gray-500">Goal Met</div>
                              </div>
                              <div>
                                 <div className="text-2xl font-bold text-gray-900">24</div>
                                 <div className="text-sm text-gray-500">Days Left</div>
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     {/* Decorative elements */}
                     <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
                     <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-200 rounded-full opacity-30"></div>
                  </div>
               </div>
            </div>
         </section>

         {/* Features Section */}
         <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                     Everything You Need to Succeed
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                     Our comprehensive platform provides all the tools and features your organization needs 
                     to create successful fundraising campaigns.
                  </p>
               </div>
               
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Feature 1 */}
                  <div className="group p-8 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200">
                     <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors duration-200">
                        <FaHandHoldingHeart className="text-blue-600 text-xl" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Campaign Creation</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Create beautiful fundraising campaigns in minutes with our intuitive drag-and-drop 
                        editor and customizable templates.
                     </p>
                  </div>
                  
                  {/* Feature 2 */}
                  <div className="group p-8 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200">
                     <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors duration-200">
                        <FaUsers className="text-green-600 text-xl" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-3">Donor Engagement</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Build meaningful relationships with donors through personalized communication, 
                        progress updates, and impact stories.
                     </p>
                  </div>
                  
                  {/* Feature 3 */}
                  <div className="group p-8 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200">
                     <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors duration-200">
                        <FaChartLine className="text-purple-600 text-xl" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics & Insights</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Track your campaign performance with detailed analytics, donor behavior insights, 
                        and real-time reporting tools.
                     </p>
                  </div>
                  
                  {/* Feature 4 */}
                  <div className="group p-8 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200">
                     <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors duration-200">
                        <FaShieldAlt className="text-orange-600 text-xl" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Payments</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Process donations securely with industry-leading encryption and compliance 
                        with PCI DSS standards.
                     </p>
                  </div>
                  
                  {/* Feature 5 */}
                  <div className="group p-8 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200">
                     <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors duration-200">
                        <FaUsers className="text-indigo-600 text-xl" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-3">Team Collaboration</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Work together seamlessly with role-based permissions, shared dashboards, 
                        and collaborative campaign management.
                     </p>
                  </div>
                  
                  {/* Feature 6 */}
                  <div className="group p-8 rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200">
                     <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-200 transition-colors duration-200">
                        <FaHandHoldingHeart className="text-teal-600 text-xl" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Optimized</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Reach donors anywhere with fully responsive campaigns that look great 
                        on all devices and screen sizes.
                     </p>
                  </div>
               </div>
            </div>
         </section>

         {/* CTA Section */}
         <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
               <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to Start Your Fundraising Journey?
               </h2>
               <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of organizations that trust our platform to power their fundraising 
                  success. Get started today and see the difference.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                     href="/register" 
                     className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                  >
                     Start Free Trial
                     <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                  <Link 
                     href="/login" 
                     className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
                  >
                     Contact Sales
                  </Link>
               </div>
            </div>
         </section>

         {/* Footer */}
         <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid md:grid-cols-4 gap-8">
                  <div className="col-span-2">
                     <h3 className="text-2xl font-bold mb-4">Temple Giving</h3>
                     <p className="text-gray-400 mb-4 max-w-md">
                        Empowering organizations to create meaningful impact through modern 
                        fundraising technology and donor engagement tools.
                     </p>
                  </div>
                  <div>
                     <h4 className="font-semibold mb-4">Product</h4>
                     <ul className="space-y-2 text-gray-400">
                        <li><Link href="#" className="hover:text-white transition-colors duration-200">Features</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors duration-200">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors duration-200">Security</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors duration-200">API</Link></li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-semibold mb-4">Company</h4>
                     <ul className="space-y-2 text-gray-400">
                        <li><Link href="#" className="hover:text-white transition-colors duration-200">About</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors duration-200">Blog</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors duration-200">Careers</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors duration-200">Contact</Link></li>
                     </ul>
                  </div>
               </div>
               <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                  <p>&copy; 2024 Temple Giving. All rights reserved.</p>
               </div>
            </div>
         </footer>
      </div>
   );
}

export default LandingPage;
