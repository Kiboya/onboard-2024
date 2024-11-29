import { Body, Controller, Post } from '@nestjs/common';
import { PlanningService } from 'src/planning/planning.service';
import { ClassDto } from 'src/dto/class.dto';

@Controller('planning')
export class PlanningController {
    constructor(private readonly planningService: PlanningService) {}

    @Post('addclass')
    async addClass(@Body() ClassDto: ClassDto) {
    const class_instance = await this.planningService.addClass(ClassDto);
    return { message: 'Class added successfully', class_instance };
    }

}
