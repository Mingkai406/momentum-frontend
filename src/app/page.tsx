'use client';
import { useState, useEffect } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Deploy to AWS EC2", status: "in-progress", priority: "high" },
    { id: 2, title: "Setup CI/CD Pipeline", status: "todo", priority: "medium" },
    { id: 3, title: "PostgreSQL Integration", status: "todo", priority: "high" },
    { id: 4, title: "Docker Configuration", status: "completed", priority: "low" }
  ]);
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }

  const handleAddTask = () => {
    const newTask = {
      id: tasks.length + 1,
      title: `New Task ${tasks.length + 1}`,
      status: "todo",
      priority: "medium"
    };
    setTasks([...tasks, newTask]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
              <p className="text-gray-600 text-sm mt-1">Welcome, {user?.username || 'User'}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-bold text-lg mb-4">📋 To Do</h2>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'todo').map(task => (
                <div key={task.id} className="p-4 rounded-lg border-l-4 bg-gray-50 border-gray-400">
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
                <div key={task.id} className="p-4 rounded-lg border-l-4 bg-blue-50 border-blue-500">
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
                <div key={task.id} className="p-4 rounded-lg border-l-4 bg-green-50 border-green-500 opacity-75">
                  <h3 className="font-medium text-gray-600 line-through">{task.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleAddTask}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add New Task
        </button>
      </main>
    </div>
  );
}
