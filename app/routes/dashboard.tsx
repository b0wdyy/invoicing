import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { AppSidebar } from '~/components/app-side-bar'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import { prisma } from '~/lib/db.server'
import { getSession } from '~/lib/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await getSession(request)

    if (!session.has('userId')) {
        return redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: {
            uuid: session.get('userId'),
        },
    })

    return Response.json({ user })
}

export default function Dashboard() {
    const { user } = useLoaderData<typeof loader>()

    return (
        <SidebarProvider>
            <AppSidebar user={user} />
            <main className="w-full">
                <SidebarTrigger />
                <Outlet />
            </main>
        </SidebarProvider>
    )
}
