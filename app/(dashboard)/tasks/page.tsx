'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar as CalendarIcon,
  User,
  Trash2,
  List,
  Calendar,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  MessageSquare,
} from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';
import { Task } from '@/lib/mock-data';

export default function TasksPage() {
  const {
    tasks,
    clients,
    toggleTaskCompletion,
    updateTaskStatus,
    deleteTask,
    addTask,
  } = useDashboard();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showEmptyStatePreview, setShowEmptyStatePreview] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState(clients[0]?.name || 'Aura Cosmetics Global');
  const [newAssignee, setNewAssignee] = useState('Samantha William');
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');
  const [newStatus, setNewStatus] = useState<Task['status']>('pending');
  const [newDueDate, setNewDueDate] = useState('Tomorrow');
  const [newDescription, setNewDescription] = useState('');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addTask({
      title: newTitle,
      clientName: newClient,
      dueDate: newDueDate || 'In 3 days',
      priority: newPriority,
      status: newStatus,
      category: 'Video Production',
      assignee: {
        name: newAssignee,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        role: 'Creative Lead',
      },
    });

    setNewTitle('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  // Calendar mock days for Month Calendar view (Figma Board 3)
  const calendarDays = [
    { day: 1, date: 'Mon, Apr 1' },
    { day: 2, date: 'Tue, Apr 2' },
    { day: 3, date: 'Wed, Apr 3' },
    { day: 4, date: 'Thu, Apr 4' },
    { day: 5, date: 'Fri, Apr 5' },
    { day: 6, date: 'Sat, Apr 6' },
    { day: 7, date: 'Sun, Apr 7' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header matching Figma Board 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visualise your work with a board, calendar, or list view.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View switcher matching Figma */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-berry shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Calendar View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-berry shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List View</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowEmptyStatePreview(!showEmptyStatePreview)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {showEmptyStatePreview ? 'Show Tasks' : 'Preview Empty State'}
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-berry hover:bg-[#A01E6F] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>+ Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search task title or client..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-berry transition-all"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['all', 'pending', 'in_progress', 'review', 'completed'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-berry text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all'
                ? 'All Tasks'
                : status === 'in_progress'
                ? 'In Progress'
                : status}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State or Main View */}
      {showEmptyStatePreview || filteredTasks.length === 0 ? (
        /* Empty State matching Figma Board 3 */
        <div className="rounded-2xl bg-white p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-berry/10 text-berry ring-8 ring-berry/5">
            <CheckSquare className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            Visualise your work with a board
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            Plan editorial deadlines, manage script approvals, and coordinate team tasks.
          </p>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-berry hover:bg-[#A01E6F] text-white shadow-sm transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Add Task</span>
          </button>
        </div>
      ) : viewMode === 'calendar' ? (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-900">April 2024</span>
              <span className="text-xs text-slate-400">Weekly Schedule</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md hover:border-berry/40 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        task.priority === 'high'
                          ? 'bg-rose-100 text-rose-700'
                          : task.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {task.dueDate}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">{task.clientName}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-full bg-berry text-white flex items-center justify-center text-[10px] font-bold">
                      {task.assignee?.name ? task.assignee.name[0] : 'S'}
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium truncate max-w-25">
                      {task.assignee?.name || 'Samantha'}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      task.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : task.status === 'review'
                        ? 'bg-purple-50 text-purple-700'
                        : task.status === 'in_progress'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {task.status === 'in_progress' ? 'In Progress' : task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* List View matching Figma Board 3 */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Task</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Assignee</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                            task.completed
                              ? 'bg-berry border-berry text-white'
                              : 'border-slate-300 hover:border-berry'
                          }`}
                        >
                          {task.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </button>
                        <span className={`font-semibold text-slate-800 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {task.clientName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {task.assignee?.name || 'Samantha William'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {task.dueDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          task.priority === 'high'
                            ? 'bg-rose-100 text-rose-700'
                            : task.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          task.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : task.status === 'review'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : task.status === 'in_progress'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {task.status === 'in_progress' ? 'In Progress' : task.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedTask(task)}
                          className="p-1.5 text-slate-400 hover:text-berry rounded-lg hover:bg-slate-100 transition-colors"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Task Modal matching Figma Board 3 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Task</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Edit TikTok Reel hook variations"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client
                </label>
                <select
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-berry"
                  >
                    <option value="pending">To Do / Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Due Date
                </label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  placeholder="e.g. Apr 15, 2024"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Task instructions, video format, or script notes..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-berry"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-berry hover:bg-[#A01E6F] rounded-xl shadow-xs cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Details Modal matching Figma Board 3 */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-berry uppercase tracking-wider">
                  Task Details
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedTask.title}</h3>
                <p className="text-xs text-slate-500">{selectedTask.clientName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Assignee</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedTask.assignee?.name || 'Samantha William'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Due Date</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedTask.dueDate}</p>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                  Change Status
                </label>
                <select
                  value={selectedTask.status}
                  onChange={(e) => {
                    const newSt = e.target.value as any;
                    updateTaskStatus(selectedTask.id, newSt);
                    setSelectedTask({ ...selectedTask, status: newSt });
                  }}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
                >
                  <option value="pending">To Do / Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Task Notes</p>
                <p className="text-slate-600 leading-relaxed">
                  Campaign creative deliverables must adhere to client brand palette guidelines. Export in 9:16 for Reels and 4:5 for feed.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-berry hover:bg-[#A01E6F] rounded-xl shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
