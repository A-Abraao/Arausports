import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient"; 


type DeleteResult = { ok: true } | { ok: false; error: any };

//função que cria o hook
export function useDeleteEvent() {
  //useStates que o hook usa, loading cria efeito de loading(carregando..)
  //error serve para tratar e mostrar os erros
  //mountedRef é para montar a url para a requisição
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  //tenta deletar o evento sem dar merda
  const deletarEvento = useCallback(
    async (eventoId: string | null): Promise<DeleteResult> => {
      if (!eventoId) {
        const err = new Error("eventoId ausente");
        if (mountedRef.current) setError(err);
        return { ok: false, error: err };
      }

      //aciona o efeito de loading
      setLoading(true);
      setError(null);

      try {
        // pega usuário autenticado
        const userRes = await (supabase.auth as any).getUser?.();
        const uid = userRes?.data?.user?.id ?? null;
        if (!uid) {
          const err = new Error("Usuário não autenticado");
          if (mountedRef.current) setError(err);
          setLoading(false);
          return { ok: false, error: err };
        }

        // DELETE diretamente com dupla filtragem: id + usuario_id (garante que só o dono apague)
        const { data, error: deleteErr } = await supabase
          .from("eventos")
          .delete()
          .eq("id", eventoId)
          .eq("usuario_id", uid);

        if (deleteErr) {
          // pode ser rls, falta de permissão, fr constraint, etc.
          console.error("[useDeletarEvento] deleteErr:", deleteErr);
          if (mountedRef.current) setError(deleteErr);
          setLoading(false);
          return { ok: false, error: deleteErr };
        }

        // sucesso
        if (mountedRef.current) {
          setError(null);
        }
        setLoading(false);
        return { ok: true };
      } catch (err) {
        console.error("[useDeletarEvento] exception:", err);
        if (mountedRef.current) setError(err);
        setLoading(false);
        return { ok: false, error: err };
      }
    },
    []
  );

  //retornar as funcionalidades do hook
  return { deleting: loading, error, deletarEvento } as const;
}

//exportar os hooks
export default useDeleteEvent;
