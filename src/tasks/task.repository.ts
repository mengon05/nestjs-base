import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks.-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  lol: string;
  async createTask(task: CreateTaskDto, user: User) {
    const newTask = new Task();

    newTask.title = task.title;
    newTask.description = task.description;
    newTask.status = TaskStatus.OPEN;
    newTask.user = user;
    await newTask.save();
    return newTask;
  }

  async getTasks(filtered: GetTaskFilterDto, user: User) {
    const { search, status } = filtered;
    const query = this.createQueryBuilder('task');

    query.where('task.user.id = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.title LIKE :search or task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    const tasks = query.getMany();
    return tasks;
  }
}
