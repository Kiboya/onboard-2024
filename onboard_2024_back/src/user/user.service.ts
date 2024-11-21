import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { ConflictException, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { UserDto } from "src/dto/user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneByLogin(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: {username} });
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: { id }
    });
  }

  async findProfile(token: string): Promise<User> {
    const decoded = this.jwtService.decode(token) as any; // Decodez le token pour obtenir les informations de l'utilisateur
    const userId = decoded?.sub; // 'sub' est l'ID de l'utilisateur dans le payload
    return this.findById(userId); // Récupérez l'utilisateur par ID
  }
  async updateProfile(token: string, updateUserDto: UserDto): Promise<User> {
    const user = await this.findProfile(token);


    // Mettre à jour les autres champs du profil si nécessaire
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }
}
