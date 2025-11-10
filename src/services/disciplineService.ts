import { ajax } from "rxjs/ajax";
import { map, switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Discipline } from "../@types/discipline";

const API_BASE = "https://api.hawee.hicas.vn/api/app/discipline";
const PROJECT_BASE = "https://api.hawee.hicas.vn/api/app/project";
const TOKEN_URL = "https://api.hawee.hicas.vn/connect/token";


interface Project {
  id: string;
  name: string;
}

interface TokenResponse {
  access_token: string;
  [key: string]: unknown;
}


export const getToken$ = (): Observable<string> =>
  ajax<TokenResponse>({
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
  }).pipe(map((res) => res.response.access_token));


export const getProjects$ = (): Observable<Project[]> =>
  getToken$().pipe(
    switchMap((token) =>
      ajax
        .getJSON<{ totalCount: number; items: Project[] }>(PROJECT_BASE, {
          Authorization: `Bearer ${token}`,
        })
        .pipe(
          map((res) => res.items.map((item) => ({ id: item.id, name: item.name })))
        )
    )
  );



export const getListDiscipline$ = () =>
  ajax
    .getJSON<{ items: Discipline[]; totalCount: number }>(
      `${API_BASE}?MaxResultCount=500`
    )
    .pipe(map((res) => res.items));

export const getDiscipline$ = (id: string) =>
  ajax.getJSON<Discipline>(`${API_BASE}/${id}`);


export const createDiscipline$ = (data: Omit<Discipline, "id" | "code">) =>
  getListDiscipline$().pipe(
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
    switchMap((payload) =>
      ajax
        .post(`${API_BASE}`, payload, { "Content-Type": "application/json" })
        .pipe(map((res) => res.response))
    )
  );

export const updateDiscipline$ = (id: string, data: Discipline) =>
  ajax
    .put(`${API_BASE}/${id}`, data, { "Content-Type": "application/json" })
    .pipe(map((res) => res.response));

export const deleteDiscipline$ = (id: string) =>
  ajax.delete(`${API_BASE}/${id}`).pipe(map((res) => res.response));
