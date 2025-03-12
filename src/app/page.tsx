import Map from '@/components/Map';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Sidebar />
      <Map />
    </main>
  );
}
