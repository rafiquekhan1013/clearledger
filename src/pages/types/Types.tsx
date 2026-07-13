import { Link } from "react-router-dom";
import { Types as typesList } from "../../types";

interface TypesProps {
  provider: string;
  state?: string;
}

const Types = ({ state, provider }: TypesProps) => {
  const tolink =
    provider === "playcan"
      ? `/${state ?? ""}`
      : state
        ? `/${provider}/${state}`
        : `/${provider}`;

  return (
    <section className="py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Choose an Option Below</h1>
        <div className="h-1 w-16 bg-blue-600 rounded-full mx-auto mb-4" />
      </div>
      <div className="flex flex-wrap gap-4 justify-center max-w-2xl mx-auto">
        {typesList.map((type) => {
          return (
            <Link
              key={type.slug}
              to={`${tolink}/${type.slug}`}
              className="px-6 py-4 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              {type.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Types;
