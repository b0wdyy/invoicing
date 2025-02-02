import { type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { InvoicesTable } from '~/components/invoices/invoices-table'
import { prisma } from '~/lib/db.server'

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const searchQuery = url.searchParams.get('search')?.toLowerCase() || ''

    const invoices = await prisma.invoice.findMany({
        where: {
            OR: [
                { number: { contains: searchQuery } },
                { customer: { name: { contains: searchQuery } } },
                { status: { contains: searchQuery } },
            ],
        },
        include: {
            customer: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            date: 'desc',
        },
    })

    return Response.json({ invoices })
}

export default function DashboardInvoices() {
    const { invoices } = useLoaderData<typeof loader>()
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('search') || ''

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
                <p className="text-muted-foreground">
                    Manage your invoice information
                </p>
            </div>

            <InvoicesTable invoices={invoices} searchQuery={searchQuery} />
        </div>
    )
}
