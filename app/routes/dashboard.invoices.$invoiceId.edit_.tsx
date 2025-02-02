import {
    type LoaderFunctionArgs,
    type ActionFunctionArgs,
    redirect,
    type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '~/lib/db.server'
import { CreateInvoiceForm } from '~/components/invoices/create-invoice-form'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { z } from 'zod'
import { updateInvoice } from '~/lib/invoices/invoice-helper.server'

export async function loader({ params }: LoaderFunctionArgs) {
    const invoice = await prisma.invoice.findUnique({
        where: { id: Number(params.invoiceId) },
        include: {
            customer: true,
            items: true,
        },
    })

    if (!invoice) {
        throw new Response('Invoice not found', { status: 404 })
    }

    const customers = await prisma.customer.findMany({
        orderBy: { name: 'asc' },
    })

    return Response.json({ invoice, customers })
}

export async function action({ request, params }: ActionFunctionArgs) {
    const formData = await request.json()

    if (!params.invoiceId) {
        return
    }

    try {
        await updateInvoice(formData, params.invoiceId)

        return redirect('/dashboard/invoices')
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json({ errors: error.errors }, { status: 400 })
        }

        console.error(error)
        return Response.json(
            { errors: [{ message: 'Failed to update invoice' }] },
            { status: 500 }
        )
    }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    if (!data?.invoice) {
        return [
            { title: 'Invoice Not Found | VNDL Invoicing' },
            {
                name: 'description',
                content: 'The requested invoice could not be found.',
            },
        ]
    }

    return [
        { title: `Edit Invoice #${data.invoice.number} | VNDL Invoicing` },
        {
            name: 'description',
            content: `Edit invoice #${data.invoice.number} details, items, and status.`,
        },
        {
            name: 'keywords',
            content: 'edit invoice, update invoice, invoice management',
        },
        {
            property: 'og:title',
            content: `Edit Invoice #${data.invoice.number} | VNDL Invoicing`,
        },
        {
            property: 'og:description',
            content: 'Update invoice details and manage items.',
        },
        { name: 'robots', content: 'noindex, nofollow' },
    ]
}

export default function DashboardInvoicesEdit() {
    const { invoice, customers } = useLoaderData<typeof loader>()

    return (
        <Card className="max-w-2xl mx-auto my-4">
            <CardHeader>
                <CardTitle>Edit Invoice</CardTitle>
                <CardDescription>
                    Edit invoice #{invoice.number}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CreateInvoiceForm
                    customers={customers}
                    defaultValues={{
                        customerId: invoice.customerId,
                        date: invoice.date,
                        due_date: invoice.due_date,
                        status: invoice.status,
                        items: invoice.items,
                    }}
                />
            </CardContent>
        </Card>
    )
}
