import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  const usersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  } as unknown as UsersService;

  const jwtService = {
    sign: jest.fn().mockReturnValue('token'),
  } as unknown as JwtService;

  const service = new AuthService(usersService, jwtService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a new user', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(usersService, 'create').mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      role: Role.USER,
      name: 'User',
    } as never);

    const hashSpy = bcrypt.hash as jest.Mock;
    hashSpy.mockResolvedValue('hashed');

    const response = await service.register({
      email: 'user@example.com',
      name: 'User',
      password: 'password123',
    });

    expect(hashSpy).toHaveBeenCalledWith('password123', 10);
    expect(response.accessToken).toBe('token');
    expect(response.user.email).toBe('user@example.com');
  });

  it('throws for duplicate registration', async () => {
    jest
      .spyOn(usersService, 'findByEmail')
      .mockResolvedValue({ id: '1' } as never);

    await expect(
      service.register({
        email: 'user@example.com',
        name: 'User',
        password: 'password123',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('throws on invalid login password', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      role: Role.USER,
      name: 'User',
      password: 'hashed',
    } as never);

    const compareSpy = bcrypt.compare as jest.Mock;
    compareSpy.mockResolvedValue(false);

    await expect(
      service.login({
        email: 'user@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
