import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CatRequestDto } from "./dto/cats.request.dto";
import { Cat } from "./cats.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}
  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;
    const isCatExist = await this.catModel.exists({ email });

    if (isCatExist) {
      throw new UnauthorizedException("해당하는 고양이는 이미 존재합니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return (
      await this.catModel.create({
        email,
        name,
        password: hashedPassword,
      })
    ).readOnlyData;
  }
}
