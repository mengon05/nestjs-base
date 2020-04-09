import { TaskStatus } from '../tasks.-status.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetTaskFilterDto {
  @IsOptional()
  @IsIn(Object.keys(TaskStatus).map(k => TaskStatus[k]))
  status: TaskStatus;
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
