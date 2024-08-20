import useSWR, { Key, mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

import { fireAuth } from "@/config/firebase";
import { ErrorResponse, errorResponseSchema } from "@/schema/error";

/**
 * データ取得フック
 * @description
 * - GET リクエストを送信する
 * - `tye T = z.infer<typeof schema>`
 */
export const useFetch = <T>(path: string[], schema: z.ZodSchema) => {
  const fetcher = async (url: string) => {
    const response = await fetch(url, { headers: { ...(await newBearerTokenHeader()) } });
    const rawData = await response.json();
    if (!response.ok) throw errorResponseSchema.parse(rawData);
    const { data, success, error } = schema.safeParse(rawData);
    if (success) return data;
    console.error(error);
    throw error;
  };

  const { data, error } = useSWR<T, ErrorResponse>(newUrl(path), fetcher);
  const refetch = () => mutate<T>(newUrl(path));

  return { data, error, refetch };
};

/**
 * データ取得フック (遅延読み込み)
 * @description
 * - GET リクエストを送信する
 * - `tyoe T = z.infer<typeof schema>`
 * - **データ取得は手動でトリガーする**
 */
export const useDeferredFetch = <T>(path: string[], schema: z.ZodSchema) => {
  const fetcher = async (url: string) => {
    const response = await fetch(url, { headers: { ...(await newBearerTokenHeader()) } });
    const rawData = await response.json();
    if (!response.ok) throw errorResponseSchema.parse(rawData);
    const { data, success, error } = schema.safeParse(rawData);
    if (success) return data;
    console.error(error);
    throw error;
  };

  const { data, error, trigger } = useSWRMutation<T, ErrorResponse, Key>(newUrl(path), fetcher);

  return { data, error, trigger };
};

export type HttpMehtod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * データ更新フック
 * @description
 * - POST, PUT, DELETE リクエストを送信する
 * - `type T = z.infer<typeof schema>`
 * @param path API のエンドポイント (e.g. ["me"])
 * @param schema default null レスポンスのスキーマ
 * @param method default POST リクエストメソッド
 */
export const useMutation = <V = Record<string, never>, T = null>(
  path: string[],
  {
    schema = z.null(),
    method = "POST",
  }: {
    schema?: z.ZodSchema;
    method?: HttpMehtod;
  },
) => {
  const fetcher = async (url: string, { arg }: { arg: { data?: V } | undefined }) => {
    const response = await fetch(url, {
      method,
      headers: {
        ...(await newBearerTokenHeader()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arg?.data),
    });

    if (response.status === 404) throw new Error(`api not found: ${url}`);
    if (response.status === 204) return null;
    const data = await response.json();
    if (!response.ok) throw errorResponseSchema.parse(data);
    return schema.parse(data);
  };

  const { data, error, isMutating, trigger, reset } = useSWRMutation<T, ErrorResponse, Key, { data?: V } | undefined>(
    newUrl(path),
    fetcher,
  );

  return { data, error, isMutating, trigger, reset };
};

const newBearerTokenHeader = async (): Promise<{ Authorization: string }> => {
  const token = await fireAuth.currentUser?.getIdToken();
  if (!token) throw new Error("No token provided");
  return { Authorization: `Bearer ${token}` };
};

const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT_ROOT;
const newUrl = (path: string[]) => [baseUrl, ...path].join("/").replaceAll("//", "/").replace(":/", "://");
