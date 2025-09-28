import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Skeleton component - animated placeholder for loading states
 * @param {Object} props
 * @param {string} [props.variant='text'] - Variant (text, rectangular, circular)
 * @param {number|string} [props.width] - Width (number in px or string)
 * @param {number|string} [props.height] - Height (number in px or string)
 * @param {string} [props.className] - Additional CSS classes
 */
const Skeleton = ({
  variant = 'text',
  width,
  height,
  className,
  ...props
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';

  const variantClasses = {
    text: 'h-4',
    rectangular: 'h-8',
    circular: 'rounded-full'
  };

  const styles = {};
  if (width) styles.width = typeof width === 'number' ? `${width}px` : width;
  if (height) styles.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={styles}
      {...props}
    />
  );
};

/**
 * Skeleton for Product Card
 */
const ProductCardSkeleton = ({ className }) => (
  <div className={cn('border rounded-lg p-4 shadow-sm', className)}>
    <Skeleton variant="rectangular" height={200} className="mb-4" />
    <Skeleton variant="text" width="80%" className="mb-2" />
    <Skeleton variant="text" width="60%" className="mb-2" />
    <Skeleton variant="text" width="40%" className="mb-4" />
    <div className="flex gap-2">
      <Skeleton variant="rectangular" width={80} height={32} />
      <Skeleton variant="rectangular" width={60} height={32} />
    </div>
  </div>
);

/**
 * Skeleton for Table Rows
 */
const TableRowSkeleton = ({ columns = 4, className }) => (
  <div className={cn('animate-pulse', className)}>
    {Array.from({ length: columns }, (_, i) => (
      <div key={i} className="h-4 bg-gray-200 rounded flex-1 mr-4 last:mr-0">
        <Skeleton variant="text" width={`${Math.random() * 40 + 60}%`} />
      </div>
    ))}
  </div>
);

/**
 * Skeleton for Table
 */
const TableSkeleton = ({ rows = 5, columns = 4, className }) => (
  <div className={cn('border rounded-lg', className)}>
    {/* Header */}
    <div className="bg-gray-50 p-4 border-b">
      <div className="flex">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={`${Math.random() * 30 + 50}px`}
            className="mr-4 last:mr-0"
          />
        ))}
      </div>
    </div>

    {/* Body */}
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </div>
  </div>
);

/**
 * Skeleton for Form Input
 */
const FormFieldSkeleton = ({ className }) => (
  <div className={cn('space-y-2', className)}>
    <Skeleton variant="text" width={100} height={16} />
    <Skeleton variant="rectangular" height={40} />
  </div>
);

/**
 * Skeleton for Form
 */
const FormSkeleton = ({ fields = 3, className }) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: fields }, (_, i) => (
      <FormFieldSkeleton key={i} />
    ))}
    <div className="flex gap-2 pt-4">
      <Skeleton variant="rectangular" width={80} height={40} />
      <Skeleton variant="rectangular" width={100} height={40} />
    </div>
  </div>
);

/**
 * Skeleton for Card/List items
 */
const ListItemSkeleton = ({ className }) => (
  <div className={cn('flex items-center space-x-4 p-4 border-b', className)}>
    <Skeleton variant="circular" width={40} height={40} />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </div>
    <Skeleton variant="rectangular" width={80} height={32} />
  </div>
);

/**
 * Skeleton for Avatar
 */
const AvatarSkeleton = ({ size = 40, className }) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
    className={className}
  />
);

/**
 * Skeleton for Badge/Pill
 */
const BadgeSkeleton = ({ className }) => (
  <Skeleton variant="rectangular" width={60} height={24} className={className} />
);

/**
 * Skeleton for Button
 */
const ButtonSkeleton = ({ width = 80, height = 32, className }) => (
  <Skeleton
    variant="rectangular"
    width={width}
    height={height}
    className={cn('rounded-md', className)}
  />
);

/**
 * Skeleton for Progress Bar
 */
const ProgressSkeleton = ({ width = '100%', height = 4, className }) => (
  <Skeleton
    variant="rectangular"
    width={width}
    height={height}
    className={className}
  />
);

/**
 * Complex layout skeleton for dashboard-like pages
 */
const DashboardSkeleton = ({ className }) => (
  <div className={cn('space-y-6', className)}>
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton variant="text" width={200} height={24} />
        <Skeleton variant="text" width={300} height={16} />
      </div>
      <div className="flex gap-2">
        <ButtonSkeleton width={100} />
        <ButtonSkeleton width={120} />
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-3">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-1">
              <Skeleton variant="text" width={60} />
              <Skeleton variant="text" width={80} />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Content Area */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg border">
        <Skeleton variant="text" width={150} height={20} className="mb-4" />
        <TableSkeleton rows={3} columns={3} />
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <Skeleton variant="text" width={120} height={20} className="mb-4" />
        <ListItemSkeleton />
        <ListItemSkeleton />
        <ListItemSkeleton />
      </div>
    </div>
  </div>
);

/**
 * Image skeleton with aspect ratio
 */
const ImageSkeleton = ({ aspectRatio = '16/9', className }) => (
  <div
    className={cn('bg-gray-200 animate-pulse rounded', className)}
    style={{ aspectRatio }}
  />
);

export default Skeleton;
export {
  Skeleton,
  ProductCardSkeleton,
  TableSkeleton,
  TableRowSkeleton,
  FormSkeleton,
  FormFieldSkeleton,
  ListItemSkeleton,
  AvatarSkeleton,
  BadgeSkeleton,
  ButtonSkeleton,
  ProgressSkeleton,
  DashboardSkeleton,
  ImageSkeleton
};
