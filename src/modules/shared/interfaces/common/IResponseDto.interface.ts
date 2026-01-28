
export interface IResponseDto<T>{
  data:T;
  statusCode:number;
  isSuccess:boolean;
  message:string
}
