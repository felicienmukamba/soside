import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

// Sans ce filtre, une HttpException levée dans le microservice (401, 409…) arrive à la gateway
// comme une erreur 500 générique. On transmet son statut et son message.
@Catch(HttpException)
export class HttpToRpcExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = exception.getResponse();
    const message = typeof response === 'object' && response !== null && 'message' in response ? response.message : exception.message;
    return super.catch(new RpcException({ statusCode: exception.getStatus(), message }), host);
  }
}
