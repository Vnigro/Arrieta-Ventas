import { describe, expect, it } from "vitest";
import { buildVehicleWhatsAppMessage, defaultVehicles, filterVehicles, getVehicleBySlug } from "./inventory";

describe("inventory filters", () => {
  it("filters the catalogue by type and brand", () => {
    const results = filterVehicles(defaultVehicles, { type: "moto", brand: "Honda" });
    expect(results).toHaveLength(2);
    expect(results.every(vehicle => vehicle.type === "moto" && vehicle.brand === "Honda")).toBe(true);
  });

  it("returns an individual published vehicle by its shareable slug", () => {
    const vehicle = getVehicleBySlug(defaultVehicles, "honda-wave-2023");
    expect(vehicle?.model).toBe("Wave");
  });

  it("creates an inquiry message with vehicle identification and the published price", () => {
    const message = buildVehicleWhatsAppMessage(defaultVehicles[0]!);
    expect(message).toContain("Honda Wave 2023");
    expect(message).toContain("honda-wave-2023");
    expect(message).toContain("2.250.000");
  });
});

