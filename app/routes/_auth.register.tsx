import { ActionFunctionArgs } from '@remix-run/node'
import { Form, Link } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { prisma } from '~/lib/db.server'
import bcrypt from 'bcryptjs'

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const email = formData.get('email')?.toString().toLowerCase().trim()
    const password = formData.get('password')?.toString()
    const confirmPassword = formData.get('confirmPassword')?.toString()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
        return Response.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (!password || password.length < 8) {
        return Response.json(
            { error: 'Password must be at least 8 characters' },
            { status: 400 }
        )
    }

    if (password !== confirmPassword) {
        return Response.json(
            { error: 'Passwords do not match' },
            { status: 400 }
        )
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return Response.json(
            { error: 'Email already registered' },
            { status: 400 }
        )
    }

    try {
        const hashedPassword = await bcrypt.hash(
            password,
            parseInt(process.env.BCRYPT_ROUNDS || '10')
        )

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: email.split('@')[0],
            },
        })

        return Response.json({ success: true })
    } catch (error) {
        return Response.json(
            { error: 'An error occurred during registration' },
            { status: 500 }
        )
    }
}

export default function Register() {
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-8">
                Create your new <span className="text-blue-700">account</span>
            </h1>

            <Form
                className="flex flex-col items-center justify-center gap-4 max-w-md w-full"
                method="POST"
            >
                <Input type="email" placeholder="Email" name="email" />
                <Input type="password" placeholder="Password" name="password" />
                <Input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                />
                <Button className="w-full" type="submit">
                    Register
                </Button>

                <Link to="/login" className="w-full">
                    <Button className="w-full" variant="secondary">
                        Login
                    </Button>
                </Link>
            </Form>
        </div>
    )
}
