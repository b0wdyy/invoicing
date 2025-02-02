import { User } from '@prisma/client'
import { Link } from '@remix-run/react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '~/components/ui/sidebar'

const items = [
    {
        title: 'Home',
        url: '/dashboard',
    },
]

const invoiceItems = [
    {
        title: 'Invoices',
        url: '/dashboard/invoices',
    },
    {
        title: 'Create invoice',
        url: '/dashboard/invoices/create',
    },
]

const customerItems = [
    {
        title: 'Customers',
        url: '/dashboard/customers',
    },
    {
        title: 'Create customer',
        url: '/dashboard/customers/create',
    },
]

export function AppSidebar({ user }: { user: User }) {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>VNDL Invoicing</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Invoices</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {invoiceItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Customers</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {customerItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link to="/dashboard/settings">
                                        <span>Settings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <span>{user.email}</span>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
