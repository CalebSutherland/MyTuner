
export function useThemeUtils() {
  const darkenColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return (
      "#" +
      (
        0x1000000 +
        (Math.max(0, R) << 16) +
        (Math.max(0, G) << 8) +
        Math.max(0, B)
      )
        .toString(16)
        .slice(1)
    );
  };

  const updateMainLight = (hex: string) => {
    const num = parseInt(hex.slice(1), 16);
    const R = (num >> 16) & 0xff;
    const G = (num >> 8) & 0xff;
    const B = num & 0xff;

    let brightCount = 0;
    if (R >= 225) brightCount++;
    if (G >= 225) brightCount++;
    if (B >= 225) brightCount++;

    let lightValue = "rgba(255, 255, 255, 0.1)";
    if (brightCount === 1) lightValue = "rgba(255, 255, 255, 0.3)";
    else if (brightCount >= 2) lightValue = "rgba(255, 255, 255, 0.5)";

    document.documentElement.style.setProperty("--main--light", lightValue);
  };

  return { darkenColor, updateMainLight };
}