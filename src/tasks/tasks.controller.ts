import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { createTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/tasksFilter.dto';
import { TaskStatusValidationPipe } from './pipes/taskStatusValidation.pipe';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    // @Get()
    // getAllTasks(): Task[] {
    //     return this.tasksService.getAllTasks()
    // }
    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto) {
        if (Object.keys(filterDto).length) {
            return this.tasksService.getTasksWithFilter(filterDto)
        } else {
            return this.tasksService.getAllTasks()
        }
    }


    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: createTaskDto): Task {
        return this.tasksService.createTask(createTaskDto)
    }

    //@Get('"id") and @Get('/:id) both are same
    @Get(':id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id)
    }

    @Delete(':id')
    deleteTaskById(@Param('id') id: string) {
        return this.tasksService.deleteTaskById(id)
    }

    @Patch(':id')
    updateTaskStatus(@Param('id') id: string, @Body('status',TaskStatusValidationPipe) status: TaskStatus): Task {
        return this.tasksService.updateTaskStatus(id, status);
    }
}
