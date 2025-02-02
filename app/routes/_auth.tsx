import { ActionFunctionArgs } from '@remix-run/node'
import { Outlet, redirect } from '@remix-run/react'
import { getSession } from '~/lib/session.server'

// export const loader = async ({ request }: ActionFunctionArgs) => {
//     const session = await getSession(request)

//     if (session.has('userId')) {
//         return redirect('/dashboard')
//     }

//     return null
// }

export default function Auth() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Outlet />
        </div>
    )
}
