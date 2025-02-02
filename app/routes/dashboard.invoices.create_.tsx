import { redirect, type ActionFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { CreateInvoiceForm } from '~/components/invoices/create-invoice-form'
import { z } from 'zod'
import { prisma } from '~/lib/db.server'
import { invoiceSchema } from '~/schemas/invoice'

export async function loader() {
    const customers = await prisma.customer.findMany({
        select: {
            id: true,
            name: true,
            email: true,
        },
        orderBy: {
            name: 'asc',
        },
    })

    return Response.json({ customers })
}

export async function action({ request }: ActionFunctionArgs) {
    const data = await request.json()

    try {
        const validatedData = invoiceSchema.parse({
            ...data,
            customerId: Number(data.customerId),
        })
        const amount = validatedData.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        )

        await prisma.invoice.create({
            data: {
                ...validatedData,
                amount,
                date: new Date(validatedData.date),
                due_date: new Date(validatedData.due_date),
                items: {
                    create: validatedData.items,
                },
            },
        })

        return redirect('/dashboard/invoices')
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json({ errors: error.errors }, { status: 400 })
        }

        console.log(error)
        return Response.json(
            { errors: [{ message: 'Failed to create invoice' }] },
            { status: 500 }
        )
    }
}

export default function DashboardInvoicesCreate() {
    const { customers } = useLoaderData<typeof loader>()

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Create New Invoice</CardTitle>
                <CardDescription>
                    Create a new invoice for your customer
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CreateInvoiceForm customers={customers} />
            </CardContent>
        </Card>
    )
}
