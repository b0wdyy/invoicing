import { Link, useNavigate, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { useDebounce } from '../../hooks/use-debounce'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'

type Customer = {
    id: number
    name: string
    email: string
    vat_number: string
    address: string | null
}

interface CustomersTableProps {
    customers: Customer[]
    searchQuery: string
}

export function CustomersTable({
    customers,
    searchQuery,
}: CustomersTableProps) {
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
                    placeholder="Search customers..."
                    className="max-w-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button asChild>
                    <Link to="create">New Customer</Link>
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>VAT Number</TableHead>
                            <TableHead>Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center h-24"
                                >
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium">
                                        {customer.name}
                                    </TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.vat_number}</TableCell>
                                    <TableCell>{customer.address}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
