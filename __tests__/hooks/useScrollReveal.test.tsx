import { render, act } from "@testing-library/react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

let observeMock: jest.Mock;
let unobserveMock: jest.Mock;
let capturedCallback: IntersectionObserverCallback | null = null;

function TestComponent({ delay = 0 }: { delay?: number }) {
  const { ref, isVisible } = useScrollReveal({ delay });
  return (
    <div ref={ref} data-testid="target">
      {isVisible ? "visible" : "hidden"}
    </div>
  );
}

describe("useScrollReveal", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    observeMock = jest.fn();
    unobserveMock = jest.fn();
    capturedCallback = null;

    // @ts-expect-error - simplified mock for test purposes
    global.IntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
      capturedCallback = callback;
      return {
        observe: observeMock,
        unobserve: unobserveMock,
        disconnect: jest.fn(),
      };
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts hidden and observes the target element", () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("target")).toHaveTextContent("hidden");
    expect(observeMock).toHaveBeenCalledTimes(1);
  });

  it("becomes visible once the element intersects the viewport", () => {
    const { getByTestId } = render(<TestComponent delay={0} />);

    act(() => {
      capturedCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
      jest.runAllTimers();
    });

    expect(getByTestId("target")).toHaveTextContent("visible");
  });

  it("unobserves the element once revealed (once: true is the default)", () => {
    render(<TestComponent delay={0} />);

    act(() => {
      capturedCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
      jest.runAllTimers();
    });

    expect(unobserveMock).toHaveBeenCalledTimes(1);
  });
});
