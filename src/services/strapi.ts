// TODO: Change for environment variable
const API_URL = `https://cms.leads1llc.com`;
import qs from "qs";

export async function strapiGet(path: string, params?: {}) {
  let url = `${API_URL}${path}`;
  if (params) {
    url += `?${qs.stringify(params)}`;

  }
  return await fetch(url);
}

export function strapiResourceUrl(path: string): string {
  return `localhost:1337${path}`;
}

export async function strapiPost(path: string, params?: {}) {
  return await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: params })
  });
}
