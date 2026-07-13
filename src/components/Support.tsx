const Support = () => {
  return (
    <section className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Support</h1>
        <div className="h-1 w-16 bg-blue-600 rounded-full mx-auto mb-4" />
        <p className="text-slate-600 max-w-2xl mx-auto">
          Responsible gambling and support resources.
        </p>
      </div>
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-lg p-8 max-w-3xl mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Responsible Gambling</h2>
        <p className="text-slate-700 leading-relaxed">
          We take responsible gambling seriously and want every experience to stay safe,
          positive, and in your control.
        </p>
        <p className="text-slate-700 leading-relaxed">
          If you need support, please reach out to ConnexOntario&apos;s toll-free number:{" "}
          <strong>1-866-531-2600</strong> or visit responsible gambling resources in your region.
        </p>
      </div>
    </section>
  );
};

export default Support;
