import { Invoice, InvoiceItem } from '@prisma/client'
import { prisma } from '~/lib/db.server'
import { invoiceSchema } from '~/schemas/invoice'

export function calculateInvoiceAmount(items: InvoiceItem[]) {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0)
}

export async function generateInvoiceNumber() {
    const currentYear = new Date().getFullYear()
    const defaultInvoiceNumber = `VNDL-${currentYear}`
    const lastInvoice = await prisma.invoice.findFirst({
        orderBy: {
            id: 'desc',
        },
    })

    return lastInvoice
        ? `${defaultInvoiceNumber}${String(lastInvoice.id + 1).padStart(
              8,
              '0'
          )}`
        : `${defaultInvoiceNumber}${String(1).padStart(8, '0')}`
}

export async function findInvoices(searchQuery: string, userId: string) {
    return prisma.invoice.findMany({
        where: {
            userId,
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
}

export async function createInvoice(data: Invoice) {
    const validatedData = invoiceSchema.parse({
        ...data,
        customerId: Number(data.customerId),
    })
    const amount = calculateInvoiceAmount(<InvoiceItem[]>validatedData.items)
    const invoiceNumber = await generateInvoiceNumber()

    await prisma.invoice.create({
        data: {
            ...validatedData,
            amount,
            date: new Date(validatedData.date),
            due_date: new Date(validatedData.due_date),
            number: invoiceNumber,
            items: {
                create: validatedData.items,
            },
            customerId: validatedData.customerId,
            userId: data.userId,
        },
    })
}

export async function updateInvoice(data: Invoice, invoiceId: string) {
    const validatedData = invoiceSchema.parse({
        ...data,
        customerId: Number(data.customerId),
    })

    await prisma.invoice.update({
        where: { id: Number(invoiceId) },
        data: {
            customerId: validatedData.customerId,
            date: new Date(validatedData.date),
            due_date: new Date(validatedData.due_date),
            status: validatedData.status,
            items: {
                deleteMany: {},
                create: validatedData.items,
            },
        },
    })
}
