import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request){
    const body = await request.json();
    if (!body.title || !body.message || !body.color || !body.size || !body.fontSize || !body.style) {
        return Response.json(
            { error: "Todos os campos são obrigatórios." },
            { status: 400 }
        );
    }
    const client = await clientPromise;
    const db = client.db("siteLuana"); // nome do seu banco
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ uuid: body.uuid });
    const cardsCollection = db.collection("cards");

    if (!user) {
        return Response.json(
            { error: "Usuário não encontrado." },
            { status: 404 }
        );
    }
    
    const newCard = {
        ...body,
        from: user.name,
    }
    console.log(body)
    await cardsCollection.insertOne({ ...newCard});

    const cards = await cardsCollection.find().toArray();

    return Response.json({ message: "Cartão criado com sucesso!", cards}, { status: 201 });
}


export async function PUT(request){
    const body = await request.json();
    if (!body.title || !body.message || !body.from || !body.to || !body.color || !body.size || !body.fontSize || !body.style) {
        return Response.json(
            { error: "Todos os campos são obrigatórios." },
            { status: 400 }
        );
    }
    const client = await clientPromise;
    const db = client.db("siteLuana"); // nome do seu banco
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ uuid: body.uuidUser });
    const cardsCollection = db.collection("cards");
    const card_ = await cardsCollection.findOne({ _id: new ObjectId(body._id) });
    console.log(body.uuidUser, user)
    if (!user) {
        return Response.json(
            { error: "Usuário não encontrado." },
            { status: 404 }
        );
    }
    if(body.uuidUser !== card_.uuid){
        return Response.json(
            { error: "Você não tem permissão para editar este cartão." },
            { status: 403 }
        );
    }
    
    const updatedCard = {
        title: body.title,
        message: body.message,
        from: body.from,
        to: body.to,
        color: body.color,
        size: body.size,
        fontSize: body.fontSize,
        style: body.style,
        isEditing: false,
        updatedAt: new Date(),
        uuid: body.uuid,
    }
    await cardsCollection.updateOne({ _id: new ObjectId(body._id) }, { $set: { ...updatedCard } });

    const cards = await cardsCollection.find().toArray();

    return Response.json({ message: "Cartão atualizado com sucesso!", cards}, { status: 200 });
}