import { Badge } from '../ui/badge'

interface InvoiceStatusProps {
    status: string
}

export function InvoiceStatus({ status }: InvoiceStatusProps) {
    const variant =
        status === 'PAID'
            ? 'success'
            : status === 'PENDING'
              ? 'warning'
              : 'secondary'

    return <Badge variant={variant}>{status.toLowerCase()}</Badge>
}
