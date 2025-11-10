import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Discipline, Project } from "../@types/discipline";
import { httpClient } from "./http-client";
import { API_ENDPOINTS } from "../common/constants";

interface PagedResponse<T> {
  items: T[];
  totalCount: number;
}

export default class DisciplineApi {
  
  static getAll(): Observable<Discipline[]> {
    const api = `${API_ENDPOINTS.DISCIPLINE}?MaxResultCount=500`;

    return httpClient.get<PagedResponse<Discipline> | Discipline[]>(api).pipe(
      map((res) => {
        
        if (Array.isArray(res)) {
          return res.map((d) => ({
            id: d.id,
            code: d.code,
            name: d.name,
            description: d.description,
            isActive: d.isActive ?? true,
          }));
        }

        
        if (
          typeof res === "object" &&
          res !== null &&
          Array.isArray((res as PagedResponse<Discipline>).items)
        ) {
          return (res as PagedResponse<Discipline>).items.map((d) => ({
            id: d.id,
            code: d.code,
            name: d.name,
            description: d.description,
            isActive: d.isActive ?? true,
          }));
        }

        
        return [];
      }),
      catchError((error) => {
        console.error("❌ DisciplineApi.getAll() error:", error);
        return throwError(() => error);
      })
    );
  }

  
  static getById(id: string): Observable<Discipline | null> {
    const api = `${API_ENDPOINTS.DISCIPLINE}/${id}`;
    return httpClient.get<Discipline>(api).pipe(
      map((res) => res ?? null),
      catchError((error) => throwError(() => error))
    );
  }

  
  static create(data: Omit<Discipline, "id" | "code">): Observable<Discipline | null> {
    const api = API_ENDPOINTS.DISCIPLINE;
    return httpClient.post<Discipline>(api, data).pipe(
      map((res) => res ?? null),
      catchError((error) => throwError(() => error))
    );
  }

  
  static update(id: string, data: Discipline): Observable<Discipline | null> {
    const api = `${API_ENDPOINTS.DISCIPLINE}/${id}`;
    return httpClient.put<Discipline>(api, data).pipe(
      map((res) => res ?? null),
      catchError((error) => throwError(() => error))
    );
  }

  
  static delete(id: string): Observable<boolean> {
    const api = `${API_ENDPOINTS.DISCIPLINE}/${id}`;
    return httpClient.delete(api).pipe(
      map(() => true),
      catchError(() => throwError(() => false))
    );
  }

  
  static getProjects(): Observable<Project[]> {
    const api = API_ENDPOINTS.PROJECT;

    return httpClient.get<PagedResponse<Project>>(api).pipe(
      map((res) => (Array.isArray(res.items) ? res.items : [])),
      catchError((error) => throwError(() => error))
    );
  }
}
