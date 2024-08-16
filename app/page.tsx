import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Component() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="h-16 px-4 border-b grid grid-cols-4 items-center">
                <h1 className="text-lg font-bold">UIDEC</h1>
                <h2 className="text-lg font-semibold col-span-3 justify-self-center">Design Inspiration</h2>
            </header>
            <div className="flex flex-1">
                <aside className="flex flex-col justify-end w-2/12 p-4 border-r">
                    <div className="">
                        <h3 className="text-lg font-semibold mb-4">Sign up or log in</h3>
                        <p className="text-sm text-muted-foreground mb-4">Get inspired by generating beautiful & creative designs.</p>
                        <Link href="/signup">
                            <Button className="w-full mb-2">Sign Up</Button>
                        </Link>
                        <Link href="/signin">
                            <Button variant="outline" className="w-full">
                                Log in
                            </Button>
                        </Link>
                    </div>
                </aside>
                <main className="flex-1 bg-gray-100 p-4 grid grid-cols-2 gap-4">
                    <div className="example5" style={{
                        backgroundImage: "url('/images/example5.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backgroundPosition: "center",

                    }}>
                    </div>
                    <div className="example6" 
                        style={{
                            backgroundImage: "url('/images/example6.png')",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                        }}
                    >
                    </div>
                    
                </main>
            </div>
        </div>
    )
}