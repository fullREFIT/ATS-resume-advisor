import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProgressBar } from "@/components/ProgressBar";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <ProgressBar step={1} />
        <section className="card-layer-1">
          <p className="section-label mb-2">Step 1 — Paste</p>
          <h1 className="text-2xl font-semibold tracking-tight text-carbon-core sm:text-3xl">
            Diagnose your resume against any job description.
          </h1>
          <p className="mt-3 text-base text-carbon-core">
            Brand layer wired. Intake form ships next.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
