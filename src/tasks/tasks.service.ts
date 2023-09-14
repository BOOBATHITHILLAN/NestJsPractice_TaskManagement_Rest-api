import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid'
import { createTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/tasksFilter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilter(filterDto: GetTasksFilterDto) {
        const { status, search } = filterDto;

        let tasks = this.getAllTasks();
        if (status) {
            tasks = tasks.filter(task => task.status === status)
        }
        if (search) {
            tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
        }

        return tasks;
    }

    createTask(createTaskDto: createTaskDto): Task {

        const { title, description } = createTaskDto;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        }

        this.tasks.push(task);
        return task
    }

    getTaskById(id: string): Task {
        const found=this.tasks.find(task => task.id === id);
        if(found){
            return found
        }else{
           throw new NotFoundException(`Task with ID=${id} not found`);
        }
    }

    deleteTaskById(id: string) {
        const found=this.getTaskById(id)
        if(found){
            this.tasks = this.tasks.filter(task => task.id !== id)
            return "Task deleted successfully "
        }        
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
