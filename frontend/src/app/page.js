import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1F1F1F] text-white p-6">
      <div className="text-center space-y-4">
        <div className="relative w-32 h-32 mx-auto mb-4 bg-white/5 p-4 rounded-full border border-gray-700 flex items-center justify-center">
          <Image 
            src="/cc-logo.jpg" 
            alt="Club Chef Logo" 
            width={100} 
            height={100}
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to <span className="text-[#B5E61D]">CodeChef</span>
        </h1>
        <p className="text-gray-400 max-w-md">
          The ultimate platform for club management and coding event registrations. Powered by Next.js & FastAPI.
        </p>
      </div>
    </main>
  );
}