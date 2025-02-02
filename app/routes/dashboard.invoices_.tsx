import { type MetaFunction, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { InvoicesTable } from '~/components/invoices/invoices-table'
import { findInvoices } from '~/lib/invoices/invoice-helper.server'
import { getUserUuidFromSession } from '~/lib/users/user-helper.server'

export const meta: MetaFunction = () => {
    return [
        { title: 'VNDL Invoicing | Invoices Dashboard' },
        {
            name: 'description',
            content:
                'Manage and view all your invoices in one place. Search, filter, and track invoice status.',
        },
        {
            name: 'keywords',
            content:
                'invoices, billing, payments, invoice management, business, accounting',
        },
        {
            property: 'og:title',
            content: 'VNDL Invoicing | Invoices Dashboard',
        },
        {
            property: 'og:description',
            content:
                'Comprehensive invoice management system for your business.',
        },
        { name: 'robots', content: 'noindex, nofollow' }, // Since this is a dashboard page
    ]
}

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const searchQuery = url.searchParams.get('search')?.toLowerCase() || ''
    const userId = await getUserUuidFromSession(request)

    const invoices = await findInvoices(searchQuery, userId)

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
