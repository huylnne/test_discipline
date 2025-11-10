import axios, { AxiosRequestConfig } from "axios";
import { from, Observable } from "rxjs";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.hawee.hicas.vn/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const httpClient = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return from(instance.get<T>(url, config).then(res => res.data));
  },
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Observable<T> {
    return from(instance.post<T>(url, data, config).then(res => res.data));
  },
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Observable<T> {
    return from(instance.put<T>(url, data, config).then(res => res.data));
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return from(instance.delete<T>(url, config).then(res => res.data));
  },
};