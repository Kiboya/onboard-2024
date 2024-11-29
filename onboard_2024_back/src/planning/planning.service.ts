import { Injectable } from '@nestjs/common';
import { ClassDto } from 'src/dto/class.dto';
import { Planning } from './planning.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PlanningService {
    constructor(
        @InjectRepository(Planning)
        private planningRepository: Repository<Planning>,
        private jwtService: JwtService,
    ) {}

    async addClass(ClassDto: ClassDto): Promise <Planning> 
    {
        const class_instance = this.planningRepository.create(ClassDto);
        return await this.planningRepository.save(class_instance);
    }

}
