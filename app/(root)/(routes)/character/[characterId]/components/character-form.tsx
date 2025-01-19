"use client";

import * as z from "zod";
import { Category, Character } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";

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
        console.log(values);
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
                    </div>
                </form>
            </Form>
        </div>
    )
};