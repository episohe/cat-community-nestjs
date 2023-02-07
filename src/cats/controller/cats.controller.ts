import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter";
import { SuccessInterceptor } from "src/common/interceptors/success.interceptor";
import { CatsService } from "../service/cats.service";
import { CatRequestDto } from "../dto/cats.request.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ReadOnlyCatDto } from "../dto/cat.dto";
import { AuthService } from "../../auth/auth.service";
import { LoginRequestDto } from "../../auth/dto/login.request.dto";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { JwtAuthGuard } from "../../auth/jwt/jwt.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("cats")
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService
  ) {}

  @ApiOperation({ summary: "현재 고양이 가져오기" })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentCat(@CurrentUser() cat) {
    return cat.readOnlyData;
  }

  @ApiResponse({
    status: 201,
    description: "회원가입 성공",
    type: ReadOnlyCatDto,
  })
  @ApiOperation({ summary: "회원가입" })
  @Post()
  async signUp(@Body() body: CatRequestDto) {
    console.log(body);
    return await this.catsService.signUp(body);
  }

  @ApiOperation({ summary: "로그인" })
  @Post("login")
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }
  @ApiOperation({ summary: "모든 고양이 가져오기" })
  @Get("all")
  getAllCat() {
    return this.catsService.getAllCat();
  }
}