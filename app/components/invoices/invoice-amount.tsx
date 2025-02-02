interface InvoiceAmountProps {
    amount: number
}

export function InvoiceAmount({ amount }: InvoiceAmountProps) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount)
}
