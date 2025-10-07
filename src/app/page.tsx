'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut as cognitoSignOut } from '@/lib/auth';

interface Task {
  taskId: string;
  title: string;
  status: string;
  priority: string;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://momentum-backend-m4u6.onrender.com';

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const token = localStorage.getItem('userToken');
    
    if (!email || !token) {
      router.push('/login');
      return;
    }
    
    setUserEmail(email);
    fetchTasks(email);
  }, []);

  const fetchTasks = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${userId}`);
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    const title = prompt('Enter task title:');
    if (!title) return;

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userEmail,
          title: title,
          status: 'todo',
          priority: 'medium'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setTasks([...tasks, data.task]);
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleTaskClick = async (task: Task) => {
    const newStatus = 
      task.status === 'todo' ? 'in-progress' :
      task.status === 'in-progress' ? 'completed' : 'todo';

    try {
      const response = await fetch(`${API_URL}/api/tasks/${userEmail}/${task.taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          priority: task.priority
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setTasks(tasks.map(t => 
          t.taskId === task.taskId ? { ...t, status: newStatus } : t
        ));
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleSignOut = () => {
    cognitoSignOut();
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Momentum
              </h1>
              <p className="text-gray-600 text-sm mt-1">Welcome, {userEmail}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <p className="text-2xl font-bold">{tasks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Todo</p>
            <p className="text-2xl font-bold text-gray-600">
              {tasks.filter(t => t.status === 'todo').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => t.status === 'in-progress').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed').length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-bold text-lg mb-4">📋 To Do</h2>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'todo').map(task => (
                <div 
                  key={task.taskId}
                  onClick={() => handleTaskClick(task)}
                  className="p-4 rounded-lg border-l-4 bg-gray-50 border-gray-400 hover:shadow-md transition-all cursor-pointer"
                >
                  <h3 className="font-medium">{task.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full inline-block mt-2 ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-bold text-lg mb-4">🚀 In Progress</h2>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'in-progress').map(task => (
                <div 
                  key={task.taskId}
                  onClick={() => handleTaskClick(task)}
                  className="p-4 rounded-lg border-l-4 bg-blue-50 border-blue-500 hover:shadow-md transition-all cursor-pointer"
                >
                  <h3 className="font-medium">{task.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-bold text-lg mb-4">✅ Completed</h2>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'completed').map(task => (
                <div 
                  key={task.taskId}
                  onClick={() => handleTaskClick(task)}
                  className="p-4 rounded-lg border-l-4 bg-green-50 border-green-500 opacity-75 cursor-pointer"
                >
                  <h3 className="font-medium text-gray-600 line-through">{task.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleAddTask}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg"
        >
          + Add New Task
        </button>
      </main>
    </div>
  );
}
