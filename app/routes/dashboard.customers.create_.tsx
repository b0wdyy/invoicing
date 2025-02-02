import { redirect, type ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { CreateCustomerForm } from '~/components/customers/create-customer-form'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { prisma } from '~/lib/db.server'
import { customerSchema } from '~/schemas/customer'

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)

    try {
        const validatedData = customerSchema.parse(data)

        await prisma.customer.create({
            data: validatedData,
        })

        return redirect('/dashboard/customers')
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json({ errors: error.errors }, { status: 400 })
        }

        console.error(error)
        return Response.json(
            { errors: [{ message: 'Failed to create customer' }] },
            { status: 500 }
        )
    }
}

export default function DashboardCustomersCreate() {
    return (
        <Card className="max-w-2xl mx-auto my-4">
            <CardHeader>
                <CardTitle>Create New Customer</CardTitle>
                <CardDescription>
                    Add a new customer to your system
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CreateCustomerForm />
            </CardContent>
        </Card>
    )
}
