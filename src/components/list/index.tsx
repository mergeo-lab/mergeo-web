import { cn } from '@/lib/utils';
import React from 'react';

// Types for List Component
interface ListProps<T> {
    dataSource: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    className?: string;
}

// Types for List.Item Component
interface ListItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

// Types for List.Item.Meta Component
interface ListItemMetaProps {
    title: string;
    className?: string;
}

// List Component
const List = <T,>({ dataSource, renderItem, className }: ListProps<T>) => {
    return (
        <div className={cn('transition-all flex flex-col', className)}>
            {dataSource.map((item, index) => (
                <div key={index}>{renderItem(item, index)}</div>
            ))}
        </div>
    );
};

// List.Item Component
const ListItem: React.FC<ListItemProps> & { Meta: React.FC<ListItemMetaProps> } = ({ children, onClick, className }) => {
    return (
        <div
            onClick={onClick}
            className={cn('cursor-pointer border border-border p-3 hover:bg-accent', className)}
        >
            {children}
        </div>
    );
};

// List.Item.Meta Component
const ListItemMeta: React.FC<ListItemMetaProps> = ({ title, className }) => {
    return (
        <div className={cn('text-sm', className)}>
            {title}
        </div>
    );
};

// Assigning Meta as a static property of ListItem
ListItem.Meta = ListItemMeta;

// Assigning ListItem as a static property of List
List.Item = ListItem;

export default List;
