import React, { useState } from 'react'
import {
  RiEditBoxFill,
  RiDeleteBack2Fill,
  RiArrowUpCircleFill,
  RiArrowDownCircleFill,
} from 'react-icons/ri'
import * as S from './style'

const TaskList = ({ tasks, setTasks }) => {
  const [editingTask, setEditingTask] = useState(null)
  const [editedName, setEditedName] = useState('')
  const [editedCost, setEditedCost] = useState('')
  const [editedDueDate, setEditedDueDate] = useState('')

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const handleDelete = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'DELETE',
      })
      setTasks(tasks.filter((task) => task._id !== taskId))
    } catch (error) {
      console.error('Erro ao deletar a tarefa:', error)
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setEditedName(task.name)
    setEditedCost(task.cost)
    setEditedDueDate(task.dueDate)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const updatedTask = {
      ...editingTask,
      name: editedName,
      cost: Number(editedCost),
      dueDate: editedDueDate,
    }

    try {
      const response = await fetch(
        `http://localhost:5000/tasks/${editingTask._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        },
      )

      if (response.ok) {
        const taskData = await response.json()
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskData._id ? taskData : task,
          ),
        )
        setEditingTask(null)
      } else {
        console.error('Erro ao atualizar a tarefa')
      }
    } catch (error) {
      console.error('Erro ao atualizar a tarefa:', error)
    }
  }

  return (
    <S.ListContainer>
      <h2>Lista de Tarefas</h2>
      <S.List>
        {tasks.map((task) => (
          <S.ItenList key={task._id} highlight={task.cost > 900}>
            {editingTask && editingTask._id === task._id ? (
              <form
                onSubmit={handleUpdate}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <S.EditContainer>
                  <S.ListInput
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    required
                  />
                  <S.ListInput
                    type="number"
                    value={editedCost}
                    onChange={(e) => setEditedCost(e.target.value)}
                    required
                  />
                  <S.ListInput
                    type="date"
                    value={editedDueDate}
                    onChange={(e) => setEditedDueDate(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      padding: 0,
                    }}
                  >
                    <S.CheckboxIcon type="submit" />
                  </button>
                </S.EditContainer>
              </form>
            ) : (
              <>
                <RiEditBoxFill onClick={() => handleEdit(task)} />
                {task.name} - R$ {task.cost} - {formatDate(task.dueDate)}
                <RiDeleteBack2Fill onClick={() => handleDelete(task._id)} />
                <RiArrowUpCircleFill />
                <RiArrowDownCircleFill />
              </>
            )}
          </S.ItenList>
        ))}
      </S.List>
    </S.ListContainer>
  )
}

export { TaskList }
