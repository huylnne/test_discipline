import { Discipline, Project } from "../@types/discipline";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { httpClient } from "./http-client";
import { API_ENDPOINTS } from "../common/constants";

export default class DisciplineApi {
  static getAll(): Observable<Discipline[]> {
  return httpClient
    .get<{ items: Discipline[] }>(`${API_ENDPOINTS.DISCIPLINE}?MaxResultCount=500`)
    .pipe(
      map((res) => {
        const items = res.items || [];
        return items.map((item: Partial<Discipline> & { projectId?: string; projectCode?: string }) => ({
          id: item.id ?? item.projectId ?? "",
          code: item.code ?? "",
          name: item.name ?? item.projectCode ?? "Không có tên",
          description: item.description ?? "",
          isActive: item.isActive ?? true,
        }));
      }),
      catchError((err) => {
        console.error(" DisciplineApi.getAll() error:", err);
        return [];
      })
    );
}


  static getById(id: string): Observable<Discipline | null> {
    return httpClient.get(`${API_ENDPOINTS.DISCIPLINE}/${id}`).pipe(
      map(res => res as Discipline || null)
    );
  }

  static create(data: Omit<Discipline, "id" | "code">): Observable<Discipline | null> {
    return httpClient.post(API_ENDPOINTS.DISCIPLINE, data).pipe(
      map(res => res as Discipline || null)
    );
  }

  static update(id: string, data: Discipline): Observable<Discipline | null> {
    return httpClient.put(`${API_ENDPOINTS.DISCIPLINE}/${id}`, data).pipe(
      map(res => res as Discipline || null)
    );
  }

  static delete(id: string): Observable<boolean> {
    return httpClient.delete(`${API_ENDPOINTS.DISCIPLINE}/${id}`).pipe(
      map(() => true),
      catchError(() => [false])
    );
  }

  static getProjects(): Observable<Project[]> {
    return httpClient.get(API_ENDPOINTS.PROJECT).pipe(
      map(res => (res as { items: Project[] }).items || [])
    );
  }
}