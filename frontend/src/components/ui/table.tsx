import React from "react";
import { clsx } from "clsx";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="overflow-x-auto">
      <table
        ref={ref}
        className={clsx(
          "w-full text-sm border-collapse",
          className
        )}
        {...props}
      />
    </div>
  )
);

Table.displayName = "Table";

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={clsx(
        "bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700",
        className
      )}
      {...props}
    />
  )
);

TableHeader.displayName = "TableHeader";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={clsx(
        "border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
        className
      )}
      {...props}
    />
  )
);

TableRow.displayName = "TableRow";

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={clsx("px-4 py-3", className)} {...props} />
  )
);

TableCell.displayName = "TableCell";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={clsx(
        "px-4 py-3 text-left font-semibold text-slate-900 dark:text-white",
        className
      )}
      {...props}
    />
  )
);

TableHead.displayName = "TableHead";
