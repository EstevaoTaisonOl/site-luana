"use client"

import { Button } from "@/components/ui/button"
import { Edit3, X } from "lucide-react"

export default function Card({ card, toggleEdit, deleteCard, updateCard, finishEditing, sizeConfig, getStyleEmoji, fontSizeConfig, uuid, uuidUser }) {


    return (
        <div
            key={card.id}
            className={`${sizeConfig[card.size].width} ${sizeConfig[card.size].height} ${card.color} ${sizeConfig[card.size].padding} rounded-xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-200 cursor-move group flex flex-col justify-between relative`}
        >
            {/* Style emoji */}
            <div className="absolute top-2 right-8 text-lg">{getStyleEmoji(card.style)}</div>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                {
                    uuid === uuidUser && (
                        <>
                            <button
                                onClick={() => toggleEdit(card.id)}
                                className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-pink-600 transition-colors"
                            >
                                <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => deleteCard(card.id)}
                                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </>
                    )
                }
            </div>

            {/* Card content */}
            {card.isEditing ? (
                <div className="h-full flex flex-col gap-2">
                    <input
                        value={card.title}
                        onChange={(e) => updateCard(card.id, "title", e.target.value)}
                        className={`w-full bg-transparent border-none outline-none ${fontSizeConfig[card.fontSize]} font-semibold text-gray-800 placeholder-gray-500`}
                        placeholder="Título fofo..."
                    />
                    <textarea
                        value={card.message}
                        onChange={(e) => updateCard(card.id, "message", e.target.value)}
                        className={`flex-1 w-full bg-transparent border-none outline-none resize-none ${fontSizeConfig[card.fontSize]} text-gray-700 placeholder-gray-500`}
                        placeholder="Sua mensagem de amor..."
                    />
                    
                    <Button onClick={() => finishEditing(card.id)} size="sm" className="mt-2 bg-pink-500 hover:bg-pink-600">
                        Salvar 💕
                    </Button>
                </div>
            ) : (
                <div className="h-full flex flex-col justify-between" onClick={() => {uuid == uuidUser ? toggleEdit(card.id) : null}}>
                    <div>
                        <h1>de: {card.from}</h1>
                        <h3 className={`${fontSizeConfig[card.fontSize]} font-semibold text-gray-800 mb-2 cursor-text`}>
                            {card.title}
                        </h3>
                        <p className={`${fontSizeConfig[card.fontSize]} text-gray-700 leading-relaxed cursor-text`}>
                            {card.message}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
