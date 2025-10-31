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

        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue === bValue) return 0;

        const comparison = aValue > bValue ? 1 : -1;
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
        <div className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead
                                key={column.key}
                                className={column.headerClassName}
                            >
                                {column.sortable ? (
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort(column.key)}
                                        className="h-8 px-2 hover:bg-transparent fz-14 font-medium"
                                    >
                                        {column.header}
                                        {sortColumn === column.key ? (
                                            sortDirection === 'asc' ? (
                                                <ArrowUp className="ml-2 h-4 w-4" />
                                            ) : (
                                                <ArrowDown className="ml-2 h-4 w-4" />
                                            )
                                        ) : (
                                            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                                        )}
                                    </Button>
                                ) : (
                                    <span className="fz-14 font-medium">{column.header}</span>
                                )}
                            </TableHead>
                        ))}
                        {actions && actions.length > 0 && (
                            <TableHead className="text-right">
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
                                    className={column.className}
                                >
                                    {column.render
                                        ? column.render(item)
                                        : item[column.key]?.toString() || '-'}
                                </TableCell>
                            ))}
                            {actions && actions.length > 0 && (
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
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
                                                        <span className="mr-1">{action.icon}</span>
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
