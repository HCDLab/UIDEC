import Canvas from "./Canvas"
import { cookies } from "next/headers";
import pb from '@/client/pocketBase';
import { redirect } from 'next/navigation'

export default async function Dashboard() {
   
    const cookieStore = cookies()
    const cookie = cookieStore.get('pb_auth')
    if (cookie) {
        pb.authStore.loadFromCookie([cookie.name, cookie.value].join('='))
    }
    let user = pb.authStore.model
    const refresh = await pb.collection('users').authRefresh()
    try {
        pb.authStore.isValid &&  (await refresh)
    } catch (err) {
        redirect('/signin')
    }
    return (
        <>
            <Canvas user={user} />
        </>
    )
}
