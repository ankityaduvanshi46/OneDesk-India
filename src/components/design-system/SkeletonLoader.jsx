import React from 'react'

/**
 * Standardized Skeleton Wireframe Loaders
 * Meets Part B requirements: reusable skeleton loaders for cards, metrics, tables, forms, and full dashboards.
 */

export function SkeletonBox({ className = 'h-4 w-full' }) {
  return (
    <div
      className={`bg-gray-200 dark:bg-royal-800/80 rounded-md animate-pulse ${className}`}
    />
  )
}

export function SkeletonCircle({ size = 'w-10 h-10' }) {
  return (
    <div
      className={`rounded-full bg-gray-200 dark:bg-royal-800/80 animate-pulse shrink-0 ${size}`}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="luxury-glass rounded-2xl p-5 space-y-4 border border-gray-100 dark:border-royal-700/60 animate-pulse">
      <div className="flex items-start justify-between">
        <SkeletonCircle size="w-12 h-12" />
        <SkeletonBox className="h-5 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <SkeletonBox className="h-5 w-3/4" />
        <SkeletonBox className="h-3.5 w-full" />
        <SkeletonBox className="h-3.5 w-5/6" />
      </div>
      <div className="pt-3 border-t border-gray-100 dark:border-royal-750 flex items-center justify-between">
        <SkeletonBox className="h-4 w-24" />
        <SkeletonBox className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  )
}

export function SkeletonMetric() {
  return (
    <div className="bg-white dark:bg-royal-850 p-4 rounded-xl border border-gray-100 dark:border-royal-700/60 space-y-2 animate-pulse">
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-3.5 w-24" />
        <SkeletonCircle size="w-6 h-6" />
      </div>
      <SkeletonBox className="h-7 w-16" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 5 }) {
  return (
    <div className="bg-white dark:bg-royal-850 rounded-2xl border border-gray-100 dark:border-royal-750 overflow-hidden shadow-sm animate-pulse">
      <div className="p-4 border-b border-gray-100 dark:border-royal-750 flex items-center justify-between">
        <SkeletonBox className="h-5 w-40" />
        <SkeletonBox className="h-8 w-32 rounded-xl" />
      </div>
      <div className="divide-y divide-gray-100 dark:divide-royal-750">
        <div className="px-6 py-3 bg-gray-50/75 dark:bg-royal-900/50 flex items-center justify-between gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonBox key={i} className="h-3 w-20" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SkeletonCircle size="w-8 h-8" />
              <div className="space-y-1">
                <SkeletonBox className="h-3.5 w-28" />
                <SkeletonBox className="h-2.5 w-20" />
              </div>
            </div>
            {Array.from({ length: columns - 2 }).map((_, c) => (
              <SkeletonBox key={c} className="h-3 w-16" />
            ))}
            <SkeletonBox className="h-7 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonForm() {
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-royal-850 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-royal-700/60 shadow-luxury space-y-6 animate-pulse">
      <div className="flex items-center justify-center gap-4 pb-4 border-b border-gray-100 dark:border-royal-750">
        <SkeletonCircle size="w-8 h-8" />
        <SkeletonBox className="h-1 w-12" />
        <SkeletonCircle size="w-8 h-8" />
        <SkeletonBox className="h-1 w-12" />
        <SkeletonCircle size="w-8 h-8" />
      </div>
      <div className="space-y-4">
        <SkeletonBox className="h-4 w-32" />
        <SkeletonBox className="h-10 w-full rounded-xl" />
        <SkeletonBox className="h-4 w-40" />
        <SkeletonBox className="h-10 w-full rounded-xl" />
        <SkeletonBox className="h-4 w-28" />
        <SkeletonBox className="h-24 w-full rounded-xl" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-royal-750">
        <SkeletonBox className="h-9 w-24 rounded-xl" />
        <SkeletonBox className="h-9 w-32 rounded-xl" />
      </div>
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-pulse">
      <div className="h-36 bg-gray-200 dark:bg-royal-800 rounded-2xl w-full" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SkeletonMetric />
        <SkeletonMetric />
        <SkeletonMetric />
        <SkeletonMetric />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <SkeletonTable rows={4} columns={4} />
        </div>
        <div className="space-y-4">
          <SkeletonCard />
        </div>
      </div>
    </div>
  )
}

export default {
  Box: SkeletonBox,
  Circle: SkeletonCircle,
  Card: SkeletonCard,
  Metric: SkeletonMetric,
  Table: SkeletonTable,
  Form: SkeletonForm,
  Dashboard: SkeletonDashboard
}
