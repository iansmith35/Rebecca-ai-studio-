import React from 'react';
import { isheReports } from '../data/mockData';
import { Report } from '../types';
import { Icon } from './Icon';

const ReportRow: React.FC<{ report: Report }> = ({ report }) => (
    <div className="grid grid-cols-12 gap-4 items-center px-4 py-3 hover:bg-gray-800/50 transition-colors rounded-lg">
        <div className="col-span-4 flex items-center space-x-3">
            <Icon name="document-text" className="w-5 h-5 text-indigo-400" />
            <span className="font-medium text-white">{report.fileName}</span>
        </div>
        <div className="col-span-3 text-sm">{report.customer}</div>
        <div className="col-span-3 text-sm">{report.date}</div>
        <div className="col-span-1 text-sm text-gray-400">{report.fileSize}</div>
        <div className="col-span-1 text-right">
            <button 
                className="p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white"
                aria-label="Download report"
                onClick={() => alert('This would download the report PDF.')}
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
        </div>
    </div>
);

export const ReportsView: React.FC = () => {
    return (
        <div className="p-6 h-full text-gray-200">
            <h1 className="text-xl font-bold text-white mb-6">ISHE Documents & Reports</h1>
            <div className="bg-gray-900/50 rounded-lg p-4">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-4 pb-3 border-b border-gray-700/50 text-xs text-gray-400 uppercase tracking-wider">
                    <div className="col-span-4">File Name</div>
                    <div className="col-span-3">Customer</div>
                    <div className="col-span-3">Date Issued</div>
                    <div className="col-span-1">Size</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>
                {/* Rows */}
                <div className="space-y-1 mt-2">
                    {isheReports.map(report => (
                        <ReportRow key={report.id} report={report} />
                    ))}
                </div>
            </div>
        </div>
    );
};
