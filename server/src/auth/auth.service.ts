// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user.entity';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async register(name: string, email: string, password: string) {
    const existingUser = await this.usersRepo.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists. Try a different one.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usersRepo.create({ name, email, password: hashedPassword });
    return this.usersRepo.save(newUser);
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ 
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'] // Include needed fields
    });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Remove password before returning
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role
      }),
      user: userWithoutPassword
    };
  }
}
