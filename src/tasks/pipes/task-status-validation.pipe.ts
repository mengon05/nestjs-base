import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { TaskStatus } from '../tasks.-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  transform(value: TaskStatus, metada: ArgumentMetadata) {
    console.log(
      '​TaskStatusValidationPipe -> transform -> TaskStatus',
      TaskStatus,
    );

    if (!(value in TaskStatus)) {
      throw new BadRequestException(`'${value}' is not a valid status`);
    }
  }
}
