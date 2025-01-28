import { streamText  } from "ai";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";
import OpenAI from "openai";
import { deepseek } from '@ai-sdk/deepseek';


export async function POST(
    request: Request,
    { params }: { params: { chatId: string } }
) {
    try {
        const { chatId } = await params;
        const { prompt } = await request.json();
        const user = await currentUser();

        if (!user || !user.firstName || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const identifier = request.url + "-" + user.id;
        const { success } = await rateLimit(identifier);

        if (!success) {
            return new NextResponse("Rate Limit exceeded", { status: 429 });
        }

        const character = await prismadb.character.update({
            where: {
                id: chatId,
            },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: "user",
                        userId: user.id,
                    }
                }
            }
        });

        if (!character) {
            return new NextResponse("Character not found", { status: 404});
        }

        const name = character.id;
        const character_file_name = name + ".txt";

        const characterKey = {
            characterName: name,
            userId: user.id,
            modelName: "deepseek-chat"
        };

        const memoryManager = await MemoryManager.getInstance();
        const records = await memoryManager.readLatestHistory(characterKey);

        if (records.length === 0) {
            await memoryManager.seedChatHistory(character.seed, "\n\n", characterKey);
        }

        await memoryManager.writeToHistory("User: " + prompt + "\n", characterKey);

        const recentChatHistory = await memoryManager.readLatestHistory(characterKey);

        const similarDocs = await memoryManager.vectorSearch(
            recentChatHistory,
            character_file_name,
        );

        let relevantHistory = "";

        if (!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
        }

        const openai = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: process.env.DEEPSEEK_API_KEY
        });

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `
                        ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${name}: prefix.

                        ${character.instructions}

                        Below are the relevant details about ${name}'s past and the conversation you are in.
                        ${relevantHistory}

                        ${recentChatHistory}\n${name}:
                        `
                }
            ],
            model: "deepseek-chat"
        });

        // const resp = String(
        //     await model.invoke(
        //         `
        //         ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${name}: prefix.

        //         ${character.instructions}

        //         Below are the relevant details about ${name}'s past and the conversation you are in.
        //         ${relevantHistory}

        //         ${recentChatHistory}\n${name}:
        //         `
        //     ).catch(console.error)
        // );

        // const response = resp.replaceAll(",", "");
        // const chunks = cleaned.split("\n");
        // const response = chunks[0];
        const response = completion.choices[0].message.content?.replaceAll(",", "");
        await memoryManager.writeToHistory("" + response.trim(), characterKey);

        const result = streamText({
            model: deepseek("deepseek-chat"),
            prompt: `
                    ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${name}: prefix.

                    ${character.instructions}

                    Below are the relevant details about ${name}'s past and the conversation you are in.
                    ${relevantHistory}

                    ${recentChatHistory}\n${name}:
                    `
        });

        if (response !== undefined && response.length > 1) {
            memoryManager.writeToHistory("" + response.trim(), characterKey);

            await prismadb.character.update({
                where: {
                    id: chatId,
                },
                data: {
                    messages: {
                        create: {
                            content: response.trim(),
                            role: "system",
                            userId: user.id
                        } 
                    }
                }
            })
        };

        return result.toDataStreamResponse();


    } catch (error) {
        console.log("[CHAT_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}