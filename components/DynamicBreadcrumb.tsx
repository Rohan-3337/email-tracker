'use client'

import { usePathname } from 'next/navigation'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'


export default function DynamicBreadcrumb() {
    function capitalize(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1).replace(/-/g, ' ')
    }
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const href = '/' + segments.slice(0, index + 1).join('/')
                    const isLast = index === segments.length - 1

                    return (
                        <div key={href} className="flex items-center">
                            {index !== 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{capitalize(segment)}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>{capitalize(segment)}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </div>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
