import TasksPage from "./components/TasksPage";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#eef2ff_35%,_#f8fafc_100%)] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <main className="mx-auto w-full max-w-6xl">
        <TasksPage />
      </main>
    </div>
  );
}
