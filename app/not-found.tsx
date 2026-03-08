import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-base">
      <div className="text-center">
        <span className="font-serif text-[120px] leading-none font-bold text-preto/5">
          404
        </span>
        <h1 className="font-serif text-4xl mt-4 mb-4">
          Pagina nao encontrada
        </h1>
        <p className="opacity-60 mb-8 max-w-md mx-auto">
          A pagina que voce procura nao existe ou foi movida.
        </p>
        <Link
          href="/"
          className="btn-premium px-8 py-4 inline-block uppercase text-xs tracking-widest font-bold"
        >
          Voltar ao Inicio
        </Link>
      </div>
    </main>
  );
}
