"use client"; // necessário para usar useState

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Palette, Square, Type } from "lucide-react"; // ou de onde for seu ícone
import Card from "@/app/components/card";

export default function Mural({ uuid, enviarNotificacao}) {
    const [isCreating, setIsCreating] = useState(false)
    const [selectedColor, setSelectedColor] = useState("bg-pink-200")
    const [selectedSize, setSelectedSize] = useState("large")
    const [selectedFontSize, setSelectedFontSize] = useState("medium")
    const [selectedStyle, setSelectedStyle] = useState("romantic")
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [cards, setCards] = useState([])

    const fontSizeConfig = {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg",
    }

    const getStyleEmoji = (style) => {
        switch (style) {
            case "romantic":
                return "💕"
            case "cute":
                return "🥰"
            default:
                return "💌"
        }
    }

    const sizeConfig = {
        small: { width: "w-48", height: "h-32", padding: "p-4" },
        medium: { width: "w-64", height: "h-40", padding: "p-5" },
        large: { width: "w-80", height: "h-48", padding: "p-6" },
    }


    const colors = [
        { name: "Rosa Claro", value: "bg-pink-200" },
        { name: "Rosa Forte", value: "bg-pink-300" },
        { name: "Vermelho Amor", value: "bg-red-200" },
        { name: "Roxo Romântico", value: "bg-purple-200" },
        { name: "Azul Céu", value: "bg-blue-200" },
        { name: "Verde Menta", value: "bg-green-200" },
        { name: "Pêssego", value: "bg-orange-200" },
        { name: "Lavanda", value: "bg-violet-200" },
    ]

    const styles = [
        { name: "Clássico", value: "classic", emoji: "💌" },
        { name: "Romântico", value: "romantic", emoji: "💕" },
        { name: "Fofo", value: "cute", emoji: "🥰" },
    ]

    const createCard = async () => {
        try {
            const response = await fetch('/api/card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    message: message,
                    color: selectedColor,
                    size: selectedSize,
                    fontSize: selectedFontSize,
                    style: selectedStyle,
                    uuid: uuid
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao criar cartão');
            }

            // Aqui sim você pega os cards retornados da API
            setCards(data.cards);
            enviarNotificacao(uuid, "Novo Cartão de Amor!", ``)
        } catch (error) {
            console.error("Erro ao criar cartão:", error);
        }

        setIsCreating(false);
        setSelectedColor("bg-pink-200");
        setSelectedSize("large");
        setSelectedFontSize("medium");
        setSelectedStyle("romantic");
        setTitle("");
        setMessage("");
    };

    useEffect(() => {
        const eventSource = new EventSource("/api/sse");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            var edit = false;
            for (var i = 0; i < cards.length; i++) {
                if (cards[i].isEditing) {
                    edit = true;
                }
            }
            console.log("Editando:", edit)
            if (edit) return;
            setCards(data.cards);
        };

        eventSource.onerror = (err) => {
            console.error("SSE error:", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [cards]);


    const finishEditing = async (cardAtualizado) => {
        try {
            console.log(cardAtualizado)
            const response = await fetch('/api/card', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...cardAtualizado,
                    uuidUser: uuid,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao atualizar cartão');
            }
        } catch (error) {
            console.error("Erro ao atualizar cartão:", error);
        }
    }


    return (
        <>
            <div className="fixed top-24 right-6 z-20">
                <Button
                    onClick={() => setIsCreating(true)}
                    className="rounded-full w-14 h-14 bg-pink-500 hover:bg-pink-600 shadow-lg"
                    size="icon"
                >
                    <Heart className="w-6 h-6" />
                </Button>
            </div>

            {isCreating && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-pink-500" />
                            Criar Cartão de Amor
                        </h3>

                        {/* Style Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                Estilo
                            </label>
                            <div className="flex gap-2">
                                {styles.map((style) => (
                                    <button
                                        key={style.value}
                                        onClick={() => setSelectedStyle(style.value)}
                                        className={`flex-1 py-3 px-4 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1 ${selectedStyle === style.value
                                            ? "border-pink-500 bg-pink-50 text-pink-700"
                                            : "border-gray-300 hover:border-gray-400"
                                            }`}
                                    >
                                        <span className="text-lg">{style.emoji}</span>
                                        <span className="text-sm">{style.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                                <Palette className="w-4 h-4" />
                                Cor
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setSelectedColor(color.value)}
                                        className={`${color.value} w-full h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${selectedColor === color.value ? "border-gray-800 ring-2 ring-pink-500" : "border-gray-300"
                                            }`}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                                <Square className="w-4 h-4" />
                                Tamanho
                            </label>
                            <div className="flex gap-2">
                                {(["small", "medium", "large"]).map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`flex-1 py-2 px-4 rounded-lg border transition-all duration-200 ${selectedSize === size
                                            ? "border-pink-500 bg-pink-50 text-pink-700"
                                            : "border-gray-300 hover:border-gray-400"
                                            }`}
                                    >
                                        {size === "small" ? "Pequeno" : size === "medium" ? "Médio" : "Grande"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Size Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                                <Type className="w-4 h-4" />
                                Tamanho da Fonte
                            </label>
                            <div className="flex gap-2">
                                {(["small", "medium", "large"]).map((fontSize) => (
                                    <button
                                        key={fontSize}
                                        onClick={() => setSelectedFontSize(fontSize)}
                                        className={`flex-1 py-2 px-4 rounded-lg border transition-all duration-200 ${selectedFontSize === fontSize
                                            ? "border-pink-500 bg-pink-50 text-pink-700"
                                            : "border-gray-300 hover:border-gray-400"
                                            }`}
                                    >
                                        <span className={fontSizeConfig[fontSize]}>
                                            {fontSize === "small" ? "Pequena" : fontSize === "medium" ? "Média" : "Grande"}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Preview</label>
                            <div className="flex justify-center">
                                <div
                                    className={`${selectedColor} ${sizeConfig[selectedSize].width} ${sizeConfig[selectedSize].height} ${sizeConfig[selectedSize].padding} rounded-xl shadow-lg border border-white/50 flex flex-col justify-between relative`}
                                >
                                    <div className="absolute top-2 right-2 text-lg">{getStyleEmoji(selectedStyle)}</div>
                                    <div>
                                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título fofo..." className={`outline-none ${fontSizeConfig[selectedFontSize]}font-semibold text-gray-800 mb-2`}>
                                        </input>
                                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Sua mensagem de amor aqui..." className={`outline-none w-full resize-none ${fontSizeConfig[selectedFontSize]} text-gray-700 leading-relaxed`}>

                                        </textarea>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                                        <span>De: Você</span>
                                        <span>Para: Amor</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button onClick={createCard} className="flex-1 bg-pink-500 hover:bg-pink-600">
                                💕 Criar Cartão
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsCreating(false)
                                    setSelectedColor("bg-pink-200")
                                    setSelectedSize("large")
                                    setSelectedFontSize("medium")
                                    setSelectedStyle("romantic")
                                    setTitle("")
                                    setMessage("")

                                }}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {
                cards.map((card, index) => (
                    <Card
                        key={card._id}
                        card={card}
                        fontSizeConfig={fontSizeConfig}
                        sizeConfig={sizeConfig}
                        getStyleEmoji={getStyleEmoji}
                        toggleEdit={() => {
                            setCards(cards.map(c => c._id === card._id ? { ...c, isEditing: !c.isEditing } : c));
                        }}
                        deleteCard={() => {
                            setCards(cards.filter(c => c._id !== card._id));
                        }}
                        updateCard={(id,field, value) => {
                            console.log(field, value, card._id, card.uuid, uuid)
                            setCards(cards.map(c => c._id === card._id ? { ...c, [field]: value } : c));
                        }}
                        finishEditing={(id) => {
                            for(var i = 0 ; i < cards.length; i++){
                                if(cards[i].isEditing){
                                    if(cards[i]._id !== card._id) return;
                                    console.log("Atualizando card:", cards[i]);
                                    var newCard = cards[i];
                                    newCard.isEditing = false;
                                    finishEditing(newCard);
                                }
                            }
                            setCards(cards.map(c => c.id === id ? { ...c, isEditing: false } : c));
                        }}
                        uuid={card.uuid}
                        uuidUser={uuid}
                    />
                ))
            }
        </>
    );
}
