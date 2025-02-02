import { useNavigate, useSearchParams, Link } from '@remix-run/react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDebounce } from '~/hooks/use-debounce'
import { InvoiceStatus } from './invoice-status'
import { InvoiceAmount } from './invoice-amount'
import { formatDate } from '~/lib/utils'
import { InvoiceActions } from './invoice-actions'

interface Invoice {
    id: string
    number: string
    date: Date
    due_date: Date
    status: string
    amount: number
    customer: {
        name: string
    }
}

interface InvoicesTableProps {
    invoices: Invoice[]
    searchQuery: string
}

export function InvoicesTable({ invoices, searchQuery }: InvoicesTableProps) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [search, setSearch] = useState(searchQuery)
    const debouncedSearch = useDebounce(search, 300)

    useEffect(() => {
        const newParams = new URLSearchParams(searchParams)
        if (debouncedSearch) {
            newParams.set('search', debouncedSearch)
        } else {
            newParams.delete('search')
        }
        navigate(`?${newParams}`, { replace: true })
    }, [debouncedSearch, navigate, searchParams])

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <Input
                    placeholder="Search invoices..."
                    className="max-w-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button asChild>
                    <Link to="create">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        New Invoice
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Number</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Amount (excl. VAT)
                            </TableHead>
                            <TableHead className="w-[200px] text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center h-24"
                                >
                                    No invoices found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell>{invoice.number}</TableCell>
                                    <TableCell>
                                        {invoice.customer.name}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(invoice.date)}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(invoice.due_date)}
                                    </TableCell>
                                    <TableCell>
                                        <InvoiceStatus
                                            status={invoice.status}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <InvoiceAmount
                                            amount={invoice.amount}
                                        />
                                    </TableCell>
                                    <TableCell className="flex justify-end">
                                        <InvoiceActions
                                            invoiceId={invoice.id}
                                            status={invoice.status}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
