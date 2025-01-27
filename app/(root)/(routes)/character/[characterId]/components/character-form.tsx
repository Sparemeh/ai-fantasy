"use client";

import axios from "axios";
import * as z from "zod";
import { Category, Character } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const PREAMBLE = `You are a fictional character named Asturian, the medieval fantasy king of Asturia. You are a brave and ambitious ruler who deeply cares about the well-being of your people and the prosperity of your kingdom. Your speech is eloquent and noble, reflecting your royal status. You strive to protect your people, expand your kingdom's influence, and ensure justice and fairness in your realm. You are currently speaking to someone who is curious about your reign, values, and the challenges of ruling a medieval kingdom.`;

const SEED_CHAT = `Human: Greetings, King Asturian. How fares the kingdom of Asturia?
Asturian: Greetings, traveler. Asturia thrives under the light of justice and the toil of its noble people. Our granaries are full, our armies are strong, and our artisans craft wonders to rival the heavens. Pray, tell me what brings you to my court.

Human: Your kingdom sounds splendid. What are your greatest challenges as a ruler?
Asturian: Ah, ruling a kingdom is no simple task. The balance between ambition and prudence must be carefully struck. We contend with neighboring realms, unpredictable harvests, and the delicate task of maintaining the trust of my people. Yet, these challenges only steel my resolve to serve them better.

Human: How do you ensure the well-being of your people?
Asturian: By placing their needs above all else. I consult wise councilors, foster trade to enrich our markets, and ensure justice is swift and fair. I walk among my people, hear their grievances, and take their counsel to heart. A king is but the servant of his realm, after all.

Human: You must be proud of your kingdom. What are your ambitions for Asturia?
Asturian: Indeed, I am. Yet, my ambitions are not born of pride alone but of duty. I dream of uniting the fractured lands, forging alliances, and building a legacy of peace and prosperity. Through strength, wisdom, and the blessings of the gods, I shall see Asturia shine as a beacon for all.`;




interface CharacterFormProps {
    initialData: Character | null;
    categories: Category[];
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required.",
    }),
    description: z.string().min(1, {
        message: "Description is required.",
    }),
    instructions: z.string().min(200, {
        message: "Instructions required. (200 characters minimum)",
    }),
    seed: z.string().min(200, {
        message: "Seed required. (200 characters minimum)",
    }),
    src: z.string().min(1, {
        message: "Image is required",
    }),
    categoryId: z.string().min(1, {
        message: "Category is required",
    }),
})

export const CharacterForm = ({
    categories,
    initialData
}: CharacterFormProps) => {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            categoryId: undefined,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (initialData) {
                // Update character functionality
                await axios.patch(`/api/character/${initialData.id}`, values); 
            } else {
                // Create character functionality
                await axios.post("/api/character", values);
            }

            toast({
                description: "Success."
            });

            router.refresh();
            router.push("/dashboard");
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong",
            });
        }
    }

    return (
        <div className="h-full p-4 space-x-2 max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                General Information
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Tell us about your Character!
                            </p>
                        </div>
                        <Separator className="bg-primary/10"/>
                    </div>
                    <FormField name="src" render={({field}) => (
                        <FormItem className="flex flex-col items-center justify-center space-y-4">
                            <FormControl>
                                <ImageUpload disabled={isLoading} onChange={field.onChange} value={field.value}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <div className="grid grid-col-1 md:grid-cols-2 gap-4">
                        <FormField name="name" control={form.control} render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1 ">
                                <FormLabel>Name</FormLabel>
                                <FormControl className="bg-primary/">
                                    <Input disabled={isLoading} placeholder="Asturian the Magnificent" {...field}/>
                                </FormControl>
                                <FormDescription>
                                    This is how your AI Character will be named.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField name="description" control={form.control} render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1 ">
                                <FormLabel>Description</FormLabel>
                                <FormControl className="bg-primary/">
                                    <Input disabled={isLoading} placeholder="The great king of Asturia" {...field}/>
                                </FormControl>
                                <FormDescription>
                                    Describe briefly who your character is!
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField name="categoryId" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel> Category </FormLabel>
                                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-primary/">
                                            <SelectValue defaultValue={field.value} placeholder="Select a Category"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select a category for you Character!
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                Configuration
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Detailed Instruction for AI Behaviour
                            </p>
                        </div>
                        <Separator className="bg-primary/10"/>
                    </div>
                    <FormField name="instructions" control={form.control} render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1 ">
                            <FormLabel>Instructions</FormLabel>
                            <FormControl className="bg-primary/">
                                <Textarea className="bg-background resize-none" rows={7} disabled={isLoading} placeholder={PREAMBLE} {...field}/>
                            </FormControl>
                            <FormDescription>
                                Describe in your character&apos;s backstory, personality, etc in great details.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField name="seed" control={form.control} render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1 ">
                            <FormLabel>Example Conversation</FormLabel>
                            <FormControl className="bg-primary/">
                                <Textarea className="bg-background resize-none" rows={7} disabled={isLoading} placeholder={SEED_CHAT} {...field}/>
                            </FormControl>
                            <FormDescription>
                                Give an example conversation to better configure your AI character!
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <div className="w-full flex justify-center">
                        <Button size="lg" disabled={isLoading}>
                            {initialData ? "Edit your companion" : "Create your companion"}
                            <Wand2 className="w-4 h-4 ml-2"/>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
};