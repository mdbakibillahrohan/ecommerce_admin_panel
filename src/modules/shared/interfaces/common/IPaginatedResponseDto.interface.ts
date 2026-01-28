import type { IResponseDto } from "./IResponseDto.interface";

export interface IPaginatedResponseDto<T> extends IResponseDto<T[]>{
  total:number;
  page: number,
  pageSize: number;
  totalPages: number;
}
