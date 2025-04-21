import DocumentGrid from "./document-grid";

export default function Hero() {
  return (
    <section className="bg-[#F8F9FF] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Build Your Legal Forms
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Create Your Free Legal Documents & Contracts Online in Minutes
          </p>
          <DocumentGrid />
        </div>
      </div>
    </section>
  );
}
