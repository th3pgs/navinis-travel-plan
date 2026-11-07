import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, X, MapPin } from 'lucide-react';
import { TaskItem } from '../data';
import { AppIcon } from './AppIcon';

interface StageTaskManagerProps {
  stageId: 'prep-srilanka' | 'airport-cmb' | 'transit-pvg' | 'flight-hak' | 'arrival-campus';
  stageTitle: string;
  stageSubtitle: string;
  stageBadge?: string;
  badgeColor?: string;
  tasks: TaskItem[];
  onToggleReady: (id: string) => void;
  onTogglePacked: (id: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'isReady' | 'isPacked'>) => void;
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
  const [newCategory, setNewCategory] = useState('General');
  const [newLocation, setNewLocation] = useState('');
  const [newIcon, setNewIcon] = useState('doc');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDetail, setEditDetail] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editIcon, setEditIcon] = useState('doc');

  const handleStartEdit = (t: TaskItem) => {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditDetail(t.detail || '');
    setEditCategory(t.category);
    setEditLocation(t.location || '');
    setEditIcon(t.appIcon || 'doc');
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    onUpdateTask(id, {
      title: editTitle.trim(),
      detail: editDetail.trim() || undefined,
      category: editCategory.trim() || 'General',
      location: editLocation.trim() || undefined,
      appIcon: editIcon,
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
      appIcon: newIcon,
    });

    setNewTitle('');
    setNewDetail('');
    setNewLocation('');
    setShowAddForm(false);
  };

  const total = tasks.length;
  const readyCount = tasks.filter((t) => t.isReady).length;
  const packedCount = tasks.filter((t) => t.isPacked).length;

  const readyPct = total > 0 ? Math.round((readyCount / total) * 100) : 0;
  const packedPct = total > 0 ? Math.round((packedCount / total) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden transition-all">
      {/* Stage Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
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

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full md:w-auto">
          {/* Dual Task Bars under widget header */}
          <div className="w-48 space-y-1.5 text-[10px]">
            {/* Line 1: Ready / Verified at Home */}
            <div className="flex items-center justify-between font-medium">
              <span className="text-emerald-700">Line 1: Ready ({readyCount}/{total})</span>
              <span className="font-mono text-slate-600">{readyPct}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${readyPct}%` }}
              />
            </div>

            {/* Line 2: Packed in Travel Bag */}
            <div className="flex items-center justify-between font-medium pt-0.5">
              <span className="text-[#003580]">Line 2: Packed ({packedCount}/{total})</span>
              <span className="font-mono text-slate-600">{packedPct}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
              <div
                className="bg-[#003580] h-full transition-all duration-300"
                style={{ width: `${packedPct}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Step</span>
          </button>
        </div>
      </div>

      {/* Add Task Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 text-xs">
          <div className="font-bold text-slate-800">Add New Step or Custom Note to this Phase</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input
              type="text"
              placeholder="Step / Action Title (e.g. Call dorm supervisor upon arrival)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="sm:col-span-2 px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003580]"
              autoFocus
            />
            <input
              type="text"
              placeholder="Category (e.g. Campus, Dorm)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003580]"
            />
            <select
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              className="px-2 py-2 border border-slate-300 rounded bg-white text-slate-700"
            >
              <option value="doc">📄 Document</option>
              <option value="wechat">💬 WeChat</option>
              <option value="alipay">💳 Alipay</option>
              <option value="didi">🚗 DiDi / Taxi</option>
              <option value="bank">🏦 Bank</option>
              <option value="dialog">📱 Dialog SIM</option>
              <option value="shadowrocket">🚀 Shadowrocket</option>
              <option value="battery">🔋 Battery</option>
            </select>
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
          const isFullyDone = task.isReady && task.isPacked;

          if (isEditing) {
            return (
              <div key={task.id} className="p-4 bg-blue-50/40 border-l-4 border-blue-600 space-y-2 text-xs">
                <div className="font-semibold text-blue-950">Editing Task Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
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
                  <select
                    value={editIcon}
                    onChange={(e) => setEditIcon(e.target.value)}
                    className="px-2 py-1.5 border border-blue-300 rounded bg-white text-slate-700"
                  >
                    <option value="doc">📄 Document</option>
                    <option value="wechat">💬 WeChat</option>
                    <option value="alipay">💳 Alipay</option>
                    <option value="didi">🚗 DiDi / Taxi</option>
                    <option value="bank">🏦 Bank</option>
                    <option value="dialog">📱 Dialog SIM</option>
                    <option value="shadowrocket">🚀 Shadowrocket</option>
                    <option value="battery">🔋 Battery</option>
                  </select>
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
              className={`p-3 sm:p-4 flex items-start gap-3 transition-colors ${
                isFullyDone ? 'bg-emerald-50/20' : 'hover:bg-slate-50/80'
              }`}
            >
              {/* Dual Upfront Ticks: Ready at home + Packed into bag */}
              <div className="flex items-center gap-2 pt-0.5 shrink-0">
                {/* 1. Ready Checkbox */}
                <label className="flex items-center cursor-pointer" title="Line 1: Ready / Verified at Home">
                  <input
                    type="checkbox"
                    checked={task.isReady}
                    onChange={() => onToggleReady(task.id)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                  />
                </label>

                {/* 2. Packed in Travel Bag Checkbox */}
                <label className="flex items-center cursor-pointer" title="Line 2: Physically Packed in Travel Bag">
                  <input
                    type="checkbox"
                    checked={task.isPacked}
                    onChange={() => onTogglePacked(task.id)}
                    className="w-4 h-4 rounded border-slate-300 text-[#003580] focus:ring-[#003580] cursor-pointer"
                  />
                </label>
              </div>

              {/* Service / App Brand Icon */}
              <div className="pt-0.5 shrink-0">
                <AppIcon name={task.appIcon} className="w-4 h-4" />
              </div>

              {/* Text Info Container with Strict Boundary Wrapping */}
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

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 self-start pt-0.5">
                <button
                  onClick={() => handleStartEdit(task)}
                  className="p-1 rounded text-slate-400 hover:text-[#003580] hover:bg-slate-100 transition-colors"
                  title="Edit step"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
                      onDeleteTask(task.id);
                    }
                  }}
                  className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors"
                  title="Delete step"
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
