import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ChatClient } from "./components/client";


interface ChatIDPageProps {
    params: {
        chatId: string;
    };
}

const ChatIdPage = async ({ params }: ChatIDPageProps) => {
    const { chatId } = params;
    const { userId, redirectToSignIn } = await auth();

    if (!userId) {
        return redirectToSignIn();
    }

    const character = await prismadb.character.findUnique({
        where: {
            id: chatId,
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
                where: {
                    userId,
                }
            },
            _count: {
                select: {
                    messages: true
                }
            }
        } 
    });

    if (!character) {
        return redirect("/dashboard");
    }


    return (  
        <ChatClient character={character} />
    );
}
 
export default ChatIdPage;