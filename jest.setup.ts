import "@testing-library/jest-dom";

// jsdom does not implement IntersectionObserver, but useScrollReveal (used by
// DoctorCard and several pages) relies on it — stub it out so those
// components can render in tests without crashing.
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// next/navigation's useRouter throws outside a real Next.js app router tree;
// give every test a working mock by default (individual tests can override
// specific methods with jest.spyOn if they need to assert navigation calls).
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));