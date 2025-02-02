import { type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { prisma } from '~/lib/db.server'
import { CustomersTable } from '~/components/customers/customers-table'

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const searchQuery = url.searchParams.get('search')?.toLowerCase() || ''

    const customers = await prisma.customer.findMany({
        where: {
            OR: [
                { name: { contains: searchQuery } },
                { email: { contains: searchQuery } },
                { vat_number: { contains: searchQuery } },
                { address: { contains: searchQuery } },
            ],
        },
        orderBy: {
            name: 'asc',
        },
    })

    return Response.json({ customers })
}

export default function DashboardCustomers() {
    const { customers } = useLoaderData<typeof loader>()
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('search') || ''

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                <p className="text-muted-foreground">
                    Manage your customer information
                </p>
            </div>

            <CustomersTable customers={customers} searchQuery={searchQuery} />
        </div>
    )
}
