import Layout from "@/components/Layout";




export default function Home() {
  return (
  <Layout>
    <div className="h-screen flex flex-col justify-center bg-white">
      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-3">
          <div className="">
            
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-4xl font-bold text-gray-800">Welcome to Next.js</h1>
            <p className="text-gray-600">A React framework for building production grade applications.</p>
          </div>
      </div>
      </div>
    </div>
  </Layout>
  );
}
