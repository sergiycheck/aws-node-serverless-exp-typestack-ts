import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookDTO {
  @IsString()
  name: string;

  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateBookDTO {
  @IsString()
  name: string;
  @IsOptional()
  description?: string;
}
