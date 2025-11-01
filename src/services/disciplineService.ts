import { ajax } from "rxjs/ajax";
import { map, switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Discipline } from "../store/disciplineSlice";

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

// Hàm lấy token, không dùng any, ép kiểu đúng
export const getToken$ = (): Observable<string> =>
  ajax<TokenResponse>({
    url: TOKEN_URL,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: [
      "grant_type=password",
      "scope=offline_access CxmApi",
      "client_id=CxmApi_App",
      "username=admin",
      "password=Hicas0809@Hcm",
      "remember=true"
    ].join("&"),
  }).pipe(
    map((res) => res.response.access_token)
  );

// Hàm lấy project với token
export const getProjects$ = (): Observable<Project[]> =>
  getToken$().pipe(
    switchMap((token) =>
      ajax.getJSON<{ totalCount: number; items: Project[] }>(PROJECT_BASE, {
        Authorization: `Bearer ${token}`,
      }).pipe(
        map((res) => res.items.map((item) => ({ id: item.id, name: item.name })))
      )
    )
  );

// Các hàm khác giữ nguyên
export const getListDiscipline$ = () =>
  ajax
    .getJSON<{ items: Discipline[]; totalCount: number }>(
      `${API_BASE}?MaxResultCount=150`
    )
    .pipe(map((res) => res.items));

export const getDiscipline$ = (id: string) =>
  ajax.getJSON<Discipline>(`${API_BASE}/${id}`);

export const createDiscipline$ = (data: Omit<Discipline, "id">) =>
  ajax
    .post(`${API_BASE}`, data, { "Content-Type": "application/json" })
    .pipe(map((res) => res.response));

export const updateDiscipline$ = (id: string, data: Discipline) =>
  ajax
    .put(`${API_BASE}/${id}`, data, { "Content-Type": "application/json" })
    .pipe(map((res) => res.response));

export const deleteDiscipline$ = (id: string) =>
  ajax.delete(`${API_BASE}/${id}`).pipe(map((res) => res.response));