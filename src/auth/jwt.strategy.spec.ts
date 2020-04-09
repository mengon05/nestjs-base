import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { SpiedRepository, repositorySpyFactory } from '../../test/test.utils';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: SpiedRepository<UserRepository>;
  process.env.JWT_SECRET = 'secretJest';
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(UserRepository),
          useFactory: repositorySpyFactory,
        },
      ],
    }).compile();

    jwtStrategy = module.get(JwtStrategy);
    userRepository = module.get(getRepositoryToken(UserRepository));
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const user = new User();
      user.username = 'TestUser';

      userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({ username: 'TestUser' });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: 'TestUser',
      });
      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception as user cannot be found', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(jwtStrategy.validate({ username: 'TestUser' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
