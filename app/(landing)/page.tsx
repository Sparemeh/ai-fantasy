import { LandingHero } from "@/components/landing-hero";
import { LandingNavbar } from "@/components/landing-navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () => {
    return (  
        <div className="h-full">
            <LandingNavbar />
            <LandingHero />
        </div>
    );
}
 
export default LandingPage;