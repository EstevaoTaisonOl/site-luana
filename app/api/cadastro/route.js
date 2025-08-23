// app/api/cadastro/route.js
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { generateToken } from "@/lib/auth";


export async function POST(request) {
    const body = await request.json();

    // Validações
    if (!body.name || !body.password || !body.confirmPassword) {
        return Response.json(
            { error: "Todos os campos são obrigatórios." },
            { status: 400 }
        );
    }
    if (body.password !== body.confirmPassword) {
        return Response.json(
            { error: "As senhas não coincidem." },
            { status: 400 }
        );
    }
    if (body.password.length < 6) {
        return Response.json(
            { error: "A senha deve ter pelo menos 6 caracteres." },
            { status: 400 }
        );
    }
    if (body.name.length < 3) {
        return Response.json(
            { error: "O nome deve ter pelo menos 3 caracteres." },
            { status: 400 }
        );
    }
    var uuid = uuidv4()
    try {
        // Conexão com o banco
        const client = await clientPromise;
        const db = client.db("siteLuana"); // nome do seu banco
        const users = db.collection("users");

        // Verifica se já existe usuário com o mesmo nome
        const existingUser = await users.findOne({ name: body.name });
        if (existingUser) {
            return Response.json(
                { error: "Esse nome já está em uso." },
                { status: 400 }
            );
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // Salva no banco
        const result = await users.insertOne({
            name: body.name,
            password: hashedPassword,
            createdAt: new Date(),
            code: "",
            uuid,
        });
        var token = generateToken(uuid)
        return Response.json({
            message: "Cadastro realizado com sucesso!",
            userId: result.insertedId,
            uuid,
            token,
        });
    } catch (err) {
        return Response.json(
            { error: "Erro no servidor: " + err.message },
            { status: 500 }
        );
    }
}
