import { Observable, throwError } from "rxjs";
import { map, catchError, switchMap } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { Discipline, Project } from "../@types/discipline";
import { httpClient } from "./http-client";
import { API_ENDPOINTS } from "../common/constants";

interface PagedResponse<T> {
  items: T[];
  totalCount: number;
}

interface TokenResponse {
  access_token: string;
  [key: string]: unknown;
}

export default class DisciplineApi {
  
  private static getToken(): Observable<string> {
    const TOKEN_URL = "https://api.hawee.hicas.vn/connect/token";

    return ajax<TokenResponse>({
      url: TOKEN_URL,
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: [
        "grant_type=password",
        "scope=offline_access CxmApi",
        `client_id=${process.env.NEXT_PUBLIC_API_CLIENT_ID}`,
        `username=${process.env.NEXT_PUBLIC_API_USERNAME}`,
        `password=${process.env.NEXT_PUBLIC_API_PASSWORD}`,
        "remember=true",
      ].join("&"),
    }).pipe(
      map((res) => res.response.access_token),
      catchError((error) => {
        console.error(" Get token error:", error);
        return throwError(() => error);
      })
    );
  }

  
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
        console.error(" DisciplineApi.getAll() error:", error);
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
    return DisciplineApi.getAll().pipe(
      map((list) => {
        
        const isDuplicate = list.some(
          (d) => d.name.trim().toLowerCase() === data.name.trim().toLowerCase()
        );

        if (isDuplicate) {
          throw new Error("Tên danh mục đã tồn tại, vui lòng chọn tên khác.");
        }

        
        const codes = list
          .map((d) => d.code)
          .filter((c) => /^DISC\d+$/.test(c))
          .map((c) => parseInt(c.replace("DISC", ""), 10));

        const max = codes.length > 0 ? Math.max(...codes) : 0;
        const next = max + 1;
        const newCode = `DISC${String(next).padStart(2, "0")}`;

        return { ...data, code: newCode };
      }),
      switchMap((payload) => {
        const api = API_ENDPOINTS.DISCIPLINE;
        return httpClient.post<Discipline>(api, payload);
      }),
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
    return DisciplineApi.getToken().pipe(
      switchMap((token) => {
        const api = API_ENDPOINTS.PROJECT;
        return httpClient.get<PagedResponse<Project>>(api, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }),
      map((res) =>
        Array.isArray(res.items)
          ? res.items.map((p) => ({
              id: p.id,
              name: p.name,
            }))
          : []
      ),
      catchError((error) => {
        console.error(" Get projects error:", error);
        return throwError(() => error);
      })
    );
  }
}
