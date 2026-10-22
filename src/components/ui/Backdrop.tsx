/** Decorative lighting shared by the page sections. */
export function Backdrop() {
  return (
    <div aria-hidden="true" className="page-backdrop pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="page-backdrop-grid absolute inset-0" />
      <div className="page-backdrop-ring absolute rounded-full" />
      <div className="page-backdrop-ring page-backdrop-ring-inner absolute rounded-full" />
    </div>
  );
}
