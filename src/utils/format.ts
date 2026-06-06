/** Upper-cases the first character and lower-cases the rest ("VOTING" -> "Voting"). */
export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

/** Formats a rating delta with an explicit sign ("+12", "-7", "0"), rounded to an integer. */
export const formatRatingDelta = (delta: number): string => {
  const rounded = Math.round(delta);
  return rounded > 0 ? `+${rounded}` : String(rounded);
};
