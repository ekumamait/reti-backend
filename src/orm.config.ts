import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const config: TypeOrmModuleOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "@Qwerty65",
    database: "Users",
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true
}