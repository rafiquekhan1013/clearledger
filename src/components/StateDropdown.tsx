export interface StateOption {
  slug: string;
  label?: string;
  type?: string;
}

interface StateDropdownProps {
  focusOnMount?: boolean;
  states: StateOption[];
  value: string;
  onSelect: (slug: string) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  /** When true, omit bottom margin (e.g. when used in a flex row with other dropdowns) */
  noMargin?: boolean;
}

export function StateDropdown({
  focusOnMount = false,
  states,
  value,
  onSelect,
  label = "Select your state",
  placeholder = "Select your state",
  id = "state-select",
  noMargin = false,
}: StateDropdownProps) {
  return (
    <div className={`w-full max-w-[360px] ${noMargin ? "" : "mb-4"}`}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        autoFocus={focusOnMount}
        value={value}
        onChange={(e) => {
          const slug = e.target.value;
          if (slug) onSelect(slug);
        }}
        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
      >
        <option value="">{placeholder}</option>
        {states.map((state) => (
          <option key={state.slug} value={state.slug}>
            {state.label ?? state.slug}
          </option>
        ))}
      </select>
    </div>
  );
}
