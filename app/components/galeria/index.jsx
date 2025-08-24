import { Heart } from "lucide-react";
import { useState } from "react";

export default function Galeria() {
    const [photos, setPhotos] = useState([
        {
            id: 1,
            src: "/login/foto1.jpeg",
            alt: "Foto 1"
        },
        {
            id: 2,
            src: "/login/foto2.jpeg",
            alt: "Foto 2"
        },
        {
            id: 3,
            src: "/login/foto3.jpeg",
            alt: "Foto 3"
        }
    ]);
    return (
        <div className="w-full h-full z-10 items-center flex flex-col">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Heart className="h-8 w-8 text-primary fill-current" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Nossa galeria</h1>
            </div>
            <div className="flex justify-center flex-wrap">
                <div className="bg-white m-4 border-4 h-85 border-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">

                    <div className=" relative w-64 h-64 object-cover rounded flex items-center justify-center  cursor-pointer">
                        <div
                            className="polaroid polaroid-scattered bottom-40 right-0 w-24 h-28 floating"
                            style={{ "--rotation": "-10deg", animationDelay: "0.5s" }}
                        >
                            <img
                                src="/login/foto8.jpeg"
                                className="w-full h-16 object-cover rounded-sm"
                            />
                        </div>

                        <div
                            className="polaroid polaroid-scattered -bottom-15 left-0 w-40 h-35 floating"
                            style={{ "--rotation": "18deg", animationDelay: "1.5s" }}
                        >
                            <img
                                src="/login/foto11.jpeg"
                                className="w-full h-25 object-cover rounded-sm"
                            />
                        </div>
                        <h1 className="text-3xl z-50">+ Adiconar foto</h1>
                    </div>
                </div>
                {
                    photos.map(photo => (
                        <div key={photo.id} className="bg-white m-4 border-4 h-85 border-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            <img src={photo.src} alt={photo.alt} className="w-64 h-64 object-cover rounded" />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}