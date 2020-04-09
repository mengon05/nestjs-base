import { Repository } from 'typeorm';

export function repositorySpyFactory<T>(): SpiedRepository<T> {
  return {
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
  } as SpiedRepository<T>;
}
export type Spied<T> = {
  -readonly [Key in keyof T]?: T[Key] extends (...args: any[]) => any
    ? jest.Mock<any, any>
    : T[Key];
};

export type SpiedRepository<T> = Spied<T> & Spied<Repository<T>>;
