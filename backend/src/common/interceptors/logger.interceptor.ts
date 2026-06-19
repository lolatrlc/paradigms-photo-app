import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma.service';
import { Request } from 'express';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //on dit à TS que c'est une requête Express
    const request = context.switchToHttp().getRequest<Request>(); 
    
    //on extrait les données proprement
    const method = request.method;
    const url = request.url;
    const body = request.body as Record<string, any>; //on caste le body
    
    const user = (request as any).user; 

    return next.handle().pipe(
      tap({
        next: async () => {
          await this.prisma.log.create({
            data: {
              action: `${method} ${url}`,
              userId: user?.userId || null,
              details: JSON.stringify(body),
            },
          });
          console.log(`LOG: Action ${method} ${url} saved.`);
        },
      }),
    );
  }
}
