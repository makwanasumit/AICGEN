"use client"
import { data } from '@/app/(data)/Templates'
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDown, Copy, CheckIcon, Calendar, Hash, FileText } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useMemo } from 'react'
import Markdown from 'react-markdown'


export type History = {
    id: number,
    templateSlug: string,
    aiResponse: string,
    createdAt: string
}

type Props = {
    history: History[]
}

type SortField = 'id' | 'templateSlug' | 'createdAt'
type SortDirection = 'asc' | 'desc'

const HistoryList: React.FC<Props> = ({ history }) => {
    // console.log(history)

    const [sortField, setSortField] = useState<SortField>('createdAt')
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
    const [copiedId, setCopiedId] = useState<number | null>(null)
    const [showToast, setShowToast] = useState(false)

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const sortedHistory = useMemo(() => {
        return [...history].sort((a, b) => {
            let aValue: string | number
            let bValue: string | number

            switch (sortField) {
                case 'id':
                    aValue = a.id
                    bValue = b.id
                    break
                case 'templateSlug':
                    aValue = a.templateSlug.toLowerCase()
                    bValue = b.templateSlug.toLowerCase()
                    break
                case 'createdAt':
                    aValue = new Date(a.createdAt).getTime()
                    bValue = new Date(b.createdAt).getTime()
                    break
                default:
                    return 0
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
            return 0
        })
    }, [history, sortField, sortDirection])

    const copyToClipboard = async (text: string, id: number) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedId(id)
            setShowToast(true)

            // Hide toast after 2 seconds
            setTimeout(() => {
                setShowToast(false)
                setCopiedId(null)
            }, 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    const getTemplateIcon = (slug: string) => {
        const template = data.find(t => t.slug === slug)
        return template ? (
            <Image
                src={template.icon}
                alt={template.name}
                width={24}
                height={24}
                className="rounded"
            />
        ) : (
            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">?</span>
            </div>
        )
    }

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ChevronsUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
        }
        return sortDirection === 'asc' ?
            <ArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" /> :
            <ArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
    }

    // Utility function to truncate text and strip markdown
    const getTruncatedText = (text: string, maxLength: number = 150) => {
        // Simple markdown stripping - removes common markdown syntax
        const stripped = text
            .replace(/[#*_`]/g, '') // Remove markdown formatting
            .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Convert links to just text
            .replace(/\n+/g, ' ') // Replace newlines with spaces
            .trim()

        return stripped.length > maxLength ? stripped.substring(0, maxLength) + '...' : stripped
    }

    function formatSlug(slug: string) {
        return slug
            .split("-")                             // split at hyphens
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // capitalize each word
            .join(" ");                             // join with space
    }


    return (
        <div className=" relative mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 px-2">History</h1>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-4 right-4 bg-indigo-500 font-semibold text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-top-2 text-sm">
                    <CheckIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Copied to clipboard!</span>
                    <span className="sm:hidden">Copied!</span>
                </div>
            )}

            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
                {sortedHistory.map((data) => (
                    <div key={data.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-600">{data.id}</span>
                                </div>
                                {getTemplateIcon(data.templateSlug)}
                            </div>
                            <button
                                onClick={() => copyToClipboard(data.aiResponse, data.id)}
                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-900 text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1 transition-colors"
                                disabled={copiedId === data.id}
                            >
                                {copiedId === data.id ? (
                                    <CheckIcon className="w-4 h-4" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">{data.templateSlug}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(data.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="mt-3">
                                <p className="text-sm text-gray-700 line-clamp-3">
                                    {getTruncatedText(data.aiResponse)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto shadow-md rounded-lg border bg-white border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                className="px-3 xl:px-6 py-3 text-left text-xs xl:text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('id')}
                            >
                                <div className="flex items-center gap-1 xl:gap-2">
                                    <span className="hidden xl:inline">#</span>
                                    <span className="xl:hidden">ID</span>
                                    {getSortIcon('id')}
                                </div>
                            </th>
                            <th className="px-3 xl:px-6 py-3 text-left text-xs xl:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Icon
                            </th>
                            <th
                                className="px-3 xl:px-6 py-3 text-left text-xs xl:text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('templateSlug')}
                            >
                                <div className="flex items-center gap-1 xl:gap-2">
                                    Template {getSortIcon('templateSlug')}
                                </div>
                            </th>
                            <th className="px-3 xl:px-6 py-3 text-left text-xs xl:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                AI Response
                            </th>
                            <th
                                className="px-3 xl:px-6 py-3 text-left text-xs xl:text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('createdAt')}
                            >
                                <div className="flex items-center gap-1 xl:gap-2">
                                    Date {getSortIcon('createdAt')}
                                </div>
                            </th>
                            <th className="px-3 xl:px-6 py-3 text-left text-xs xl:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedHistory.map((data,idx) => (
                            <tr key={data.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-3 xl:px-6 py-4 whitespace-nowrap text-xs xl:text-sm text-gray-900">
                                    {idx+1}
                                </td>
                                <td className="px-3 xl:px-6 py-4 whitespace-nowrap">
                                    {getTemplateIcon(data.templateSlug)}
                                </td>
                                <td className="px-3 xl:px-6 py-4 whitespace-nowrap text-xs xl:text-sm font-medium text-gray-900 max-w-32 xl:max-w-none">
                                    <span className="truncate block">{formatSlug(data.templateSlug)}</span>
                                </td>
                                <td className="px-3 xl:px-6 py-4 text-xs xl:text-sm text-gray-700 max-w-48 xl:max-w-md">
                                    <div className="line-clamp-2 xl:line-clamp-3 overflow-hidden">
                                        <div className='className="prose prose-xs xl:prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"'>
                                            <Markdown >
                                                {data.aiResponse}
                                            </Markdown>
                                        </div >
                                    </div>
                                </td>
                                <td className="px-3 xl:px-6 py-4 whitespace-nowrap text-xs xl:text-sm text-gray-500">
                                    <span className="hidden xl:inline">{new Date(data.createdAt).toLocaleDateString()}</span>
                                    <span className="xl:hidden">{new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </td>
                                <td className="px-3 xl:px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => copyToClipboard(data.aiResponse, data.id)}
                                        className="flex items-center justify-center text-indigo-600 hover:text-indigo-900 text-xs xl:text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded p-1 xl:px-3 xl:py-1 transition-colors w-8 xl:w-20"
                                        disabled={copiedId === data.id}
                                    >
                                        {copiedId === data.id ? (
                                            <CheckIcon className="w-3 h-3 xl:w-4 xl:h-4" />
                                        ) : (
                                            <Copy className="w-3 h-3 xl:w-4 xl:h-4" />
                                        )}
                                        <span className="hidden xl:inline ml-1">
                                            {copiedId === data.id ? 'Copied' : 'Copy'}
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Tablet View - Simplified Table */}
            <div className="hidden md:block lg:hidden overflow-x-auto shadow-md rounded-lg border bg-white border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('id')}
                            >
                                <div className="flex items-center gap-2">
                                    ID {getSortIcon('id')}
                                </div>
                            </th>
                            <th
                                className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('templateSlug')}
                            >
                                <div className="flex items-center gap-2">
                                    Template {getSortIcon('templateSlug')}
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Response
                            </th>
                            <th
                                className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleSort('createdAt')}
                            >
                                <div className="flex items-center gap-2">
                                    Date {getSortIcon('createdAt')}
                                </div>
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Copy
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedHistory.map((data) => (
                            <tr key={data.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                    <div className="flex items-center gap-2">
                                        {getTemplateIcon(data.templateSlug)}
                                        {data.id}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm font-medium text-gray-900 max-w-32">
                                    <span className="truncate block">{data.templateSlug}</span>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-700 max-w-64">
                                    <p className="line-clamp-2 overflow-hidden">
                                        {getTruncatedText(data.aiResponse)}
                                    </p>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => copyToClipboard(data.aiResponse, data.id)}
                                        className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded p-2 transition-colors"
                                        disabled={copiedId === data.id}
                                    >
                                        {copiedId === data.id ? (
                                            <CheckIcon className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {history.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No history items found.</p>
                    <p className="text-sm">Your AI responses will appear here once you start using templates.</p>
                </div>
            )}
        </div>
    )
}

export default HistoryList