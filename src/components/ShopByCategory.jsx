import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Armchair, ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { name: "Dining Chair", image: "/chair.png" },
  { name: "Sofas", image: "/sofa.webp" },
  { name: "Table", image: "/table.png" },
  { name: "Beds", image: "/bed.webp" },
  { name: "Wardrobes", image: "/Wardrobe.webp" },
  { name: "Bookshelves", image: "/bookshelf.avif" },
];

const ShopByCategory = () => {
  return (
    <div className="w-full bg-white px-6 py-12 mx-auto max-w-screen-2xl">
      <div className="flex flex-col md:flex-row items-stretch gap-8 lg:gap-12">
        
        {/* Left Fixed Content */}
        <div className="w-full md:w-1/4 lg:w-1/5 flex flex-col justify-between py-2">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-4">
              Shop by <br className="hidden md:block" /> categories
            </h2>
            <div className="flex items-center gap-2.5 text-gray-500 mb-6">
              <Armchair className="w-5 h-5 text-orange-500" />
              <p className="text-sm font-medium">200+ Unique products</p>
            </div>
          </div>

          {/* Action Row: Link & Navigation Controls */}
          <div className="flex items-center justify-between md:flex-col md:items-start md:justify-start gap-4">
            <a 
              href="#" 
              className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-orange-500 transition-colors"
            >
              All Categories &rarr;
            </a>
        
            {/* Navigation Arrows */}
            <div className="flex gap-2.5 md:mt-6">
              <button className="swiper-prev bg-orange-50 hover:bg-orange-100 p-2.5 rounded-full border border-orange-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-5 h-5 text-orange-600" />
              </button>
              <button className="swiper-next bg-orange-50 hover:bg-orange-100 p-2.5 rounded-full border border-orange-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight className="w-5 h-5 text-orange-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Scrollable Slider */}
        <div className="w-full md:w-3/4 lg:w-4/5 min-w-0">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1.3}
            navigation={{
              prevEl: ".swiper-prev",
              nextEl: ".swiper-next",
            }}
            breakpoints={{
              480: { slidesPerView: 1.8 },
              640: { slidesPerView: 2.3 },
              1024: { slidesPerView: 3.3 },
              1280: { slidesPerView: 4.3 },
            }}
            className="h-full"
          >
            {categories.map((cat, index) => (
              <SwiperSlide key={index} className="h-auto">
                <div className="bg-[#fff3e1] border border-amber-200/60 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center hover:shadow-xl hover:border-amber-300 transition-all duration-300 group">
                  <div className="w-40 h-40 flex items-center justify-center mb-5 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 tracking-wide">
                    {cat.name}
                  </h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </div>
  );
};

export default ShopByCategory;