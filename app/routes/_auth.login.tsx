import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { prisma } from '~/lib/db.server'
import * as bcrypt from 'bcrypt'
import { commitSession, getSession } from '~/lib/session.server'

export const loader = async ({ request }: ActionFunctionArgs) => {
    const session = await getSession(request)

    const data = { error: session.get('error') }

    return Response.json(data, {
        headers: {
            'Set-Cookie': await commitSession(session),
        },
    })
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const session = await getSession(request)
    const formData = await request.formData()
    const email = formData.get('email')?.toString()
    const password = formData.get('password')?.toString()

    if (!email || !password) {
        session.flash('error', 'Email and password are required')
        return redirect('/login', {
            headers: { 'Set-Cookie': await commitSession(session) },
        })
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            // Only select what we need
            uuid: true,
            password: true,
        },
    })

    if (!user) {
        session.flash('error', 'Invalid credentials')
        return redirect('/login', {
            headers: { 'Set-Cookie': await commitSession(session) },
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        session.flash('error', 'Invalid credentials')
        return redirect('/login', {
            headers: { 'Set-Cookie': await commitSession(session) },
        })
    }

    session.set('userId', user.uuid)

    return redirect('/dashboard', {
        headers: { 'Set-Cookie': await commitSession(session) },
    })
}

export default function Login() {
    const { error } = useLoaderData<typeof action>()

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-8">
                Want to generate <span className="text-blue-700">invoices</span>
                ?
            </h1>

            <Form
                className="flex flex-col items-center justify-center gap-4 max-w-md w-full"
                method="POST"
            >
                {error ? <p className="text-red-500">{error}</p> : null}
                <Input type="email" placeholder="Email" name="email" />
                <Input type="password" placeholder="Password" name="password" />
                <Button className="w-full" type="submit">
                    Login
                </Button>

                <Link to="/register" className="w-full">
                    <Button className="w-full" variant="secondary">
                        Register
                    </Button>
                </Link>
            </Form>
        </div>
    )
}
