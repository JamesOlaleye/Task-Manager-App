import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { URL } from '../App';
import Task from './Task';
import TaskForm from './TaskForm';
import loadingImg from '../assets/loader.gif';

const TaskList = () => {
  // Read/Get task from database
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // post data to database backend
  const [formData, setFormData] = useState({
    name: '',
    completed: false,
  });

  const { name } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/tasks`);
      //   console.log(response);
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    // console.log(formData)
    if (name === '') {
      return toast.error('Input field cannot be empty');
    }
    try {
      await axios.post(`${URL}/api/tasks`, formData);
      toast.success('Task added successfully');
      setFormData({ ...formData, name: '' });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
    } catch (error) {}
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
      />
      <div className='--flex-between --pb'>
        <p>
          <b>Total Tasks:</b> 0
        </p>
        <p>
          <b>Completed Tasks:</b> 0
        </p>
      </div>
      <hr />
      {isLoading && (
        <div className='--flex-center'>
          <img src={loadingImg} alt='Loading' />
        </div>
      )}
      {!isLoading && tasks === 0 ? (
        <p className='--py'>No task addded. Please add a task</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return <Task key={task._id} task={task} index={index} />;
          })}
        </>
      )}
    </div>
  );
};

export default TaskList;
