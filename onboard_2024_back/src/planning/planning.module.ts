import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Planning } from "./planning.entity";
import { JwtModule } from "@nestjs/jwt";
import { PlanningController } from "./planning.controller";
import { PlanningService } from "./planning.service";

@Module({
    imports: [
      TypeOrmModule.forFeature([Planning]), // Assurez-vous d'importer votre entité User
      JwtModule.register({
        secret: 'your_secret_key', // Remplacez par votre clé secrète
        signOptions: { expiresIn: '60s' }, // Optionnel : temps d'expiration du token
      }),
    ],
    controllers: [PlanningController],
    providers: [PlanningService],
  })
  export class PlanningModule {}
  