import { Injectable } from '@nestjs/common';
import type { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserSummaryDto } from './dto/user-summary.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async listUsers(): Promise<UserSummaryDto[]> {
    const users = await this.prismaService.user.findMany({
      orderBy: [{ fullName: 'asc' }, { email: 'asc' }],
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    return users.map((user) => this.toUserSummaryDto(user));
  }

  private toUserSummaryDto(user: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
  }): UserSummaryDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      initials: this.toInitials(user.fullName),
      role: user.role,
    };
  }

  private toInitials(fullName: string) {
    return fullName
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}
