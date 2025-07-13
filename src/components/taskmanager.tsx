import React, { useState } from 'react';
import type { Task } from '../types';
import styles from './TaskManager.module.css'; 

const initialTasks: Task[] = [
  { id: 1, text: 'task1' },
  { id: 2, text: 'task2' },
  { id: 3, text: 'task3' },
];

export default function TaskManager(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [newTaskText, setNewTaskText] = useState<string>('');

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: newTaskText,
    };

    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const handleDeleteTask = (taskId: number): void => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleStartEdit = (task: Task): void => {
    setEditingTask({ ...task });
  };

  const handleUpdateTask = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!editingTask || !editingTask.text.trim()) return;

    setTasks(
      tasks.map(task => (task.id === editingTask.id ? editingTask : task))
    );
    
    setEditingTask(null);
  };

  const handleCancelEdit = (): void => {
    setEditingTask(null);
  };

  return (
    <div className={styles.taskManager}>
      <form onSubmit={handleAddTask} className={styles.addTaskForm}>
        <input
          type="text"
          value={newTaskText}
          // e 的类型是 React.ChangeEvent<HTMLInputElement>
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskText(e.target.value)}
          placeholder="添加一个新任务..."
        />
        <button type="submit">添加</button>
      </form>

      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <li key={task.id} className={styles.taskItem}>
            {editingTask && editingTask.id === task.id ? (
              <form onSubmit={handleUpdateTask} className={styles.editForm}>
                <input
                  type="text"
                  value={editingTask.text}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setEditingTask({ ...editingTask, text: e.target.value })
                  }
                  autoFocus
                />
                <button type="submit">保存</button>
                <button type="button" onClick={handleCancelEdit}>取消</button>
              </form>
            ) : (
              <>
                <span>{task.text}</span>
                <div className={styles.taskActions}>
                  <button onClick={() => handleStartEdit(task)}>编辑</button>
                  <button onClick={() => handleDeleteTask(task.id)} className={styles.deleteButton}>删除</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}