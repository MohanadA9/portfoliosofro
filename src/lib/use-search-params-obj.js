import { useSearchParams } from "react-router-dom";
export function useSearchParamsObj() {
  const [params] = useSearchParams();
  const out = {};
  params.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}
