import { RoleTag, SectionKey } from '../types/profile';

interface Props {
  isOwner: boolean;
  sectionOrder: SectionKey[];
  selectedRoles: RoleTag[];
  onMoveSection: (section: SectionKey, direction: -1 | 1) => void;
  onToggleRole: (role: RoleTag) => void;
}

const roleOptions: RoleTag[] = ['Artist', 'Developer', 'Writer', 'Ambassador', 'Collector', 'Builder'];

export function CurationControls({ isOwner, sectionOrder, selectedRoles, onMoveSection, onToggleRole }: Props) {
  if (!isOwner) return null;

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Curation controls</h2>
      <p className="mt-1 text-xs text-slate-400">Only featured items, section order, and role tags can be customized.</p>

      <div className="mt-4">
        <h3 className="text-sm text-slate-200">Section priority</h3>
        <div className="mt-2 space-y-2">
          {sectionOrder.map((section, index) => (
            <div key={section} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200">
              <span>{section}</span>
              <div className="flex gap-2">
                <button disabled={index === 0} onClick={() => onMoveSection(section, -1)} className="rounded border border-slate-700 px-2 py-1 disabled:opacity-30">
                  Up
                </button>
                <button disabled={index === sectionOrder.length - 1} onClick={() => onMoveSection(section, 1)} className="rounded border border-slate-700 px-2 py-1 disabled:opacity-30">
                  Down
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm text-slate-200">Primary role tags (max 3)</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {roleOptions.map((role) => {
            const selected = selectedRoles.includes(role);
            return (
              <button
                key={role}
                onClick={() => onToggleRole(role)}
                className={`rounded-full border px-3 py-1 text-xs ${selected ? 'border-blue-700 bg-blue-950 text-blue-100' : 'border-slate-700 text-slate-200'}`}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
