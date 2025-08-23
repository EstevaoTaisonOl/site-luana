import clientPromise from "@/lib/mongodb";

export async function GET(req) {
    const encoder = new TextEncoder();
    const client = await clientPromise;
    const db = client.db("siteLuana");
    const cardsCollection = db.collection("cards");

    const stream = new ReadableStream({
        start(controller) {
            const interval = setInterval(async () => {
                try {
                    const cards = await cardsCollection.find().toArray();
                    const data = { cards };

                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                    );
                } catch (err) {
                    controller.enqueue(
                        encoder.encode(`event: error\ndata: ${err.message}\n\n`)
                    );
                }
            }, 1000);

            req.signal.addEventListener("abort", () => {
                clearInterval(interval);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}
