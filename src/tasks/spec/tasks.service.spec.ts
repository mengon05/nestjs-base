import { TaskRepository } from '../task.repository';
import { TasksService } from '../tasks.service';
import { Test } from '@nestjs/testing';
import { GetTaskFilterDto } from '../dto/get-task-filter.dto';
import { TaskStatus } from '../tasks.-status.enum';
import { User } from '../../auth/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  SpiedRepository,
  repositorySpyFactory,
} from '../../../test/test.utils';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 1, password: 'p', username: 'JestTester' } as User;

describe('TaskService', () => {
  let taskService: TasksService;
  let taskRep: SpiedRepository<TaskRepository>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(TaskRepository),
          useFactory: repositorySpyFactory,
        },
        TasksService,
      ],
    }).compile();

    taskService = module.get(TasksService);
    taskRep = module.get(getRepositoryToken(TaskRepository));
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('getTask', () => {
    it('get all task from the repository', async () => {
      taskRep.getTasks = jest.fn();
      taskRep.getTasks.mockResolvedValue('a value');
      expect(taskRep.getTasks).not.toHaveBeenCalled();
      const dto: GetTaskFilterDto = {
        status: TaskStatus.OPEN,
        search: 'a search',
      };
      const val = await taskService.getTasks(dto, mockUser);
      expect(taskRep.getTasks).toHaveBeenCalled();
      expect(val).toBe('a value');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepo.findOne and successfuly retrieve and return the task', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Test desc',
      };
      taskRep.findOne.mockResolvedValue(mockTask);
      const result = await taskService.getTaskBy(1, mockUser);
      expect(result).toBe(mockTask);
    });
    it('throws an error when no found', async () => {
      taskRep.findOne.mockResolvedValue(null);
      expect(taskService.getTaskBy(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('createTask', () => {
    it('should created a task', async () => {
      const mockDto = { title: 'A task', description: 'jest' };
      taskRep.createTask = jest.fn();
      taskRep.createTask.mockResolvedValue('ok');
      const result = await taskService.createTask(mockDto, mockUser);
      expect(result).toBe('ok');
    });
  });
});
