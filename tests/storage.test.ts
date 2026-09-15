import { describe, expect, it } from "vitest";

import { hasExpectedImageSignature } from "../src/lib/image-validation";

describe("uploaded image validation", () => {
  it("accepts only the expected binary signature for each supported image type", () => {
    expect(
      hasExpectedImageSignature(
        "image/jpeg",
        Uint8Array.from([0xff, 0xd8, 0xff, 0xdb]),
      ),
    ).toBe(true);
    expect(
      hasExpectedImageSignature(
        "image/png",
        Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ),
    ).toBe(true);
    expect(
      hasExpectedImageSignature(
        "image/webp",
        Uint8Array.from([
          0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42,
          0x50,
        ]),
      ),
    ).toBe(true);
  });

  it("rejects a file that only claims to be an image", () => {
    expect(
      hasExpectedImageSignature(
        "image/png",
        new TextEncoder().encode("<script>alert('not an image')</script>"),
      ),
    ).toBe(false);
  });
});
