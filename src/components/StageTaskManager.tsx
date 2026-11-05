import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, X, MapPin, CheckCircle2 } from 'lucide-react';
import { TaskItem } from '../data';

interface StageTaskManagerProps {
  stageId: 'prep-srilanka' | 'airport-cmb' | 'transit-pvg' | 'flight-hak' | 'arrival-campus';
  stageTitle: string;
  stageSubtitle: string;
  stageBadge?: string;
  badgeColor?: string;
  tasks: TaskItem[];
  onToggleReady: (id: string) => void;
  onTogglePacked: (id: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'status' | 'isReady' | 'isPacked'>) => void;
  onUpdateTask: (id: string, updated: Partial<TaskItem>) => void;
  onDeleteTask: (id: string) => void;
}

export const StageTaskManager: React.FC<StageTaskManagerProps> = ({
  stageId,
  stageTitle,
  stageSubtitle,
  stageBadge,
  badgeColor = 'bg-slate-100 text-slate-700 border-slate-200',
  tasks,
  onToggleReady,
  onTogglePacked,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newCategory, setNewCategory] = useState('Custom Task');
  const [newLocation, setNewLocation] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDetail, setEditDetail] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const handleStartEdit = (t: TaskItem) => {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditDetail(t.detail || '');
    setEditCategory(t.category);
    setEditLocation(t.location || '');
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    onUpdateTask(id, {
      title: editTitle.trim(),
      detail: editDetail.trim() || undefined,
      category: editCategory.trim() || 'General',
      location: editLocation.trim() || undefined,
    });
    setEditingId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      stage: stageId,
      title: newTitle.trim(),
      detail: newDetail.trim() || undefined,
      category: newCategory.trim() || 'General',
      location: newLocation.trim() || undefined,
    });

    setNewTitle('');
    setNewDetail('');
    setNewLocation('');
    setShowAddForm(false);
  };

  const readyCount = tasks.filter((t) => t.isReady).length;
  const packedCount = tasks.filter((t) => t.isPacked).length;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      {/* Stage Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{stageTitle}</h3>
            {stageBadge && (
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                {stageBadge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{stageSubtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-slate-500 block text-[11px]">Ready / Packed</span>
            <span className="font-mono font-bold text-slate-800">
              {readyCount} ready • {packedCount} packed of {tasks.length}
            </span>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>
        </div>
      </div>

      {/* Add Task Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 text-xs">
          <div className="font-bold text-slate-800">Add New Step or Custom Note to this Phase</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Step / Action Title (e.g. Call dorm supervisor upon reaching Haidian)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="sm:col-span-2 px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003580]"
              autoFocus
            />
            <input
              type="text"
              placeholder="Category (e.g. Dormitory, Buddy)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003580]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Detailed instructions or phone numbers"
              value={newDetail}
              onChange={(e) => setNewDetail(e.target.value)}
              className="sm:col-span-2 px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003580]"
            />
            <input
              type="text"
              placeholder="Target bag or location (e.g. Fanny Pack)"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003580]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#003580] hover:bg-[#00224f] text-white font-medium shadow-xs"
            >
              Save Step
            </button>
          </div>
        </form>
      )}

      {/* Task List Items */}
      <div className="divide-y divide-slate-100">
        {tasks.map((task) => {
          const isEditing = editingId === task.id;

          if (isEditing) {
            return (
              <div key={task.id} className="p-4 bg-blue-50/40 border-l-4 border-blue-600 space-y-2 text-xs">
                <div className="font-semibold text-blue-950">Editing Task / Step Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="sm:col-span-2 px-3 py-1.5 border border-blue-300 rounded bg-white font-semibold text-slate-900"
                  />
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="px-3 py-1.5 border border-blue-300 rounded bg-white text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={editDetail}
                    onChange={(e) => setEditDetail(e.target.value)}
                    className="sm:col-span-2 px-3 py-1.5 border border-blue-300 rounded bg-white text-slate-700"
                  />
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="px-3 py-1.5 border border-blue-300 rounded bg-white text-slate-700"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(task.id)}
                    className="px-3 py-1 bg-[#003580] text-white rounded font-medium hover:bg-[#00224f]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={task.id}
              className={`p-3.5 sm:p-4 flex items-start gap-3 transition-colors hover:bg-slate-50/80 ${
                task.isPacked ? 'bg-slate-50/50' : ''
              }`}
            >
              {/* Dual Upfront Ticks: Ready at home + Packed into bag */}
              <div className="flex items-center gap-2 pt-0.5 shrink-0">
                {/* 1. Ready Checkbox */}
                <label className="flex items-center cursor-pointer" title="Step 1: Ready / Verified at Home">
                  <input
                    type="checkbox"
                    checked={task.isReady}
                    onChange={() => onToggleReady(task.id)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                  />
                </label>

                {/* 2. Packed in Travel Bag Checkbox */}
                <label className="flex items-center cursor-pointer" title="Step 2: Physically Packed / In Hand">
                  <input
                    type="checkbox"
                    checked={task.isPacked}
                    onChange={() => onTogglePacked(task.id)}
                    className="w-4 h-4 rounded border-slate-300 text-[#003580] focus:ring-[#003580] cursor-pointer"
                  />
                </label>
              </div>

              {/* Text Info Container (Strict boundary wrapping to prevent mobile overflow) */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex flex-wrap items-baseline justify-between gap-1.5 mb-0.5">
                  <span className={`text-xs sm:text-sm font-semibold break-words ${task.isPacked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {task.title}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {task.category}
                    </span>
                  </div>
                </div>

                {task.detail && (
                  <p className="text-xs text-slate-500 leading-relaxed break-words">
                    {task.detail}
                  </p>
                )}

                {task.location && (
                  <div className="text-[11px] text-[#003580] font-medium mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="break-words">{task.location}</span>
                  </div>
                )}
              </div>

              {/* Action buttons (Edit & Delete) */}
              <div className="flex items-center gap-1 shrink-0 self-start pt-0.5">
                <button
                  onClick={() => handleStartEdit(task)}
                  className="p-1 rounded text-slate-400 hover:text-[#003580] hover:bg-slate-100 transition-colors"
                  title="Edit task or alter date/time"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
