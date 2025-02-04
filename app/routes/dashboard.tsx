import {
    LoaderFunctionArgs,
    redirect,
    type MetaFunction,
} from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { AppSidebar } from '~/components/app-side-bar'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import { prisma } from '~/lib/db.server'
import { getUserUuidFromSession } from '~/lib/users/user-helper.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const userId = await getUserUuidFromSession(request)

    if (!userId) {
        return redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: { uuid: userId },
        select: {
            // Only select what we need
            uuid: true,
            email: true,
            name: true,
        },
    })

    if (!user) {
        return redirect('/login')
    }

    return Response.json({ user })
}

export const meta: MetaFunction = () => {
    return [
        { title: 'VNDL Invoicing | Dashboard' },
        { name: 'description', content: 'Manage your invoices and customers' },
    ]
}

export default function Dashboard() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <SidebarTrigger />
                <Outlet />
            </main>
        </SidebarProvider>
    )
}
