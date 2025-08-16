import React, { useState } from 'react';
import { isheJobs } from '../data/mockData';
import { Job, JobStatus } from '../types';
import { Icon } from './Icon';

const statusColors: { [key in JobStatus]: string } = {
    'Booked': 'bg-blue-500/20 text-blue-300',
    'In Progress': 'bg-yellow-500/20 text-yellow-300',
    'Complete': 'bg-green-500/20 text-green-300',
    'Cancelled': 'bg-red-500/20 text-red-300',
};

const StatusBadge: React.FC<{ status: JobStatus }> = ({ status }) => (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>
        {status}
    </span>
);

export const JobDashboard: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>(isheJobs);
    const [filter, setFilter] = useState<JobStatus | 'All'>('All');

    const filteredJobs = filter === 'All' ? jobs : jobs.filter(job => job.status === filter);

    return (
        <div className="p-6 h-full text-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-white">ISHE Job Log</h1>
                <div className="flex items-center space-x-2 bg-gray-900/50 p-1 rounded-lg">
                    {(['All', 'Booked', 'In Progress', 'Complete'] as const).map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === f ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-700/50 text-xs text-gray-400 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Job Type</th>
                                <th className="px-6 py-3">Address</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Cost</th>
                                <th className="px-6 py-3 text-center">Paid</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {filteredJobs.map(job => (
                                <tr key={job.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{job.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{job.jobType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{job.address}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={job.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">£{job.cost.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`w-5 h-5 rounded-full mx-auto ${job.paid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
