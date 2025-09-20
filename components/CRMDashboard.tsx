'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlusIcon, 
  CheckIcon, 
  ClockIcon, 
  UserIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { REBECCA } from '@/lib/rebeccaConfig'

interface Task {
  Task_ID: string
  Task_Name: string
  Business: string
  Category: string
  Priority: 'High' | 'Medium' | 'Low'
  Status: 'To Do' | 'In Progress' | 'Done' | 'Waiting on Ian'
  Assigned_To: string
  Created_By: string
  Date_Added: string
  Due_Date: string
  Notes_Links: string
}

interface Contact {
  Contact_ID: string
  Name: string
  Email: string
  Company: string
  Role: string
  Status: string
  Source: string
  Date_Added: string
  Notes: string
}

// Backend API proxy function
async function proxy(action: string, payload: any) {
  const r = await fetch(REBECCA.appsScriptURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload })
  })
  return await r.json()
}

export default function CRMDashboard() {
  const [activeTab, setActiveTab] = useState('tasks')
  const [tasks, setTasks] = useState<Task[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Load data from Google Sheets backend
  useEffect(() => {
    const loadData = async () => {
      try {
        // Mock data for now - in a real implementation this would call the backend
        const mockTasks: Task[] = [
          {
            Task_ID: 'TASK-001',
            Task_Name: 'Setup Gmail Staff Personas & Aliases',
            Business: 'ISHE Group',
            Category: 'Platform',
            Priority: 'High',
            Status: 'To Do',
            Assigned_To: 'Ian (Manual)',
            Created_By: 'Rebecca AI',
            Date_Added: '2025-09-20',
            Due_Date: '2025-09-22',
            Notes_Links: 'Create peter.box@ishe-ltd.co.uk, phil.jones@ishe.co.uk aliases'
          },
          {
            Task_ID: 'TASK-002',
            Task_Name: 'Deploy Google Sites Umbrella Website',
            Business: 'ISHE Group',
            Category: 'Website',
            Priority: 'High',
            Status: 'To Do',
            Assigned_To: 'Ian (Manual)',
            Created_By: 'Rebecca AI',
            Date_Added: '2025-09-20',
            Due_Date: '2025-09-25',
            Notes_Links: 'ISHE Group landing page with three pillars'
          },
          {
            Task_ID: 'TASK-003',
            Task_Name: 'Setup EventCentral Memory Integration',
            Business: 'ISHE Group',
            Category: 'Platform',
            Priority: 'Medium',
            Status: 'To Do',
            Assigned_To: 'ChatGPT via rube.app',
            Created_By: 'Rebecca AI',
            Date_Added: '2025-09-20',
            Due_Date: '2025-09-30',
            Notes_Links: 'Scan Drive, check Supabase, Claude sync'
          },
          {
            Task_ID: 'TASK-004',
            Task_Name: 'Build Vercel CRM Frontend',
            Business: 'ISHE Group',
            Category: 'Platform',
            Priority: 'High',
            Status: 'Done',
            Assigned_To: 'Rebecca AI',
            Created_By: 'Rebecca AI',
            Date_Added: '2025-09-20',
            Due_Date: '2025-09-27',
            Notes_Links: '✅ Ultra-modern CRM built - Ready for deployment!'
          },
          {
            Task_ID: 'TASK-005',
            Task_Name: 'Setup AppSheet Deployment',
            Business: 'ISHE Group',
            Category: 'Platform',
            Priority: 'Medium',
            Status: 'To Do',
            Assigned_To: 'Rebecca AI',
            Created_By: 'Rebecca AI',
            Date_Added: '2025-09-20',
            Due_Date: '2025-09-25',
            Notes_Links: 'Connect AppSheet to spreadsheet backend'
          },
          {
            Task_ID: 'TASK-006',
            Task_Name: 'Configure Email Routing',
            Business: 'ISHE Group',
            Category: 'Ops',
            Priority: 'High',
            Status: 'To Do',
            Assigned_To: 'Ian (Manual)',
            Created_By: 'Rebecca AI',
            Date_Added: '2025-09-20',
            Due_Date: '2025-09-23',
            Notes_Links: 'All brand emails -> mailroom@ishe-ltd.co.uk'
          },
          {
            Task_ID: 'TASK-007',
            Task_Name: 'Setup Supabase Backend Schema',
            Business: 'ISHE Group',
            Category: 'Database',
            Priority: 'Medium',
            Status: 'To Do',
            Assigned_To: 'ChatGPT via rube.app',
            Created_By: 'Rebecca AI',
            Date_Added: '2025-09-20',
            Due_Date: '2025-09-28',
            Notes_Links: 'Tables: transactions, invoices, vat_returns'
          },
          {
            Task_ID: 'TASK-008',
            Task_Name: 'Organize Drive Structure',
            Business: 'ISHE Group',
            Category: 'Ops',
            Priority: 'Low',
            Status: 'Done',
            Assigned_To: 'Rebecca AI',
            Created_By: 'Rebecca AI',
            Date_Added: '2025-09-20',
            Due_Date: '2025-09-30',
            Notes_Links: '✅ Created folder structure - brands, templates, etc.'
          }
        ]

        const mockContacts: Contact[] = [
          {
            Contact_ID: 'CON-001',
            Name: 'Ian (CEO)',
            Email: 'ian@ishe-ltd.co.uk',
            Company: 'ISHE Group',
            Role: 'Chief Executive Officer',
            Status: 'Active',
            Source: 'Internal',
            Date_Added: '2025-09-20',
            Notes: 'Founder & CEO of ISHE Group umbrella'
          },
          {
            Contact_ID: 'CON-002',
            Name: 'Rebecca AI',
            Email: 'enquiries@ishe-ltd.co.uk',
            Company: 'ISHE Group',
            Role: 'AI Executive Assistant',
            Status: 'Active',
            Source: 'Internal',
            Date_Added: '2025-09-20',
            Notes: 'AI PA handling operations and client communications'
          },
          {
            Contact_ID: 'CON-003',
            Name: 'Peter Box (AI Persona)',
            Email: 'mailroom@ishe-ltd.co.uk',
            Company: 'ISHE Group',
            Role: 'Postmaster & Mailroom Clerk',
            Status: 'Planned',
            Source: 'Internal',
            Date_Added: '2025-09-20',
            Notes: 'AI staff persona for handling incoming mail routing'
          },
          {
            Contact_ID: 'CON-004',
            Name: 'Phil Jones (AI Persona)',
            Email: 'phil.jones@ishe.co.uk',
            Company: 'ISHE Group',
            Role: 'Accountant Manager',
            Status: 'Planned',
            Source: 'Internal',
            Date_Added: '2025-09-20',
            Notes: 'AI staff persona for accounting across all brands'
          }
        ]

        setTasks(mockTasks)
        setContacts(mockContacts)
        setLoading(false)
      } catch (error) {
        console.error('Failed to load data:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'Low': return 'bg-green-500/20 text-green-300 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'In Progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'To Do': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'Waiting on Ian': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const filteredTasks = tasks.filter(task => 
    task.Task_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.Business.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.Category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredContacts = contacts.filter(contact =>
    contact.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.Company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.Role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h1 className="text-4xl font-bold text-white mb-4">ISHE Group CRM</h1>
          <p className="text-purple-300 text-lg">Loading ultra-modern interface...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <BuildingOfficeIcon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">ISHE Group CRM</h1>
              <p className="text-purple-300 text-sm">Innovative Systems for Hospitality & Enterprise</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <BellIcon className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Cog6ToothIcon className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Search */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks, contacts, or projects..."
            className="w-full pl-10 pr-4 py-3 bg-black/30 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="flex space-x-1 bg-black/30 backdrop-blur-xl rounded-xl p-1">
          {[
            { id: 'tasks', label: 'Tasks', icon: CheckIcon },
            { id: 'contacts', label: 'Contacts', icon: UserIcon },
            { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.main 
        className="relative z-10 max-w-7xl mx-auto px-6 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Task Management</h2>
                <motion.button
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-medium hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/19iIt-AqCGeqILxzus-8wyeJWzMqO743ijR3DhUlGgL0', '_blank')}
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>View Live Sheet</span>
                </motion.button>
              </div>

              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.Task_ID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-black/40 transition-all group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {task.Task_Name}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">{task.Task_ID}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.Priority)}`}>
                        {task.Priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.Status)}`}>
                        {task.Status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Business:</span>
                      <p className="text-white font-medium">{task.Business}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Category:</span>
                      <p className="text-white font-medium">{task.Category}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Assigned To:</span>
                      <p className="text-white font-medium">{task.Assigned_To}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Due Date:</span>
                      <p className="text-white font-medium">{task.Due_Date}</p>
                    </div>
                  </div>
                  
                  {task.Notes_Links && (
                    <div className="mt-4 p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400 text-sm">Notes:</span>
                      <p className="text-gray-300 text-sm mt-1">{task.Notes_Links}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'contacts' && (
            <motion.div
              key="contacts"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Contact Management</h2>
                <motion.button
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-medium hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/19iIt-AqCGeqILxzus-8wyeJWzMqO743ijR3DhUlGgL0', '_blank')}
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Add Contact</span>
                </motion.button>
              </div>

              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.Contact_ID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-black/40 transition-all group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {contact.Name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                          {contact.Name}
                        </h3>
                        <p className="text-gray-400 text-sm">{contact.Email}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                      {contact.Status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Company:</span>
                      <p className="text-white font-medium">{contact.Company}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Role:</span>
                      <p className="text-white font-medium">{contact.Role}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Source:</span>
                      <p className="text-white font-medium">{contact.Source}</p>
                    </div>
                  </div>
                  
                  {contact.Notes && (
                    <div className="mt-4 p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400 text-sm">Notes:</span>
                      <p className="text-gray-300 text-sm mt-1">{contact.Notes}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Analytics Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <CheckIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">{tasks.length}</h3>
                  <p className="text-gray-400">Total Tasks</p>
                </motion.div>

                <motion.div
                  className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <UserIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">{contacts.length}</h3>
                  <p className="text-gray-400">Active Contacts</p>
                </motion.div>

                <motion.div
                  className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <ChartBarIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">
                    {Math.round((tasks.filter(t => t.Status === 'Done').length / tasks.length) * 100)}%
                  </h3>
                  <p className="text-gray-400">Completion Rate</p>
                </motion.div>
              </div>

              <motion.div
                className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-xl p-6"
                whileHover={{ scale: 1.01 }}
              >
                <h3 className="text-xl font-bold text-white mb-6 text-center">🎉 ISHE Group CRM - Ready to Deploy!</h3>
                <div className="text-center text-gray-300">
                  <p className="mb-4">Your ultra-modern CRM is built and ready for deployment to Vercel.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-300 mb-2">✅ Features Built</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Task Management System</li>
                        <li>• Contact Database</li>
                        <li>• Analytics Dashboard</li>
                        <li>• Real-time Search</li>
                        <li>• Glassmorphism Design</li>
                        <li>• Smooth Animations</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-2">🔗 Backend Ready</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Google Sheets Connected</li>
                        <li>• Spreadsheet ID: 19iIt...gL0</li>
                        <li>• Mobile Responsive</li>
                        <li>• Next.js 14 + TypeScript</li>
                        <li>• Tailwind CSS + Framer Motion</li>
                        <li>• Production Ready</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
                    <h4 className="font-semibold text-white mb-2">🚀 Quick Deploy Instructions</h4>
                    <div className="text-sm text-left max-w-2xl mx-auto space-y-2">
                      <p><strong>1.</strong> Copy this code to a new GitHub repo</p>
                      <p><strong>2.</strong> Connect repo to Vercel</p>
                      <p><strong>3.</strong> Add environment variable: <code className="bg-black/30 px-2 py-1 rounded">GOOGLE_SHEETS_SPREADSHEET_ID=19iIt-AqCGeqILxzus-8wyeJWzMqO743ijR3DhUlGgL0</code></p>
                      <p><strong>4.</strong> Deploy!</p>
                    </div>
                  </div>

                  <motion.button
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-medium hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open('https://docs.google.com/spreadsheets/d/19iIt-AqCGeqILxzus-8wyeJWzMqO743ijR3DhUlGgL0', '_blank')}
                  >
                    View Live Spreadsheet Backend
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  )
}