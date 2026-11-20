export const DEMO_SESSION_COOKIE = "casabowl_demo_session";
export const DEMO_SESSION_VALUE = "demo-customer-preview";

export function isDemoSessionValue(value: string | undefined | null): boolean {
  return value === DEMO_SESSION_VALUE;
}

export const DEMO_STAFF_COOKIE = "casabowl_staff_session";
export const DEMO_STAFF_VALUE = "demo-staff-preview";

export function isDemoStaffValue(value: string | undefined | null): boolean {
  return value === DEMO_STAFF_VALUE;
}
