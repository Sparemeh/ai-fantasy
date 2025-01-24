"use client";

import { useAuth } from "@clerk/nextjs"
import Link from "next/link";
import TypeWriterComponent from "typewriter-effect"
import { Button } from "./ui/button";

export const LandingHero = () => {
    const { isSignedIn } = useAuth();


    return (
        <div className="text-white font-bold py-36 text-center space-y-10">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
                <h1>
                    Worldbuilding Powered by AI
                </h1>
                
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-yellow-300 flex items-center justify-center space-x-4">
                    <p>
                        Create 
                    </p>
                    <TypeWriterComponent options={{
                        strings: [
                            "Worlds.",
                            "Stories.",
                            "Characters.",
                            "Cities.",
                            "Creatures.",
                            "Towns.",
                            "Lore.",
                        ], autoStart: true, loop: true
                    }}/>
                </div>
            </div>
            <div className="text-sm md:text-xl font-light text-zinc-400">
                    Fully realize your fictional world through the power of AI
            </div>

            <div>
                <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
                    <Button variant="premium" className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
                        Start Creating your World for Free
                    </Button>
                </Link>
            </div>
        </div>
    )
}