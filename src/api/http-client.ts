import { ajax } from "rxjs/ajax";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.hawee.hicas.vn/api";

export const httpClient = {
  get<T = unknown>(url: string, options?: { headers?: Record<string, string> }): Observable<T> {
  return ajax({
    url: `${baseURL}${url}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  }).pipe(
    map((res) => res.response as T),
    catchError((err) => throwError(() => err))
  );
},


  post<T = unknown>(url: string, body?: unknown, headers?: Record<string, string>): Observable<T> {
    return ajax({
      url: `${baseURL}${url}`,
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body,
    }).pipe(map((res) => res.response as T));
  },

  put<T = unknown>(url: string, body?: unknown, headers?: Record<string, string>): Observable<T> {
    return ajax({
      url: `${baseURL}${url}`,
      method: "PUT",
      headers: { "Content-Type": "application/json", ...headers },
      body,
    }).pipe(map((res) => res.response as T));
  },

  delete<T = unknown>(url: string, headers?: Record<string, string>): Observable<T> {
    return ajax({
      url: `${baseURL}${url}`,
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...headers },
    }).pipe(map((res) => res.response as T));
  },
};
