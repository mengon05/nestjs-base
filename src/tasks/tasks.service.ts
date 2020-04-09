import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks.-status.enum';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private repo: TaskRepository,
  ) {}

  getTasks(filter: GetTaskFilterDto, user: User) {
    return this.repo.getTasks(filter, user);
  }

  async createTask(task: CreateTaskDto, user: User) {
    return this.repo.createTask(task, user);
  }

  async getTaskBy(id: number, user: User) {
    const entity = await this.repo.findOne({
      where: {
        id,
        user,
      },
    });
    if (!entity) throw new NotFoundException(`Task with ${id} not found`);
    return entity;
  }

  async deleteTask(id: number, user: User) {
    const result = await this.repo.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User) {
    const task = await this.getTaskBy(id, user);
    task.status = status;
    task.save();
  }
}
