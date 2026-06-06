/** Upper-cases the first character and lower-cases the rest ("VOTING" -> "Voting"). */
export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
