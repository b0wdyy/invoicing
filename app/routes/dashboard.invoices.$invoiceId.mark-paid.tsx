import { redirect, type ActionFunctionArgs } from '@remix-run/node'
import { prisma } from '~/lib/db.server'

export async function action({ params }: ActionFunctionArgs) {
    const { invoiceId } = params

    if (!invoiceId) {
        return new Response('Invoice ID is required', { status: 400 })
    }

    await prisma.invoice.update({
        where: { id: Number(invoiceId) },
        data: { status: 'PAID' },
    })

    return redirect('/dashboard/invoices')
}
