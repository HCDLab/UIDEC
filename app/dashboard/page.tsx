import Canvas from "./Canvas"
import { cookies } from "next/headers";
import pb from '@/client/pocketBase';
import { redirect } from 'next/navigation'

export default async function Dashboard() {

    // Fetch pb_auth cookie from client.
    const authCookie = await cookies().get('pb_auth')
    await pb.authStore.loadFromCookie('pb_auth=' + authCookie?.value)

    // Check if the session is still valid.
    if (!pb.authStore.isValid) { return redirect('/signin') }
    else {
        console.log('Session is valid.')
    }

    return (
        <>
            <Canvas />
        </>
    )
}
