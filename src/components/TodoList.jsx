import React from 'react';

const TodoList = ({content, deleteTodo}) => {
    return (
        <li className='w-100 d-flex bg-light p-1 rounded align-items-center mb-2'>
            <span className='text-dark'>{content.content}</span>
            <button onClick={() => deleteTodo(content.id)} className='btn btn-danger ms-auto'>X</button>
        </li>
    );
};

export default TodoList; 