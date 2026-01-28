'use client';

import { EyeIcon, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import pb from "@/client/pocketBase";
import { useRouter } from 'next/navigation'
import { useState } from "react";

export default function SignUpPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoginSuccess, setIsLoginSuccess] = useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newUser = await pb.collection('users').create({
                email,
                password,
                passwordConfirm: password,
            });
            await pb.collection('users').requestVerification(email);
            const authData = await pb.collection('users').authWithPassword(email, password);
            document.cookie = await pb.authStore.exportToCookie({ httpOnly: false });
            if (pb.authStore.isValid) {
                setIsLoginSuccess(true);
                router.push('/dashboard');
            }
            else {
                setError('Invalid credentials');
            }
        } catch (error: any) {
            setError(error.message);
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold">AI Inspiration Tool</h1>
            <h2 className="mt-6 text-xl font-semibold">Create an Account</h2>
            <form className="w-full max-w-sm mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                        Email Address*
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium">
                        Password*
                    </label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className="absolute right-2 top-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} /> : <EyeIcon size={20} />}
                        </span>
                    </div>
                </div>
                <Button className="w-full mt-4" variant="default" type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Sign Up'}
                </Button>

                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                {pb.authStore.isValid && isLoginSuccess && <p className="text-green-500 text-center text-sm">Redirecting to dashboard...</p>}
            </form>
            <p className="mt-4 text-sm text-center">
                Already have an account? <span className="text-blue-500 cursor-pointer" onClick={() => router.push('/signin')}>Login</span>
            </p>
        </div>
    );
}
