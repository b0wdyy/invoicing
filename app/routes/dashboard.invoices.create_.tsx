import {
    redirect,
    type ActionFunctionArgs,
    type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { CreateInvoiceForm } from '~/components/invoices/create-invoice-form'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { prisma } from '~/lib/db.server'
import { createInvoice } from '~/lib/invoices/invoice-helper.server'
import { getSession } from '~/lib/session.server'

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
    const session = await getSession(request)
    const userId = session.get('userId')

    try {
        await createInvoice({
            ...data,
            userId,
        })

        return redirect('/dashboard/invoices')
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json({ errors: error.errors }, { status: 400 })
        }

        console.error(error)
        return Response.json(
            { errors: [{ message: 'Failed to create invoice' }] },
            { status: 500 }
        )
    }
}

export const meta: MetaFunction = () => {
    return [
        { title: 'VNDL Invoicing | Create New Invoice' },
        {
            name: 'description',
            content:
                'Create a new invoice with customer details, items, and payment terms.',
        },
        {
            name: 'keywords',
            content: 'create invoice, new invoice, billing, invoice form',
        },
        {
            property: 'og:title',
            content: 'Create New Invoice | VNDL Invoicing',
        },
        {
            property: 'og:description',
            content: 'Create detailed invoices with our easy-to-use form.',
        },
        { name: 'robots', content: 'noindex, nofollow' },
    ]
}

export default function DashboardInvoicesCreate() {
    const { customers } = useLoaderData<typeof loader>()

    return (
        <Card className="max-w-2xl mx-auto my-4">
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
