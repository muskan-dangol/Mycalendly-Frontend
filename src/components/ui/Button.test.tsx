import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./button.tsx";

describe("Button component", () => {
  it("renders the button with default props", () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole("button", { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      "bg-[var(--accent)] text-white hover:bg-[var(--accent-border)] border border-transparent shadow-sm",
      "h-10 px-4 py-2",
    );
  });

  it("applies the correct variant and size classes", () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    );
    const buttonElement = screen.getByRole("button", { name: /delete/i });
    expect(buttonElement).toHaveClass(
      "bg-red-600 text-white hover:bg-red-700 border border-transparent",
      "h-12 rounded-lg px-8 text-base",
    );
  });

  it("renders as a child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );
    const linkElement = screen.getByRole("link", { name: /link button/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe("A");
  });
});
