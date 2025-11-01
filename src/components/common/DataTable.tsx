'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/hooks/useLocale';

export interface DataTableColumn<T> {
    key: string;
    header: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
    className?: string;
    headerClassName?: string;
}

export interface DataTableAction<T> {
    label: string;
    onClick: (item: T) => void;
    variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
    icon?: React.ReactNode;
    show?: (item: T) => boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    actions?: DataTableAction<T>[];
    isLoading?: boolean;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
    keyExtractor: (item: T) => string;
}

export function DataTable<T = unknown>({
    data,
    columns,
    actions,
    isLoading,
    emptyMessage = 'No data available',
    onRowClick,
    keyExtractor,
}: DataTableProps<T>) {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const { isRTL } = useLocale();

    const handleSort = (columnKey: string) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortColumn) return 0;

        const aValue = (a as Record<string, unknown>)[sortColumn];
        const bValue = (b as Record<string, unknown>)[sortColumn];

        if (aValue === bValue) return 0;

        // Handle null/undefined values
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        // Type-safe comparison
        const comparison = String(aValue).localeCompare(String(bValue));
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="fz-16 text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead
                                key={column.key}
                                className={cn(
                                    isRTL ? "text-right" : "text-left",
                                    column.headerClassName
                                )}
                            >
                                {column.sortable ? (
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort(column.key)}
                                        className="h-8 px-2 -mx-2 hover:bg-transparent fz-14 font-medium"
                                    >
                                        {column.header}
                                        {sortColumn === column.key ? (
                                            sortDirection === 'asc' ? (
                                                <ArrowUp className="ms-2 h-4 w-4" />
                                            ) : (
                                                <ArrowDown className="ms-2 h-4 w-4" />
                                            )
                                        ) : (
                                            <ArrowUpDown className="ms-2 h-4 w-4 opacity-50" />
                                        )}
                                    </Button>
                                ) : (
                                    <span className="fz-14 font-medium">{column.header}</span>
                                )}
                            </TableHead>
                        ))}
                        {actions && actions.length > 0 && (
                            <TableHead className={cn(
                                "w-[200px]",
                                isRTL ? "text-right" : "text-left"
                            )}>
                                <span className="fz-14 font-medium">Actions</span>
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedData.map((item) => (
                        <TableRow
                            key={keyExtractor(item)}
                            onClick={() => onRowClick?.(item)}
                            className={onRowClick ? 'cursor-pointer' : ''}
                        >
                            {columns.map((column) => (
                                <TableCell
                                    key={column.key}
                                    className={cn(
                                        isRTL ? "text-right" : "text-left",
                                        column.className
                                    )}
                                >
                                    {column.render
                                        ? column.render(item)
                                        : (item as Record<string, unknown>)[column.key]?.toString() || '-'}
                                </TableCell>
                            ))}
                            {actions && actions.length > 0 && (
                                <TableCell className={cn(
                                    "w-[200px]",
                                    isRTL ? "text-right" : "text-lext"
                                )}>
                                    <div className={cn(
                                        "flex gap-2",
                                        isRTL ? "justify-start" : "justify-end"
                                    )}>
                                        {actions.map((action, index) => {
                                            const shouldShow = action.show ? action.show(item) : true;
                                            if (!shouldShow) return null;

                                            return (
                                                <Button
                                                    key={index}
                                                    variant={action.variant || 'outline'}
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        action.onClick(item);
                                                    }}
                                                    className="fz-12"
                                                >
                                                    {action.icon && (
                                                        <span className="me-1">{action.icon}</span>
                                                    )}
                                                    {action.label}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
