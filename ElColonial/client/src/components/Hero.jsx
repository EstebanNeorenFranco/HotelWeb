import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Foto1 from '../assets/Images/Foto1.webp';
import Foto2 from '../assets/Images/Foto2.webp';
import Foto3 from '../assets/Images/Foto3.webp';

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      <Carousel
        showArrows={false} 
        showStatus={false} 
        showThumbs={false} 
        infiniteLoop={true} 
        autoPlay={true} 
        interval={4000} 
        transitionTime={500} 
        stopOnHover={true}
        swipeable={true} 
        emulateTouch={true}
        className="h-full"
      >
        {[Foto1, Foto2, Foto3].map((foto, index) => (
          <div key={index} className="h-full flex justify-center items-center max-h-[600px]">
            <img src={foto} alt={`Slide ${index + 1}`} className="object-cover h-full w-full brightness-75" />
            <div className="absolute inset-0 flex justify-center items-center text-white text-3xl font-bold lg:text-5xl">
              <p>
                {index === 0 && "Sumérgete en la Magia de Cafayate"}
                {index === 1 && "Comodidad y Calidez Familiar"}
                {index === 2 && "Descubrí nuestra Cultura y Naturaleza"}
              </p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Hero;
