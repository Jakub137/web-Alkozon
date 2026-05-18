import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { NotificationProvider, useNotification } from "@/context/NotificationContext";

const TestComponent = () => {
  const { notifications, addNotification, removeNotification } = useNotification();
  return (
    <div>
      <div data-testid="count">{notifications.length}</div>
      <ul>
        {notifications.map((n) => (
          <li key={n.id} data-testid={`notif-${n.id}`}>
            {n.message} - {n.type}
            <button data-testid={`remove-${n.id}`} onClick={() => removeNotification(n.id)}>
              X
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => addNotification("Test Msg", "success")} data-testid="add-btn">
        Add
      </button>
    </div>
  );
};

describe("NotificationContext Unit Tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("powinien rozpoczynać z pustą listą powiadomień", () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("powinien umożliwiać dodanie i ręczne usunięcie powiadomienia", () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    act(() => {
      screen.getByTestId("add-btn").click();
    });

    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByText("Test Msg - success")).toBeInTheDocument();

    // Wyciągnij dynamicznie wygenerowane id z testid
    const removeBtn = screen.getByText("X");
    act(() => {
      removeBtn.click();
    });

    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("powinien automatycznie usuwać powiadomienia po 3.5 sekundy", () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    act(() => {
      screen.getByTestId("add-btn").click();
    });
    expect(screen.getByTestId("count").textContent).toBe("1");

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expect(screen.getByTestId("count").textContent).toBe("0");
  });
});
