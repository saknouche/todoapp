import { useState } from 'react';
import { nanoid } from 'nanoid';
import TodoList from './components/TodoList';

function App() {
   const [todoList, setTodoList] = useState([
      // { id: nanoid(8), content: 'Faire des courses' },
      // { id: nanoid(8), content: 'Projet JPA Hibernate' },
      // { id: nanoid(8), content: 'Projet JAVA EE JSP' },
   ]);
   const [input, setInput] = useState('');

   const [showValidation, setShowValidation] = useState(false);

   const deleteTodo = (id) => {
      setTodoList((todoList) => todoList.filter((todo) => todo.id !== id));
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (input === '') {
         setShowValidation(true);
         return;
      }
      setTodoList([{ id: nanoid(8), content: input }, ...todoList ]);
      setInput('');
      setShowValidation(false);
   };

   return (
      <div className='container d-flex justify-content-center'>
         <div className='col col-md-8 text-white p-5'>
            <h1 className='text-center mb-5'>Todo List</h1>
            <form action='#' method='post' onSubmit={handleSubmit}>
               <div className='group-input'>
                  <label htmlFor='todo'>Ajouter une tâche à faire</label>
                  <input
                     type='text'
                     name='todo'
                     id='todo'
                     className='form-control mt-1'
                     placeholder='votre tâche'
                     onChange={(e) => setInput(e.target.value)}
                  />
               </div>
               {showValidation && (
                  <p className='text-danger mt-2'>
                     Veuillez renseigner une tâche à faire !
                  </p>
               )}
               <button type='submit' className='btn btn-primary mt-2'>
                  Ajouter
               </button>
            </form>

            <ul className='p-0 mt-5'>
               {todoList.length === 0 && (
                  <li className='alert alert-danger'>La liste est vide</li>
               )}
               {todoList.length > 0 &&
                  todoList.map((item) => (
                     <TodoList
                        key={item.id}
                        content={item}
                        deleteTodo={deleteTodo}
                     />
                  ))}
            </ul>
         </div>
      </div>
   );
}

export default App;
