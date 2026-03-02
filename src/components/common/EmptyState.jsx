import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

export default function EmptyState({
    icon = <PackageOpen className="h-12 w-12 text-gray-400" />,
    title = "No data found",
    description = "There is nothing here at the moment. Please check back later.",
    actionText,
    actionLink
}) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 min-h-[300px]">
            <div className="bg-white dark:bg-gray-950 p-4 rounded-full shadow-sm border border-gray-100 dark:border-gray-800 mb-4 inline-flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">{description}</p>

            {actionText && actionLink && (
                <Link to={actionLink}>
                    <Button>{actionText}</Button>
                </Link>
            )}
        </div>
    );
}
