import { redirect, type ActionFunctionArgs } from '@remix-run/node'
import { prisma } from '~/lib/db.server'

export async function action({ request, params }: ActionFunctionArgs) {
    const { invoiceId } = params

    if (request.method === 'DELETE' && invoiceId) {
        await prisma.invoice.delete({
            where: { id: Number(invoiceId) },
        })

        return redirect('/dashboard/invoices')
    }

    return new Response('Method not allowed', { status: 405 })
}

export default function DashboardInvoicesShow() {
    return (
        <div>
            <h1>InvoicesShow</h1>
        </div>
    )
}
