'use client';
import { useState, useEffect } from 'react';

export default function TaskManager() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Deploy to AWS EC2", status: "in-progress", priority: "high" },
    { id: 2, title: "Setup CI/CD Pipeline", status: "todo", priority: "medium" },
    { id: 3, title: "PostgreSQL Integration", status: "todo", priority: "high" },
    { id: 4, title: "Docker Configuration", status: "completed", priority: "low" }
  ]);

  const [time, setTime] = useState(new Date());
  const [showMessage, setShowMessage] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddTask = () => {
    const newTask = {
      id: tasks.length + 1,
      title: `New Task ${tasks.length + 1}`,
      status: "todo",
      priority: "medium"
    };
    setTasks([...tasks, newTask]);
    setShowMessage('Task added successfully!');
    setTimeout(() => setShowMessage(''), 3000);
  };

  const handleSchedule = async () => {
    setShowMessage('Scheduling tasks with Go service...');
    try {
      const response = await fetch('https://momentum-go-service.onrender.com/health');
      const data = await response.json();
      setShowMessage(`Go service connected! Workers: ${data.workers}`);
    } catch (error) {
      setShowMessage('Go service is warming up... Try again in a few seconds.');
    }
    setTimeout(() => setShowMessage(''), 5000);
  };

  const handleTaskClick = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = 
          task.status === 'todo' ? 'in-progress' :
          task.status === 'in-progress' ? 'completed' : 'todo';
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Momentum
              </h1>
              <p className="text-gray-600 text-sm mt-1">Real-time Task Management with Concurrent Processing</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">System Status: <span className="text-green-600 font-semibold">Healthy</span></p>
              <p className="text-xs text-gray-400">{time.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </header>

      {showMessage && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            {showMessage}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <p className="text-2xl font-bold">{tasks.length}</p>
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
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-sm">Go Workers</p>
            <p className="text-2xl font-bold text-purple-600">10</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center">
              <span className="text-2xl mr-2">📋</span> To Do
            </h2>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'todo').map(task => (
                <div 
                  key={task.id} 
                  onClick={() => handleTaskClick(task.id)}
                  className="p-4 rounded-lg border-l-4 bg-gray-50 border-gray-400 hover:shadow-md transition-all cursor-pointer"
                >
                  <h3 className="font-medium text-gray-800">{task.title}</h3>
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
            <h2 className="font-bold text-lg mb-4 flex items-center">
              <span className="text-2xl mr-2">🚀</span> In Progress
            </h2>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'in-progress').map(task => (
                <div 
                  key={task.id}
                  onClick={() => handleTaskClick(task.id)}
                  className="p-4 rounded-lg border-l-4 bg-blue-50 border-blue-500 hover:shadow-md transition-all cursor-pointer"
                >
                  <h3 className="font-medium text-gray-800">{task.title}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-blue-600 animate-pulse">Processing...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center">
              <span className="text-2xl mr-2">✅</span> Completed
            </h2>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'completed').map(task => (
                <div 
                  key={task.id}
                  onClick={() => handleTaskClick(task.id)}
                  className="p-4 rounded-lg border-l-4 bg-green-50 border-green-500 opacity-75 cursor-pointer"
                >
                  <h3 className="font-medium text-gray-600 line-through">{task.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">Completed</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button 
            onClick={handleAddTask}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            + Add New Task
          </button>
          <button 
            onClick={handleSchedule}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
          >
            Schedule Tasks (Go Service)
          </button>
        </div>
      </main>
    </div>
  );
}
