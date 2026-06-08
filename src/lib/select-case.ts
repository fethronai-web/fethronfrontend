/**
 * Cross-section deep-linking without URL churn.
 *
 * The Work section keeps its selected project in client state, so a link
 * elsewhere on the page (e.g. the hero's "View Case Study") can't target it
 * with a plain hash. Instead we scroll to #work and fire an event the section
 * listens for, switching to the requested project.
 */
export const SELECT_CASE_EVENT = "fethron:select-case";
export const SELECT_SERVICE_EVENT = "fethron:select-service";

export function selectCase(id: string) {
  if (typeof window === "undefined") return;
  document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.dispatchEvent(new CustomEvent(SELECT_CASE_EVENT, { detail: { id } }));
}

/**
 * Jump to a specific service card. The Services section owns the scroll maths
 * (the desktop deck is scroll-driven, the mobile list is a plain anchor), so we
 * just announce the target index and let whichever variant is mounted handle it.
 */
export function selectService(index: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: { index } }));
}
